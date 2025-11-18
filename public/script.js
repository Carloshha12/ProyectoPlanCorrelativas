//fetch agarra el archivo, el primer then lo convierte a json y el segundo then agarra los datos para poder usarlos en el json 
fetch('/api/plan').then(res => res.json()).then(materias => { materiasjson = materias })

function cargarMaterias(anio) {
  let url = '/api/plan'; 

  if (anio) {
    url = `/api/plan?anio=${anio}`;
  }

  console.log(`Pidiendo datos a la API en: ${url}`);

  fetch(url)
    .then(res => res.json())
    .then(materiasRecibidas => {
      // 'materiasRecibidas' es el Array [...] que viene del servidor
      
      // ¡Llamamos a la función de dibujo con los datos recibidos!
      mostrarMaterias(materiasRecibidas); 
    })
    .catch(error => {
      console.error('Error al cargar materias:', error);
      const root = document.querySelector('#materiasContainer');
      root.innerHTML = '<p>Error al cargar los datos del servidor.</p>';
    });
}


function verDetalle(nombre, id) {
  const hacer = verCorrelativa(id);
  const puedeAprobar = verificarCorrelativasParaAprobar(id);
  const estado = materiasjson.materias[id - 1].estado;

  const detalle = document.querySelector('#detalleMateria');

  const card = document.createElement('div');
  let botones = '';
  if (estado != 'aprobada') {
    if (estado == 'cursada') {
      if (puedeAprobar) {
        botones = `<button onclick="aprobar(${id})" class="btn aprobada">Aprobada</button>`;
      }
    } else {
      if (hacer) {
        botones = `<button onclick="cursar(${id})" class="btn cursada">Cursada</button>`;
        if (puedeAprobar) {
          botones += `<button onclick="aprobar(${id})" class="btn aprobada">Aprobada</button>`;
        }
      }
    }
  }

  let botonCerrar = `<button onclick="cerrarDetalle()" class="btn">Cerrar</button>`;

  card.innerHTML = `<div class="detalle">
                      <h3 id="detalleTitulo">${nombre}</h3>
                      <p id="detalleEstado">Estado: ${estado}</p>
                      <p class="botonesAccion">${botones}</p>
                      ${botonCerrar}
                    </div>`;

  detalle.appendChild(card);
  document.getElementById('detalleMateria').classList.remove('oculto');
}

function verCorrelativa(id) {

  let hacer = false;
  const materiasCursadasNecesarias = materiasjson.materias[id - 1].correlativas;
  const materiasAprobadasNecesarias = materiasjson.materias[id - 1].final;
  if (materiasCursadasNecesarias == null && materiasAprobadasNecesarias == null) { //si no tiene correlativas puede hacer lo que quiera
    hacer = true;
  } else { //si tiene correlativas
    hacer = materiasCursadasNecesarias.every(correlativa => {
      return materiasjson.materias[correlativa - 1].estado === 'cursada' || materiasjson.materias[correlativa - 1].estado === 'aprobada';
    });
    if (hacer == true && materiasAprobadasNecesarias != null) { //si puede cursar y tiene finales
      hacer = materiasAprobadasNecesarias.every(correlativa => {
        return materiasjson.materias[correlativa - 1].estado === 'aprobada';
      });
    }
  }
  return hacer;
}



function agregarMateria() {

  const root = document.querySelector('#materiasContainer');
  const card = document.createElement('div');
  //aca se le puede insertar etiquetas html
  card.innerHTML = `<div class="materiasGrilla">
            <div class="card pendiente" id="${materiasjson.materias[4].id}" onclick="verDetalle('${materiasjson.materias[4].nombre}', 'Aprobada')">
                <div class="card-header"></div>
                <div class="card-body">
                    <h4>ID: ${materiasjson.materias[4].id}</h4>
                    <h2 class="card-title">${materiasjson.materias[4].nombre}</h2>
                    <p id="estado-${materiasjson.materias[4].id}"class="card-status">Estado: ${materiasjson.materias[4].estado}</p>
                    </div>
                    </div>
      `
  root.appendChild(card);
}
// CÓDIGO CORREGIDO para public/script.js

