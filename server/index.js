// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg'; // Используем Pool для управления соединениями

dotenv.config(); // Загружаем переменные окружения из .env

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  //origin: 'http://localhost:5173', // Порт вашего фронтенда
  origin: 'http://localhost:3000', // Порт вашего фронтенда
}));
// Middleware для обработки JSON-запросов
app.use(express.json());

// ----------------------------------------------------
// 2.1. Настройка подключения к PostgreSQL
// ----------------------------------------------------

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
});

// Простой тест подключения
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL!');
  release(); // Освобождаем клиент после проверки
});

// ----------------------------------------------------
// 2.2. Пример маршрута (API endpoint)
// ----------------------------------------------------

// Маршрут для получения всех пользователей из БД
// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// });

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS server_time;');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 2.3. Запуск сервера
// ----------------------------------------------------

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});