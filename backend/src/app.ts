import express, { Request, Response, NextFunction, Application } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import SQLUsers from './models/userModel.interface';
import Event from './models/eventModel';
import sequelize from './db';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { DiscordUserResponse } from './interfaces/userresponse.interface';
import { QueryTypes } from 'sequelize';

// Type definitions
interface CreateUserRequest {
    id: string;
    email: string;
    global_name: string;
}

interface UpdateUserRequest {
    id?: string;
    discordid: string;
    steamid?: string;
    email: string;
    teamspeakid?: string;
    username: string;
    section?: string;
    veterancy?: string;
    armaguid?: string;
}

// Event interfaces
interface EventGroup {
    id: string;
    name: string;
    roles: EventRole[];
}

interface EventRole {
    id: string;
    name: string;
    slottedUser?: string;
    slottedUserId?: string;
}

interface CreateEventRequest {
    title: string;
    description?: string;
    bannerUrl?: string;
    dateTime: string;
    groups: Array<{
        name: string;
        roles: Array<{ name: string }>;
    }>;
}

interface SlotRoleRequest {
    eventId: string;
    groupId: string;
    roleId: string;
}

interface AuthenticatedRequest extends Request {
    body: any & { id?: string };
}

// Load the appropriate .env file based on NODE_ENV
// Set default to development if NODE_ENV is not set
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile: string = nodeEnv === 'development' ? '.env.development' : '.env.production';
dotenv.config({ path: envFile });

console.log(`🌍 Loading environment: ${nodeEnv}`);
console.log(`📁 Using env file: ${envFile}`);

const app: Application = express();
const port: number = 3157;
const allowedOrigins: string[] = [
    'http://localhost:4200', 
    'http://coalitiongroup.net', 
    'https://coalitiongroup.net'
];

