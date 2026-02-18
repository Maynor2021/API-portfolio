require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_KEY ||
  '';

const dbTable = process.env.SUPABASE_TABLE || 'messages';

const supabase = SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// 🔎 Logs de estado al iniciar
if (supabase) {
  console.log("✅ Conectado a Supabase");
  console.log("📦 Tabla:", dbTable);
} else {
  console.log("❌ Supabase NO configurado");
}

// ENDPOINTS
app.post('/api/messages', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase no configurado.' });
  }

  const { nombre, email, empresa, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({
      error: 'Faltan campos requeridos: nombre, email, mensaje',
    });
  }

  const row = { nombre, email, mensaje };
  if (empresa) row.empresa = empresa;

  const { data, error } = await supabase
    .from(dbTable)
    .insert([row])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ success: true, data });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabaseConfigured: Boolean(supabase),
    table: dbTable,
  });
});

// 🧠 Solo escucha puerto si NO está en Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`🚀 API escuchando en puerto ${PORT}`);
    console.log(`🌍 http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
