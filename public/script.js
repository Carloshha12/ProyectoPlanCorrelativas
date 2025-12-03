//creo el objeto materiasjson para guardar las materias obtenidas del fetch y que no se rompa nada
let materiasjson = { materias: [] };
//fetch agarra el archivo, el primer then lo convierte a json y el segundo then agarra los datos para poder usarlos en el json 

fetch('http://localhost:3000/api/plan').then(res => res.json()).then(materias => { materiasjson.materias = materias })


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
                      <button onClick="paginaDetalle(${id})"class="btn">Detalle</button>
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

function volverAtras() {
  window.history.back();
}






async function mostrarTodo(from) {
  const tampagina = 10;
  const root = document.querySelector('#materiasContainer');
  root.innerHTML = ''; // limpiamos lo anterior

  // agarro de la api 10 materias desde el from que mando por parametro
  const res = await fetch(`/api/plan?cantidad=${tampagina}&from=${from}`);
  if (!res.ok) {
    console.error('Error al obtener materias:', await res.text());
    return;
  }
  const materiasAmostrar = await res.json(); // armo el json con las materias obtenidas
  //armo las cards con las materias obtenidas
  materiasAmostrar.forEach(materia => {
    const card = document.createElement('div');
    card.innerHTML = `
      <div class="materiasGrilla">
        <div class="card ${materia.estado}" id="${materia.id}"
             onclick="verDetalle('${materia.nombre}', '${materia.id}')">
          <div class="card-header"></div>
          <div class="card-body">
            <h4>ID: ${materia.id}</h4>
            <h2 class="card-title">${materia.nombre}</h2>
            <p id="estado-${materia.id}" class="card-status">
              Estado: ${materia.estado}
            </p>
          </div>
        </div>
      </div>
    `;
    root.appendChild(card);
  });
  //creo los botones de Anterior y Siguiente
  const pagContainer = document.querySelector('#paginacion');
  let botones = '';
  // Botón Anterior (solo si no estamos en la primera página)
  if (from > 0) {
    botones = `<button onclick="anterior(${from},${tampagina})" class="btnAS">Anterior</button>`
  }
  // Botón Siguiente (solo si el backend devolvió 10, puede que haya más)
  if (materiasAmostrar.length === tampagina) {
    botones += `<button onclick="siguiente(${from},${tampagina})" class="btnAS">Siguiente</button>`;
  }
  pagContainer.innerHTML = botones;

}
function siguiente(from, tampagina) {
  const nuevoFrom = from + tampagina;
  mostrarTodo(nuevoFrom);
}
function anterior(from, tampagina) {
  const nuevoFrom = Math.max(0, from - tampagina);
  mostrarTodo(nuevoFrom);
}



function mostrarMaterias(numeroAnio) {
  const root = document.querySelector('#materiasContainer');
  root.innerHTML = '';
  const paginacion = document.querySelector('#paginacion');
  paginacion.innerHTML = ''; // limpiamos lo anterior
  const materiasAmostrar = materiasjson.materias.filter(materia => materia.anio === numeroAnio);
  Array.from(materiasAmostrar).forEach(materia => {
    const card = document.createElement('div');
    //aca se le puede insertar etiquetas html
    card.innerHTML = `<div class="materiasGrilla">
            <div class="card ${materia.estado}" id="${materia.id}" onclick="verDetalle( '${materia.nombre}', '${materia.id}')">
                <div class="card-header"></div>
                <div class="card-body">
                    <h4>ID: ${materia.id}</h4>
                    <h2 class="card-title">${materia.nombre}</h2>
                    <p id="estado-${materia.id}" class="card-status">Estado: ${materia.estado}</p>
                    </div>
                    </div>
      `
    root.appendChild(card);//guardamos la card en el root

  })
}

function actualizarEstadoServidor(id, nuevoEstado) {
  fetch(`/api/plan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado })
  })
    .then(res => {
      if (!res.ok) console.error("Error al guardar en el servidor");
    })
    .catch(err => console.error(err));
}

function cursar(id) {
  const materia = materiasjson.materias.find(m => m.id == id);
  if (materia) {
    materia.estado = "cursada"; // Actualizamos memoria local

    var element = document.getElementById(id).classList;
    element.remove('card', 'pendiente');
    element.add('card', 'cursada');

    document.getElementById(`estado-${id}`).textContent = "Estado: Cursada";

    // 2. Actualización en Servidor (¡LO QUE FALTABA!)
    actualizarEstadoServidor(id, "cursada");

    revisarCorrelativas();
    cerrarDetalle();
  }
}

function aprobar(id) {
  const materia = materiasjson.materias.find(m => m.id == id);
  if (materia) {
    materia.estado = "aprobada"; // Actualizamos memoria local

    var element = document.getElementById(id).classList;
    if (element.contains('pendiente')) {
      element.remove('card', 'pendiente');
    } else {
      element.remove('card', 'cursada');
    }
    element.add('card', 'aprobada');

    document.getElementById(`estado-${id}`).textContent = "Estado: Aprobada";

    // 2. Actualización en Servidor (¡LO QUE FALTABA!)
    actualizarEstadoServidor(id, "aprobada");

    revisarCorrelativas();
    cerrarDetalle();
  }
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
function paginaDetalle(id) {
  location.href = `detalle.html?id=${id}`;

}
