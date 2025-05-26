const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3005;

// CONFIGURAR CORS antes de cualquier otra cosa
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// CONEXIÓN A LA BD
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sigesal'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conexión a la base de datos exitosa');
});

// RUTA DE LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error de base de datos' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];
    if (user.password === password) {
      res.json({ success: true, usuario: user });
    } else {
      res.status(400).json({ message: 'Credenciales inválidas' });
    }
  });
});

// INICIAR SERVIDOR
app.listen(port, () => {
  console.log(`Auth service running on http://localhost:${port}`);
});
