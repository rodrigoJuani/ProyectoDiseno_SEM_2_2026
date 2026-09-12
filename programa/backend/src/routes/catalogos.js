import { Router } from 'express';
import { q } from '../db.js';

const r = Router();

r.get('/', async (_req, res) => {
  try {
    const idiomas = await q(
      `SELECT "id_idioma", "nombre_idioma" FROM "Idioma" ORDER BY "nombre_idioma"`
    );
    const servicios = await q(
      `SELECT "id_servicio", "nombre_servicio" FROM "Servicio_Multidisciplinario" ORDER BY "nombre_servicio"`
    );
    res.json({
      idiomas: idiomas.rows,
      servicios: servicios.rows,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;
