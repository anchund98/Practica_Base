const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const menuContainer = document.getElementById('menu-container');
const tabla = document.querySelector('#tabla tbody');
const thead = document.querySelector('#tabla thead tr');
const formContainer = document.getElementById('formulario');
let usuario = null;

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById('username').value; 
  const passwordInput = document.getElementById('password').value;

  const res = await fetch('http://localhost:3005/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: usernameInput, password: passwordInput }) 
  });

  const data = await res.json();
  if (data.success) {
    usuario = data.usuario;
    loginContainer.style.display = 'none';
    menuContainer.style.display = 'block';
    mostrarSeccion('pacientes');
  } else {
    alert("Credenciales inválidas");
  }
});

window.mostrarSeccion = async (seccion) => {
  let url = '';
  let campos = [];

  switch (seccion) {
    case 'pacientes':
      url = 'http://localhost:3010/pacientes';
      campos = ['cedula', 'nombres', 'apellidos', 'fecha_nacimiento', 'sexo', 'telefono', 'correo', 'direccion'];
      break;
    case 'profesionales':
      url = 'http://localhost:3002/profesionales';
      campos = ['nombre', 'especialidad', 'telefono'];
      break;
    case 'citas':
      url = 'http://localhost:3006/citas';
      campos = ['id_paciente', 'id_profesional', 'fecha', 'hora', 'motivo'];
      break;
    case 'recetas':
      url = 'http://localhost:3004/recetas';
      campos = ['id_cita', 'descripcion', 'indicaciones'];
      break;
    case 'usuarios':
      url = 'http://localhost:3005/usuarios';
      campos = ['usuario', 'rol'];
      break;
    case 'medicamentos':
      url = 'http://localhost:3006/medicamentos';
      campos = ['nombre', 'descripcion'];
      break;
    default:
      return;
  }

  thead.innerHTML = campos.map(c => `<th>${c}</th>`).join('');

  formContainer.innerHTML = `
    <form id="add-form" class="mb-4 row g-3">
      ${campos.map(c => `
        <div class="col-md-6">
          <input type="text" class="form-control" name="${c}" placeholder="${c}" required>
        </div>`).join('')}
      <div class="col-12">
        <button type="submit" class="btn btn-success">Agregar</button>
      </div>
    </form>
  `;

  try {
    const res = await fetch(url);
    const data = await res.json();
    tabla.innerHTML = '';
    data.forEach(item => {
      const row = campos.map(c => `<td>${item[c]}</td>`).join('');
      tabla.innerHTML += `<tr>${row}</tr>`;
    });
  } catch (err) {
    console.error("Error cargando datos:", err);
    tabla.innerHTML = '<tr><td colspan="100%">Error al cargar datos.</td></tr>';
  }

  document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objeto = {};
    formData.forEach((val, key) => objeto[key] = val);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objeto)
      });

      if (response.ok) {
        alert("Registro agregado correctamente.");
        mostrarSeccion(seccion);
      } else {
        alert("Error al agregar.");
      }
    } catch (err) {
      console.error("Error al enviar datos:", err);
      alert("Error de conexión.");
    }
  });
};

window.cerrarSesion = () => {
  usuario = null;
  menuContainer.style.display = 'none';
  loginContainer.style.display = 'block';
};
