// server.js - entry point for backend
const dns = require('dns');
if (!process.env.VERCEL) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { seedAdmin } = require('./services/seedService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded license files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB and seed admin
connectDB().then(() => seedAdmin()).catch(err => {
  console.error('❌ Initial database connection or seeding failed:', err);
});

// Routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const paymentRoutes = require('./routes/payment');
const contactRoutes = require('./routes/contact');

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
// expose globally for other modules
global.io = io;

// Simple health check
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

module.exports = app;
