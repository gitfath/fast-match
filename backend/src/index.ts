import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import helmet from 'helmet';
import hpp from 'hpp';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import monetizationRoutes from './routes/monetizationRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For development
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- SECURITY MIDDLEWARE ---
// 1. Helmet for security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Rate limiting to prevent brute force/DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Trop de requêtes, veuillez réessayer dans 15 minutes.'
});
// app.use('/api/', limiter);

// 3. Prevent HTTP Parameter Pollution
app.use(hpp());

// 4. Tighten JSON size
app.use(express.json({ limit: '10kb' }));

// 5. CORS
app.use(cors());

// ... variables

// Serve uploads with CORS headers
app.use('/uploads', cors(), express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/monetization', monetizationRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/admin', adminRoutes);


// ... rest of code

app.post('/test-post', (req, res) => {
    console.log('Test post reached:', req.body);
    res.json({ message: 'Post works', body: req.body });
});

app.get('/', (req, res) => {
    res.send('Fast Match API is running 🚀');
});

// Socket.io setup
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (matchId) => {
        socket.join(matchId);
        console.log(`User ${socket.id} joined room ${matchId}`);
    });

    socket.on('send_message', (data) => {
        // data: { matchId, senderId, content, createdAt }
        io.to(data.matchId).emit('receive_message', data);
    });

    socket.on('mark_as_read', (data) => {
        // data: { matchId, userId }
        io.to(data.matchId).emit('messages_read', data);
    });

    socket.on('typing_start', (data) => {
        // data: { matchId, userId }
        socket.to(data.matchId).emit('partner_typing', data);
    });

    socket.on('typing_stop', (data) => {
        // data: { matchId, userId }
        socket.to(data.matchId).emit('partner_stop_typing', data);
    });

    socket.on('delete_message', (data) => {
        // data: { matchId, messageId }
        io.to(data.matchId).emit('message_deleted', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (exposed to network)`);
});
