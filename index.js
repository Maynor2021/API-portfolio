// API Express para recibir mensajes del formulario de contacto y guardarlos en Supabase
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: true })); // en producción restringe al dominio de tu sitio

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hoscxxroviawfqghruqr.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';
const supabase = SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const dbTable = 'messages';

// POST /api/messages - Guarda un mensaje en Supabase (nombre, email, empresa, mensaje)
app.post('/api/messages', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase no configurado. Define SUPABASE_URL y SUPABASE_ANON_KEY.' });
  }
  const { nombre, email, empresa, mensaje } = req.body;
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email, mensaje' });
  }
  const row = { nombre, email, mensaje };
  if (empresa != null && empresa !== '') row.empresa = empresa;
  const { data, error } = await supabase.from(dbTable).insert([row]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, data });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
