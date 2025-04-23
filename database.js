// Database configuration for the hybrid mental health platform
// This file handles connection to MongoDB for user data and PostgreSQL for relational data

const mongoose = require('mongoose');
const { Pool } = require('pg');
require('dotenv').config();

// MongoDB Connection (for user data, content, and non-relational data)
const connectMongoDB = async () => {
  try {
    // In production, these would be environment variables
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mental_health_platform';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    };

    await mongoose.connect(MONGO_URI, options);
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// PostgreSQL Connection (for relational data like appointments, therapist matching)
const pgPool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'mental_health_platform',
  password: process.env.PG_PASSWORD || 'postgres',
  port: process.env.PG_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test PostgreSQL connection
const testPgConnection = async () => {
  try {
    const client = await pgPool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
    
    // Handle pool errors
    pgPool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error:', err);
    });
    
    return pgPool;
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
};

// Initialize both database connections
const initializeDatabases = async () => {
  await connectMongoDB();
  await testPgConnection();
  console.log('All database connections established');
};

module.exports = {
  connectMongoDB,
  pgPool,
  testPgConnection,
  initializeDatabases
};
