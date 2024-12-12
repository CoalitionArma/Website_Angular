import express, { Request, Response} from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import SQLUsers from './models/userModel.interface';
import sequelize from './db';
import jwt from 'jsonwebtoken';
import { UserResponse } from './interfaces/userresponse.interface';

dotenv.config();

const app = express();
const port = 3157;
const allowedOrigins = ['http://localhost:4200', 'http://coalitiongroup.net', 'https://coalitiongroup.net'];

// TODO: Move elsewhere
const JWT_SECRET = process.env['JWT_SECRET'] as string;
function generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}
function authenticateToken(req: Request, res: Response, next: () => void) {
    console.log(req.headers);
    const token = req.headers['access_token'] as string;
    if (!token) return res.status(401).json({ error: 'Unauthenticated' });

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
        if (err) return res.status(401).json({ error: 'Failed to authenticate token' });

        req.body.id = decoded.id;
        next();
    });
}

app.use(bodyParser.json());
app.use(cors({ origin: allowedOrigins }));

app.post('/api/oauth/token', async (req: Request, res: Response) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).send('Code is required');
    }

    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env['CLIENT_ID'] as string);
        params.append('client_secret', process.env['CLIENT_SECRET'] as string);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', process.env['REDIRECT_URI'] as string);
        params.append('scope', 'identify');
        
        const response = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Accept': 'application/json'
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/users', async (req: Request, res: Response) => {
    const { id, email, global_name } = req.body;
    try {
        let user = await SQLUsers.findOne({ where: { discordid: id } });
        if (user) {
            user.username = global_name;
            user.email = email;
            await user.save().then((user) => {
                const token = generateToken(user.discordid);
                res.status(200).json({ user, token });
            });
        } else {
            await SQLUsers.create({ 
                discordid: id,
                steamid: null,
                email: email,
                teamspeakid: null,
                username: global_name,
                section: 'N/A',
                veterancy: 'N/A',
                armaguid: null 
            }).then((newUser) => {
                const token = generateToken(newUser.discordid);
                res.status(200).json({ newUser, token });
            })
        }
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Error creating user');
    }
});

app.post('/api/update/user', authenticateToken, async (req: Request, res: Response) => {
    const { email } = req.body;
    const userId = req.body.id;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        let user = await SQLUsers.findOne({ where: { discordid: userId } });
        if (user) {
            user.email = email;
            await user.save();
            res.status(200).json({ message: 'Email updated successfully' });
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).send('Internal Server Error');
    }
});

sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    })
}).catch((error) => {
    console.error('Error syncing database:', error);
});