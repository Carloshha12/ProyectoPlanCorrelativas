// --- VARIABLES GLOBALES ---
let materiasjson = { materias: [] };



function cargarMaterias(anio) {
  const url = `/api/plan?anio=${anio}`;
  console.log(`Pidiendo datos: ${url}`);

  fetch(url)
    .then(res => res.json())
    .then(datosRecibidos => {
      materiasjson.materias = datosRecibidos;
      mostrarMaterias(datosRecibidos);
    })
    .catch(err => console.error('Error cargando:', err));
}

function mostrarMaterias(materiasArray) {
  const root = document.querySelector('#materiasContainer');
  root.innerHTML = '';

  materiasArray.forEach(materia => {
    const card = document.createElement('div');
    card.innerHTML = `<div class="materiasGrilla">
            <div class="card ${materia.estado}" id="${materia.id}" onclick="verDetalle('${materia.nombre}', '${materia.id}')">
                <div class="card-header"></div>
                <div class="card-body">
                    <h4>ID: ${materia.id}</h4>
                    <h2 class="card-title">${materia.nombre}</h2>
                    <p id="estado-${materia.id}" class="card-status">Estado: ${materia.estado}</p>
                </div>
            </div>
        </div>`;
    root.appendChild(card);
  });
}

function verDetalle(nombre, id) {
  const materia = materiasjson.materias.find(m => m.id == id);

  if (materia) {
    const estado = materia.estado;

    const detalle = document.querySelector('#detalleMateria');
    const card = document.createElement('div');
    let botones = '';

    if (estado !== 'aprobada') {
      const puedeCursar = verCorrelativa(id);
      const puedeAprobar = verificarCorrelativasParaAprobar(id);

      if (estado === 'cursada') {
        if (puedeAprobar) {
          botones = `<button onclick="aprobar(${id})" class="btn aprobada">Aprobada</button>`;
        }
      } else {
        // Pendiente o bloqueada
        if (puedeCursar) {
          botones = `<button onclick="cursar(${id})" class="btn cursada">Cursada</button>`;
          if (puedeAprobar) {
            botones += `<button onclick="aprobar(${id})" class="btn aprobada">Aprobada</button>`;
          }
        }
      }
    }


    const botonCerrar = `<button onclick="cerrarDetalle()" class="btn">Cerrar</button>`;

    card.innerHTML = `<div class="detalle">
        <h3 id="detalleTitulo">${nombre}</h3>
        <p id="detalleEstado">Estado: ${estado.toUpperCase()}</p>
        <p class="botonesAccion">${botones}</p>
        ${botonCerrar}
    </div>`;

    detalle.innerHTML = '';
    detalle.appendChild(card);
    document.getElementById('detalleMateria').classList.remove('oculto');
  }
}

function cursar(id) {
  actualizarEstado(id, 'cursada');
}

function aprobar(id) {
  actualizarEstado(id, 'aprobada');
}

function actualizarEstado(id, nuevoEstado) {
  const materia = materiasjson.materias.find(m => m.id == id);

  if (materia) {
    materia.estado = nuevoEstado;
    const card = document.getElementById(id);
    if (card) {
      card.className = `card ${nuevoEstado}`;
      const txt = document.getElementById(`estado-${id}`);
      if (txt) {
        txt.textContent = `Estado: ${nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1)}`;
      }
    }

    fetch(`/api/plan/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: nuevoEstado })
    }).catch(err => console.error(err));

    cerrarDetalle();
  }
  revisarCorrelativas();
}

function cerrarDetalle() {
  document.getElementById('detalleMateria').classList.add('oculto');
}


function verCorrelativa(id) {
  let resultado = true;
  const materia = materiasjson.materias.find(m => m.id == id);

  if (materia && materia.correlativas && materia.correlativas.length > 0) {

    const correlativasCumplidas = materia.correlativas.every(corrId => {
      const correlativa = materiasjson.materias.find(m => m.id == corrId);
      let estaOk = true;

      if (correlativa) {
        estaOk = (correlativa.estado === 'cursada' || correlativa.estado === 'aprobada');
      }
      return estaOk;
    });

    resultado = correlativasCumplidas;
  }

  return resultado;
}
function verificarCorrelativasParaAprobar(id) {
  const materia = materiasjson.materias.find(m => m.id == id);
  let resultado = true;

  if (materia) {

    if (materia.correlativas && materia.correlativas.length > 0) {
      const correlativasOk = materia.correlativas.every(corrId => {
        const corr = materiasjson.materias.find(m => m.id == corrId);
        if (!corr) return true; // Anti-crash por paginación

        return corr.estado === 'aprobada';
      });

      if (!correlativasOk) resultado = false;
    }

    if (resultado && materia.final && materia.final.length > 0) {
      const finalesOk = materia.final.every(finalId => {
        const fin = materiasjson.materias.find(m => m.id == finalId);
        if (!fin) return true; // Anti-crash por paginación

        return fin.estado === 'aprobada';
      });

      if (!finalesOk) resultado = false;
    }
  }

  return resultado;
}

function buscarMateria() {
  const busquedaElemento = document.getElementById('searchInput');
  if (busquedaElemento) {
    const input = busquedaElemento.value.toLowerCase().trim();
    const materias = Array.from(document.querySelectorAll('.materiasGrilla .card'));

    materias.forEach(materia => {
      const titleEl = materia.querySelector('.card-title');
      const title = titleEl ? (titleEl.textContent || '').toLowerCase() : '';

      // Operador ternario para asignar display
      if (input === '' || title.startsWith(input)) {
        materia.style.display = '';
      } else {
        materia.style.display = 'none';
      }
    });
  }
}

const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    buscarMateria();
  });
}

function revisarCorrelativas() {
  materiasjson.materias.forEach(materia => {

    if (materia.estado !== 'aprobada' && materia.estado !== 'cursada') {

      const sePuedeCursar = verCorrelativa(materia.id);

      const card = document.getElementById(materia.id);
      const estadoTexto = document.getElementById(`estado-${materia.id}`);

      if (sePuedeCursar) {
        if (card) {
          card.classList.remove('bloqueada'); 
          card.classList.add('pendiente');
        }
        if (estadoTexto) estadoTexto.textContent = "Estado: Pendiente";
        materia.estado = 'pendiente';
      } 
    }
  });
}