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
const port = process.env.PORT;
connectDB();

app.use(express.json());

// For express
app.use(cors({
    origin: [process.env.CHATTER_APP_URL_CLIENT, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
}));

// For Socket.IO
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.CHATTER_APP_URL_CLIENT, 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT'],
        credentials: true,
    },
});

app.use('/api', userRoutes);
app.use('/api', chat);
app.use('/api', avatars);

SocketConnection(io);

server.listen(port, ()=>
{
    console.log("Server started on port ",port);
});

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// // Handle preflight requests
// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(200);
// });