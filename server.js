import 'dotenv/config';
import express from 'express';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import generateBlogRouter from './routes/generateBlog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static HTML/CSS/JS frontend
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/generate', generateBlogRouter);

// Base route for sanity check
app.get('/status', (req, res) => {
    res.send({ status: "AI Blog Agent Server is running" });
});

app.listen(PORT, '0.0.0.0', () => {
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const devName in interfaces) {
        if (devName.includes('WSL') || devName.includes('vEthernet')) continue;
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                localIp = alias.address;
            }
        }
    }
    console.log(`AI Blog Generation Agent running locally on http://localhost:${PORT}`);
    console.log(`AI Blog Generation Agent running on your network at http://${localIp}:${PORT}`);
});
