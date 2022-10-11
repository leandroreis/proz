import fs from 'node:fs';
import pgPromise from "pg-promise";

const pgp = pgPromise({});

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: fs.readFileSync(process.env.DB_USERNAME_FILE, 'utf8'),
  password: fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8'),
  idleTimeoutMillis: 100
})

export default db;