app.use((req: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// JWT Configuration
const JWT_SECRET: string = process.env.JWT_SECRET as string;

interface AuthenticatedRequest extends Request {
    body: any & { id?: string };
}

const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.headers['access_token'] as string;
    
    if (!token) {
        res.status(401).json({ error: 'Unauthenticated' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: JwtPayload | string | undefined): void => {
        if (err) {
            res.status(401).json({ error: 'Failed to authenticate token' });
            return;
        }

        if (typeof decoded === 'object' && decoded && 'id' in decoded) {
            req.body.id = decoded.id;
            next();
        } else {
            res.status(401).json({ error: 'Invalid token format' });
        }
    });
};

app.use(bodyParser.json());
app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// OAuth Token Endpoint
app.post('/api/oauth/token', async (req: Request, res: Response): Promise<void> => {
    const { code }: { code?: string } = req.body;
    
    if (!code) {
        res.status(400).send('Code is required');
        return;
    }

    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID as string);
        params.append('client_secret', process.env.CLIENT_SECRET as string);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', process.env.REDIRECT_URI as string);
        params.append('scope', 'identify');
        
        const response = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Accept': 'application/json'
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('OAuth token error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// User Management Endpoints
app.post('/api/users', async (req: Request<{}, {}, CreateUserRequest>, res: Response): Promise<void> => {
    const { id, email, global_name } = req.body;
    
    try {
        const user = await SQLUsers.findOne({ where: { discordid: id } });
        
        if (user) {
            user.username = global_name;
            user.email = email;
            const savedUser = await user.save();
            const token = generateToken(savedUser.discordid);
            res.status(200).json({ user: savedUser, token });
        } else {
            const newUser = await SQLUsers.create({ 
                discordid: id,
                steamid: null,
                email: email,
                teamspeakid: null,
                username: global_name,
                section: 'N/A',
                veterancy: 'N/A',
                armaguid: null 
            });
            const token = generateToken(newUser.discordid);
            res.status(200).json({ newUser, token });
        }
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Error creating user');
    }
});

app.post('/api/update/user', authenticateToken, async (req: Request<{}, {}, UpdateUserRequest>, res: Response): Promise<void> => {
    const { 
        id, 
        discordid, 
        steamid, 
        email, 
        teamspeakid, 
        username, 
        section, 
        veterancy, 
        armaguid 
    } = req.body;
    
    try {
        const user = await SQLUsers.findOne({ where: { discordid } });

        if (user) {
            user.steamid = steamid || null;
            user.email = email;
            user.teamspeakid = teamspeakid || null;
            user.username = username;
            user.section = section || 'N/A';
            user.veterancy = veterancy || 'N/A';
            user.armaguid = armaguid || null;

            await user.save();
            res.status(200).json({ message: 'User updated successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

// User Statistics Endpoint
app.get('/api/user/stats/:userId', authenticateToken, async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
    const { userId } = req.params;
    
    try {
        // First, get the user's ARMA GUID from the database
        const user = await SQLUsers.findOne({ 
            where: { discordid: userId },
            attributes: ['armaguid', 'username']
        });
        
        console.log(`Stats request for user ${userId}:`, user ? `Found user ${user.username}, ARMA GUID: ${user.armaguid}` : 'User not found');
        
        if (!user) {
            res.status(404).json({ 
                error: 'User not found in database',
                message: 'User account does not exist'
            });
            return;
        }
        
        if (!user.armaguid) {
            res.status(404).json({ 
                error: 'No ARMA GUID found for this user',
                message: 'User needs to set their ARMA GUID in profile settings'
            });
            return;
        }
        
        // Call the stored procedure to get user statistics using ARMA GUID
        console.log(`Calling GetUserA4Stats with ARMA GUID: ${user.armaguid}`);
        const results = await sequelize.query('CALL GetUserA4Stats(?)', {
            replacements: [user.armaguid],
            type: QueryTypes.RAW
        });
        
        // For stored procedures, results[0] is the actual data object, not an array
        const userStatsData = results[0] as any;
        
        if (!userStatsData) {
            res.status(404).json({ 
                error: 'No statistics found for this user',
                message: `User may not have played any ARMA 4 missions yet. ARMA GUID: ${user.armaguid}`
            });
            return;
        }
        
        // The data is the object itself, not an array element
        const data = userStatsData;
        
        if (!data) {
            res.status(404).json({ 
                error: 'No data found in statistics result',
                message: `Statistics query returned empty result for ARMA GUID: ${user.armaguid}`
            });
            return;
        }
        
        // Extract stats from the result
        const stats = {
            id: data.id,
            steamid: data.steamid,
            name: data.name,
            guid: data.guid,
            kills: data.kills,
            deaths: data.deaths,
            kd_ratio: data.kd_ratio,
            tvt_kdr: data.tvt_kdr,
            ai_kills: data.ai_kills,
            ai_deaths: data.ai_deaths,
            coop_kdr: data.coop_kdr,
            shots_fired: data.shots_fired,
            accuracy_percentage: data.accuracy_percentage,
            friendly_fire_events: data.friendly_fire_events,
            grenades_thrown: data.grenades_thrown,
            civilians_killed: data.civilians_killed,
            disconnections: data.disconnections,
            connections: data.connections
        };
        
        // For now, create a default ranking since the stored procedure doesn't include it yet
        const ranking = {
            total_players: data.total_players || 0,
            rank_position: data.rank_position || 0
        };
        
        res.status(200).json({
            success: true,
            stats: stats,
            ranking: ranking,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch user statistics',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Missions List Endpoint
app.get('/api/missions', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            limit = '50',
            offset = '0',
            gametype,
            terrain,
            author,
            search
        } = req.query;

        console.log('Missions request params:', { limit, offset, gametype, terrain, author, search });

        // Call the stored procedure to get missions list
        const results = await sequelize.query('CALL GetMissionsList(?, ?, ?, ?, ?, ?)', {
            replacements: [
                parseInt(limit as string),
                parseInt(offset as string),
                gametype || null,
                terrain || null,
                author || null,
                search || null
            ],
            type: QueryTypes.RAW
        });

        console.log('Raw stored procedure results:', JSON.stringify(results, null, 2));

        // MySQL stored procedures return results in a nested array format
        // results[0] is the actual data array
        let missionsData: any[] = [];
        
        if (Array.isArray(results) && results.length > 0) {
            if (Array.isArray(results[0])) {
                missionsData = results[0] as any[];
            } else {
                // Sometimes the result is directly the array
                missionsData = results as any[];
            }
        }

        console.log('Processed missions data:', missionsData);

        if (!missionsData || missionsData.length === 0) {
            res.status(200).json({
                success: true,
                missions: [],
                total_count: 0,
                current_page: Math.floor(parseInt(offset as string) / parseInt(limit as string)) + 1,
                total_pages: 0
            });
            return;
        }

        // Extract total count from first row (all rows have same total_count)
        const totalCount = missionsData[0]?.total_count || 0;
        const totalPages = Math.ceil(totalCount / parseInt(limit as string));
        const currentPage = Math.floor(parseInt(offset as string) / parseInt(limit as string)) + 1;

        console.log('Total count from data:', totalCount);

        // Remove total_count from individual mission objects and map fields correctly
        const missions = missionsData.map(mission => ({
            id: mission.id,
            name: mission.name,
            author: mission.author,
            terrain: mission.terrain,
            description: mission.details, // Map "details" from DB to "description" for frontend
            gametype: mission.gametype,
            players: mission.players,
            sidecounts: mission.sidecounts,
            jsonlink: mission.jsonlink || '',
            jsondata: mission.jsondata || null
        }));

        const response = {
            success: true,
            missions: missions,
            total_count: totalCount,
            current_page: currentPage,
            total_pages: totalPages,
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
        };

        console.log('Sending response:', response);
        res.status(200).json(response);

    } catch (error) {
        console.error('Error fetching missions:', error);
        res.status(500).json({
            error: 'Failed to fetch missions',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Events Management Endpoints

// Get all events
app.get('/api/events', async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await Event.findAll({
            order: [['dateTime', 'ASC']],
        });

        // Transform the response to match the frontend interface
        const transformedEvents = events.map(event => {
            const eventData = event.toJSON();
            return {
                ...eventData,
                groups: typeof eventData.groups === 'string' 
                    ? JSON.parse(eventData.groups) 
                    : eventData.groups
            };
        });

        res.status(200).json(transformedEvents);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            error: 'Failed to fetch events',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Create a new event
app.post('/api/events', authenticateToken, async (req: Request<{}, {}, CreateEventRequest>, res: Response): Promise<void> => {
    try {
        const { title, description, bannerUrl, dateTime, groups } = req.body;
        const userId = (req.body as any).id; // From JWT token

        // Get user info for the createdByUsername
        const user = await SQLUsers.findOne({ where: { discordid: userId } });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Generate IDs for groups and roles and transform the data
        const processedGroups: EventGroup[] = groups.map(group => ({
            id: require('crypto').randomUUID(),
            name: group.name,
            roles: group.roles.map(role => ({
                id: require('crypto').randomUUID(),
                name: role.name,
                slottedUser: undefined,
                slottedUserId: undefined
            }))
        }));

        // Create the event
        const event = await Event.create({
            title,
            description: description || '',
            bannerUrl: bannerUrl || '',
            dateTime: new Date(dateTime),
            createdBy: userId,
            createdByUsername: user.username,
            groups: JSON.stringify(processedGroups)
        });

        // Return the created event with parsed groups
        const eventData = event.toJSON();
        const responseEvent = {
            ...eventData,
            groups: JSON.parse(eventData.groups as string)
        };

        res.status(201).json({
            success: true,
            event: responseEvent,
            message: 'Event created successfully'
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create event',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Slot a user into a role
app.post('/api/events/slot', authenticateToken, async (req: Request<{}, {}, SlotRoleRequest>, res: Response): Promise<void> => {
    try {
        const { eventId, groupId, roleId } = req.body;
        const userId = (req.body as any).id; // From JWT token

        // Get user info
        const user = await SQLUsers.findOne({ where: { discordid: userId } });
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Find the event
        const event = await Event.findByPk(eventId);
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'Event not found'
            });
            return;
        }

        // Parse the groups
        const groups: EventGroup[] = JSON.parse(event.groups as string);
        
        // Find the group and role
        const group = groups.find(g => g.id === groupId);
        if (!group) {
            res.status(404).json({
                success: false,
                message: 'Group not found'
            });
            return;
        }

        const role = group.roles.find(r => r.id === roleId);
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Role not found'
            });
            return;
        }

        // Check if role is already slotted by someone else
        if (role.slottedUserId && role.slottedUserId !== userId) {
            res.status(400).json({
                success: false,
                message: 'Role is already taken by another user'
            });
            return;
        }

        // Check if user is already slotted in another role in this event
        let userAlreadySlotted = false;
        for (const g of groups) {
            for (const r of g.roles) {
                if (r.slottedUserId === userId && r.id !== roleId) {
                    // Unslot user from the previous role
                    r.slottedUser = undefined;
                    r.slottedUserId = undefined;
                    userAlreadySlotted = true;
                    break;
                }
            }
            if (userAlreadySlotted) break;
        }

        // Slot the user into the role
        role.slottedUser = user.username;
        role.slottedUserId = userId;

        // Update the event
        await event.update({ groups: JSON.stringify(groups) });

        // Return the updated event
        const eventData = event.toJSON();
        const responseEvent = {
            ...eventData,
            groups: JSON.parse(eventData.groups as string)
        };

        res.status(200).json({
            success: true,
            event: responseEvent,
            message: 'Successfully slotted into role'
        });
    } catch (error) {
        console.error('Error slotting role:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to slot into role',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Unslot a user from a role
app.post('/api/events/unslot', authenticateToken, async (req: Request<{}, {}, SlotRoleRequest>, res: Response): Promise<void> => {
    try {
        const { eventId, groupId, roleId } = req.body;
        const userId = (req.body as any).id; // From JWT token

        // Find the event
        const event = await Event.findByPk(eventId);
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'Event not found'
            });
            return;
        }

        // Parse the groups
        const groups: EventGroup[] = JSON.parse(event.groups as string);
        
        // Find the group and role
        const group = groups.find(g => g.id === groupId);
        if (!group) {
            res.status(404).json({
                success: false,
                message: 'Group not found'
            });
            return;
        }

        const role = group.roles.find(r => r.id === roleId);
        if (!role) {
            res.status(404).json({
                success: false,
                message: 'Role not found'
            });
            return;
        }

        // Check if the user is actually slotted in this role
        if (role.slottedUserId !== userId) {
            res.status(400).json({
                success: false,
                message: 'You are not slotted in this role'
            });
            return;
        }

        // Unslot the user
        role.slottedUser = undefined;
        role.slottedUserId = undefined;

        // Update the event
        await event.update({ groups: JSON.stringify(groups) });

        // Return the updated event
        const eventData = event.toJSON();
        const responseEvent = {
            ...eventData,
            groups: JSON.parse(eventData.groups as string)
        };

        res.status(200).json({
            success: true,
            event: responseEvent,
            message: 'Successfully unslotted from role'
        });
    } catch (error) {
        console.error('Error unslotting role:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to unslot from role',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Delete an event (only by creator)
app.delete('/api/events/:eventId', authenticateToken, async (req: Request<{ eventId: string }>, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params;
        const userId = (req.body as any).id; // From JWT token

        // Find the event
        const event = await Event.findByPk(eventId);
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'Event not found'
            });
            return;
        }

        // Check if the user is the creator
        if (event.createdBy !== userId) {
            res.status(403).json({
                success: false,
                message: 'Only the event creator can delete this event'
            });
            return;
        }

        // Delete the event
        await event.destroy();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete event',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Mission Statistics Proxy Endpoint
app.get('/api/mission-stats/:missionId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { missionId } = req.params;
        
        // First, get the mission's jsonlink from the database
        const mission = await sequelize.query('SELECT jsonlink FROM coalition.a4missions WHERE id = ?', {
            replacements: [missionId],
            type: QueryTypes.SELECT
        });
        
        if (!mission || mission.length === 0) {
            res.status(404).json({
                error: 'Mission not found'
            });
            return;
        }
        
        const missionData = mission[0] as any;
        const jsonlink = missionData.jsonlink;
        
        if (!jsonlink) {
            res.status(404).json({
                error: 'No statistics data available for this mission'
            });
            return;
        }
        
        console.log(`Fetching mission stats for mission ${missionId} from: ${jsonlink}`);
        
        // Use Node.js native https module to fetch the JSON data
        const https = require('https');
        const url = require('url');
        
        const fetchUrl = new URL(jsonlink);
        console.log(`Parsed URL - hostname: ${fetchUrl.hostname}, path: ${fetchUrl.pathname}${fetchUrl.search}`);
        
        const options = {
            hostname: fetchUrl.hostname,
            port: fetchUrl.port || 443,
            path: fetchUrl.pathname + fetchUrl.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Coalition-Website/1.0',
                'Accept': 'application/json, text/plain, */*'
            }
        };
        
        console.log('Request options:', options);
        
        const statsData = await new Promise((resolve, reject) => {
            const req = https.request(options, (res: any) => {
                let data = '';
                
                res.on('data', (chunk: any) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        console.log(`Response status: ${res.statusCode}`);
                        console.log(`Response headers:`, res.headers);
                        console.log(`Response data length: ${data.length}`);
                        console.log(`Response data preview: ${data.substring(0, 200)}...`);
                        
                        if (res.statusCode !== 200) {
                            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                            return;
                        }
                        
                        // Check if the response looks like HTML (but allow JSON with incorrect content-type)
                        if (data.trim().toLowerCase().startsWith('<!doctype') || 
                            data.trim().toLowerCase().startsWith('<html')) {
                            reject(new Error(`External URL returned HTML instead of JSON. This usually means the file doesn't exist or there's an error page. URL: ${jsonlink}`));
                            return;
                        }
                        
                        // Try to parse as JSON regardless of Content-Type header
                        // Some servers serve JSON files with incorrect content-type headers
                        let parsed;
                        try {
                            parsed = JSON.parse(data);
                        } catch (jsonError) {
                            const contentType = res.headers['content-type'] || '';
                            reject(new Error(`Failed to parse response as JSON. Content-Type: ${contentType}. JSON Parse Error: ${jsonError}. URL: ${jsonlink}`));
                            return;
                        }
                        
                        console.log('Successfully parsed JSON data from external URL');
                        resolve(parsed);
                    } catch (parseError) {
                        reject(new Error(`Failed to parse JSON: ${parseError}. Response was: ${data.substring(0, 200)}...`));
                    }
                });
            });
            
            req.on('error', (error: any) => {
                reject(error);
            });
            
            req.end();
        });
        
        res.status(200).json({
            success: true,
            data: statsData,
            source: jsonlink,
            debug: {
                contentType: 'application/json',
                dataType: Array.isArray(statsData) ? 'array' : typeof statsData
            }
        });
        
    } catch (error) {
        console.error('Error fetching mission statistics:', error);
        res.status(500).json({
            error: 'Failed to fetch mission statistics',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Replay Files Endpoint
app.get('/api/replays', async (req: Request, res: Response): Promise<void> => {
    try {
        // Configure the path to your Apache htdocs replays directory
        // You may need to adjust this path based on your server setup
        const replaysPath = process.env.REPLAYS_DIRECTORY || 'C:/xampp/htdocs/replays';
        const baseUrl = process.env.REPLAYS_BASE_URL || 'http://localhost/replays';
        
        console.log('Checking replays directory:', replaysPath);

        // Check if directory exists
        if (!fs.existsSync(replaysPath)) {
            res.status(404).json({
                error: 'Replays directory not found',
                details: `Directory ${replaysPath} does not exist`
            });
            return;
        }

        // Read directory contents
        const files = fs.readdirSync(replaysPath);
        
        // Filter for replay files (you can adjust extensions as needed)
        const replayExtensions = ['.rp', '.replay', '.rec', '.demo', '.zip', '.7z'];
        const replayFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return replayExtensions.includes(ext);
        });

        // Get file details
        const replaysWithDetails = replayFiles.map(filename => {
            const filePath = path.join(replaysPath, filename);
            const stats = fs.statSync(filePath);
            const ext = path.extname(filename);
            const nameWithoutExt = path.basename(filename, ext);
            
            return {
                filename: filename,
                name: nameWithoutExt,
                extension: ext.substring(1), // Remove the dot
                size: stats.size,
                sizeFormatted: formatFileSize(stats.size),
                dateModified: stats.mtime.toISOString(),
                downloadUrl: `${baseUrl}/${encodeURIComponent(filename)}`
            };
        });

        // Sort by date modified (newest first)
        replaysWithDetails.sort((a, b) => 
            new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
        );

        res.status(200).json({
            success: true,
            replays: replaysWithDetails,
            total_count: replaysWithDetails.length,
            directory: replaysPath,
            base_url: baseUrl
        });

    } catch (error) {
        console.error('Error fetching replay files:', error);
        res.status(500).json({
            error: 'Failed to fetch replay files',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Helper function to format file sizes
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Server Initialization
const startServer = async (): Promise<void> => {
    try {
        await sequelize.sync();
        console.log('✅ Database synced successfully');
        
        app.listen(port, (): void => {
            console.log(`🚀 Server running at http://localhost:${port}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();