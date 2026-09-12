import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { q } from './db.js';
import estudiantesRoutes from './routes/estudiantes.js';
import catalogosRoutes from './routes/catalogos.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await q('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/catalogos', catalogosRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
