const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// CORS configuration for production (Render + Vercel)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://dev-hub-black.vercel.app',
      'https://devhub-backend.onrender.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

const io = new Server(server, {
  cors: corsOptions
});

// Make io accessible in routes/controllers
app.set('io', io);

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors(corsOptions));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/notifications', require('./routes/notifications'));

// Socket.IO connection handler
io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        socket.join(userId);
    });
  // You can add authentication here if needed
  // Listen for events if needed
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 