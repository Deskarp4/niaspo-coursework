import express from 'express'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import { createClient } from 'redis';

const app = express()
const PORT = 5000
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const Pool = pkg.Pool;

// Database
const pool = new Pool({
  user: 'myuser',
  host: 'postgres',
  database: 'pgdb',
  password: 'mypass',
  port: 5432
  }
)

// Redis 

const redisClient = createClient({
  url: 'redis://redis:6379'
})
await redisClient.connect();

// RestAPI

app.get('/api/objects', async (req, res) => {
  try {
    const cached = await redisClient.get('objects')
    if (cached) {
      console.log('Обращение REDIS')
      return res.json(JSON.parse(cached))
    }

    const result = await pool.query('SELECT * FROM objects');

    await redisClient.setEx('objects', 60, JSON.stringify(result.rows))
    console.log('Данные сохранены в Redis');

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({error: 'Ошибка сервера'})
  }
});

// API
app.use(cors({ origin: 'http://localhost:8080' }));

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`)
    console.log(`Сервер запущен: http://localhost:8080`)
})
