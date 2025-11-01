// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
  })
);
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

async function init() {
  const client = await pool.connect();
  try {
    console.log('Successfully connected to PostgreSQL!');
    await client.query(`
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  CREATE TABLE IF NOT EXISTS public.tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT        NOT NULL,
    description TEXT        NOT NULL DEFAULT '',
    status      TEXT        NOT NULL DEFAULT 'todo',
    priority    TEXT        NOT NULL DEFAULT 'medium',
    due_date    TIMESTAMPTZ NULL,
    assignee    JSONB       NOT NULL DEFAULT jsonb_build_object('name','Unassigned','avatar',''),
    tags        TEXT[]      NOT NULL DEFAULT '{}',
    progress    INT         NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT tasks_status_allowed   CHECK (status   IN ('todo','in_progress','done')),
    CONSTRAINT tasks_priority_allowed CHECK (priority IN ('low','medium','high'))
  );
`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks (completed);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks (created_at DESC);`);
    console.log('Schema is ready (table "tasks").');
  } finally {
    client.release();
  }
}

/* ---------------------- ROUTES ---------------------- */

// Health-check
app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS server_time;');
    res.json({ ok: true, server_time: rows[0].server_time });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/tasks — список задач
// query: sortBy=created_at|title|status, order=asc|desc, status=all|completed|pending
app.get('/api/tasks', async (req, res) => {
  try {
    const { sortBy = 'created_at', order = 'desc', status = 'all' } = req.query;

    const sortMap = { created_at: 'created_at', title: 'title', status: 'completed' };
    const orderMap = { asc: 'ASC', desc: 'DESC' };

    const sortColumn = sortMap[String(sortBy)] ?? 'created_at';
    const sortOrder = orderMap[String(order).toLowerCase()] ?? 'DESC';

    const filters = [];
    const params = [];

    if (status === 'completed') {
      params.push(true);
      filters.push(`completed = $${params.length}`);
    } else if (status === 'pending') {
      params.push(false);
      filters.push(`completed = $${params.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const { rows } = await pool.query(
      `
          SELECT
            id,
            title,
            description,
            status,
            priority,
            due_date AS "dueDate",
            assignee,
            tags,
            progress
        FROM public.tasks
        ${whereClause}
        ORDER BY ${sortColumn} ${sortOrder};
      `,
      params
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/tasks — добавить задачу
// body: { "title": "string", "completed"?: boolean }
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, completed = false } = req.body ?? {};
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Field "title" is required (non-empty string).' });
    }

    const { rows } = await pool.query(
      `
        INSERT INTO public.tasks (title, completed)
        VALUES ($1, $2)
        RETURNING id, title, completed, created_at, updated_at;
      `,
      [title.trim(), !!completed]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/tasks/:id — обновить title/completed
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid task id.' });

    const fields = [];
    const params = [];
    if (typeof req.body?.title === 'string') {
      params.push(req.body.title.trim());
      fields.push(`title = $${params.length}`);
    }
    if (typeof req.body?.completed === 'boolean') {
      params.push(req.body.completed);
      fields.push(`completed = $${params.length}`);
    }
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update.' });

    params.push(id);
    const { rows } = await pool.query(
      `
        UPDATE public.tasks
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${params.length}
        RETURNING id, title, completed, created_at, updated_at;
      `,
      params
    );

    if (!rows.length) return res.status(404).json({ error: 'Task not found.' });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/tasks/:id — удалить
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid task id.' });

    const { rowCount } = await pool.query(`DELETE FROM public.tasks WHERE id = $1;`, [id]);
    if (!rowCount) return res.status(404).json({ error: 'Task not found.' });

    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

//Статистика: всего/выполнено/в работе
app.get('/api/tasks/stats', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int                              AS total,
        COUNT(*) FILTER (WHERE completed)::int     AS completed,
        COUNT(*) FILTER (WHERE NOT completed)::int AS pending
      FROM public.tasks;
    `);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

init()
  .then(() => {
    app.listen(port, () => {
      console.log(`HTTP: http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error('Init failed:', e);
    process.exit(1);
  });
