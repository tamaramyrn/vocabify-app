import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import gameProtectedRoutes from './routes/gameProtected.js';

const app = express();
const PORT = process.env.PORT || 7777;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI tidak ditemukan di file .env");
  process.exit(1);
}

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api', gameProtectedRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


export default app;