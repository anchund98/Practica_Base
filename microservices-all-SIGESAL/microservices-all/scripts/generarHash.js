const bcrypt = require('bcrypt');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sigesal'
});

db.connect();

// Simula que ya tienes usuarios con contraseñas en texto plano
const actualizarPasswordHash = async () => {
  const [username, clavePlano] = ['admin', 'admin123']; // Ejemplo

  const password_hash = await bcrypt.hash(clavePlano, 10);

  const query = 'UPDATE usuarios SET password_hash = ? WHERE username = ?';
  db.query(query, [password_hash, username], (err, result) => {
    if (err) throw err;
    console.log('Contraseña actualizada con hash para:', username);
  });
};

actualizarPasswordHash();
