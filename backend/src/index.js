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

const pool = new Pool({
  user: 'myuser',
  host: 'postgres',
  database: 'pgdb',
  password: 'mypass',
  port: 5432
  }
)

const redisClient = createClient({
  url: 'redis://redis:6379'
})
await redisClient.connect();


app.get('/api/objects', async (req, res) => {
  try {
    const cached = await redisClient.get('objects')
    const container = process.env.HOSTNAME

    if (cached) {
      return res.json({
        source: 'redis',
        container,
        data: JSON.parse(cached)
      })
    }

    const result = await pool.query('SELECT * FROM objects')
    await redisClient.setEx('objects', 60, JSON.stringify(result.rows))

    res.json({
      source: 'postgres',
      container,
      data: result.rows
    })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.use(cors({ origin: 'http://localhost:8080' }));

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`)
    console.log(`Сервер запущен: http://localhost:8080`)
})
