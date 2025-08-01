import express, { Request, Response, NextFunction, Application } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import SQLUsers from './models/userModel.interface';
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

interface AuthenticatedRequest extends Request {
    body: any & { id?: string };
}

// Load the appropriate .env file based on NODE_ENV
const envFile: string = process.env.NODE_ENV === 'development' ? '.env.development' : '.env';
dotenv.config({ path: envFile });

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
            sidecounts: mission.sidecounts
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