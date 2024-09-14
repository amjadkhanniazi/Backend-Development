import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Message from './models/messages.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

app.get('/', (req, res) => {
    res.json('Server is running');
});

// API to get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        console.log(messages);
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API to post a new message
app.post('/api/messages', async (req, res) => {
    const { text } = req.body;
    try {
        const newMessage = new Message({ text });
        await newMessage.save();
        io.emit('message', newMessage); // Broadcast new message to all clients
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// API to delete a message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        io.emit('messageDeleted', req.params.id); // Notify clients about deleted message
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle real-time message event
    socket.on('message', async (data) => {
        try {
            const newMessage = new Message({ text: data });
            await newMessage.save();
            io.emit('message', newMessage); // Broadcast message to all clients
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});