// src/lib/database.ts - Updated with better error handling
import { Pool } from 'pg'

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('Database config:');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('DB_HOST:', process.env.DB_HOST);
}

// Support both DATABASE_URL (common in production) and individual env vars
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.DATABASE_URL ? {} : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  }),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false },
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // 10 seconds timeout
})

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export default pool