// Esta función recibe el array de materias ya filtrado
function mostrarMaterias(materiasArray) {
  const root = document.querySelector('#materiasContainer');
  
  // ¡MUY IMPORTANTE! Limpiamos la grilla antes de dibujar lo nuevo
  root.innerHTML = ''; 

  // Ya no filtramos. Solo dibujamos el array que nos pasaron.
  materiasArray.forEach(materia => {
    const card = document.createElement('div');
    // (Tu código HTML para la card no cambia)
    card.innerHTML = `<div class="materiasGrilla">
                        <div class="card ${materia.estado}" id="${materia.id}" onclick="verDetalle( '${materia.nombre}', '${materia.id}')">
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
function cursar(id) {
  var element = document.getElementById(id).classList;
  element.remove('card', 'pendiente');
  element.add('card', 'cursada');
  materiasjson.materias[id - 1].estado = "cursada";
  document.getElementById(`estado-${id}`).textContent = "Estado: Cursada";
  revisarCorrelativas();
  cerrarDetalle();
}
function aprobar(id) {
  var element = document.getElementById(id).classList;
  if (element.contains('pendiente')) {
    element.remove('card', 'pendiente');
  } else {
    element.remove('card', 'cursada');
  }
  element.add('card', 'aprobada');
  materiasjson.materias[id - 1].estado = "aprobada";
  document.getElementById(`estado-${id}`).textContent = "Estado: Aprobada";
  revisarCorrelativas();
  cerrarDetalle();
}
function cerrarDetalle() {
  document.getElementById('detalleMateria').classList.add('oculto');
  //agregamos la clase oculto para que se oculte el detalle
}

function revisarCorrelativas() {

  materiasjson.materias.forEach(materia => {
    const hacer = verCorrelativa(materia.id); //verificamos si puede cursar la materia
    if (hacer == true && materia.estado == 'bloqueada') {
      const el = document.getElementById(materia.id);
      if (el != null) {
        const element = el.classList;
        element.remove('card', 'bloqueada');
        element.add('card', 'pendiente');
        const estadoEl = document.getElementById(`estado-${materia.id}`);
        if (estadoEl) {
          estadoEl.textContent = "Estado: Pendiente";
        }
      }
      materia.estado = "pendiente"; // aunque no salga en la pagina actual tiene que cambiarse el estado para despues cuando la mostremos este bien
    }

  })
}

// no puedo aprobar materias sin tener todas las correlativas aprobadas 
function verificarCorrelativasParaAprobar(id) {
  let posibilidadAprobar = true;
  const materiasAprobadasNecesarias = materiasjson.materias[id - 1].final;
  const materiasCursadasNecesarias = materiasjson.materias[id - 1].correlativas;
  if (materiasAprobadasNecesarias != null) {
    posibilidadAprobar = materiasAprobadasNecesarias.every(correlativa => {
      return materiasjson.materias[correlativa - 1].estado === 'aprobada';
    });
  } else if (materiasCursadasNecesarias != null) {
    posibilidadAprobar = materiasCursadasNecesarias.every(correlativa => {
      return materiasjson.materias[correlativa - 1].estado === 'aprobada';
    });
  }
  return posibilidadAprobar;
}
// Barra de busqueda
function buscarMateria() {
  const busquedaElemento = document.getElementById('searchInput');
  if (busquedaElemento) {
    const input = busquedaElemento.value.toLowerCase().trim();
    const materias = Array.from(document.querySelectorAll('.materiasGrilla .card'));
    materias.forEach(materia => {
      const titleEl = materia.querySelector('.card-title');
      const title = titleEl ? (titleEl.textContent || '').toLowerCase() : '';

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
