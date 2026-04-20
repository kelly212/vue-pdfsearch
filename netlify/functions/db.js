import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
   connectionString: process.env.NETLIFY_DATABASE_URL_UNPOOLED,
   // ssl: { rejectUnauthorized: false }
})
