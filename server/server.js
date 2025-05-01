import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import chat from './routes/messageRoutes.js';
import avatars from './routes/avatarRoutes.js';

import SocketConnection from "./socketHandlers/chatSocket.js";

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', chat);
app.use('/api', avatars);

const server = createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.CHATTER_APP_URL_CLIENT, 
        methods: ['GET', 'POST']}
}); 
SocketConnection(io);

server.listen(port, ()=>
{
    console.log("Server started on port ",port);
});