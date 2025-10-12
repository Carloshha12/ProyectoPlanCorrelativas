//fetch agarra el archivo, el primer then lo convierte a json y el segundo then agarra los datos para poder usarlos en el json 
fetch('materias.json').then(res => res.json()).then(materias => { materiasjson = materias })


function verDetalle(nombre, id) {
  hacer = verCorrelativa(id, materiasjson.primeraño[id - 1].correlativas);
  //Caso bloqueada no hace nada
  //Caso cursada tendria que abrir detalle para dejarte aprobar nomas
  if (materiasjson.primeraño[id - 1].estado == 'cursada') {
    const detalle = document.querySelector('#detalleMateria');
    const card = document.createElement('div');
    card.innerHTML = `<div class="detalle">
            <h3 id="detalleTitulo">${nombre}</h3>
            <p id="detalleEstado-${id}" >Estado: ${materiasjson.primeraño[id - 1].estado}</p>
            <button onclick="aprobar(${id})" class="btn aprobada">Aprobada</button>
            <button onclick="cerrarDetalle()" class="btn">Cerrar</button>

        </div>`

    detalle.appendChild(card);
    document.getElementById('detalleMateria').classList.remove('oculto');
  }
  //Caso aprobada no tiene que dejar hacer nada solo mostrar detalle
  else if (materiasjson.primeraño[id - 1].estado == 'aprobada') {
    const detalle = document.querySelector('#detalleMateria');
    const card = document.createElement('div');
    card.innerHTML = `<div class="detalle">
            <h3 id="detalleTitulo">${nombre}</h3>
            <p id="detalleEstado-${id}" >Estado: ${materiasjson.primeraño[id - 1].estado}</p>
            <button onclick="cerrarDetalle()" class="btn">Cerrar</button>   
        </div>`

    detalle.appendChild(card);
    document.getElementById('detalleMateria').classList.remove('oculto');
  } else
    if (hacer == true) {
      const detalle = document.querySelector('#detalleMateria');
      const card = document.createElement('div');
      card.innerHTML = `<div class="detalle">
            <h3 id="detalleTitulo">${nombre}</h3>
            <p id="detalleEstado-${id}" >Estado: ${materiasjson.primeraño[id - 1].estado}</p>
            <button onclick="cursar(${id})" class="btn cursada">Cursada</button>
            <button onclick="aprobar(${id})" class="btn aprobada">Aprobada</button>
            <button onclick="cerrarDetalle()" class="btn">Cerrar</button>

        </div>`

      detalle.appendChild(card);
      document.getElementById('detalleMateria').classList.remove('oculto');

    }
}

function verCorrelativa(id) {
  hacer = false;
  materiaCorrelativa = materiasjson.primeraño[id - 1].correlativas;
  if (materiaCorrelativa == null) { //si no tiene correlativas puede hacer lo que quiera
    hacer = true;
  } else if (materiaCorrelativa != null) { //si tiene correlativas
    let contador = 0;

    materiaCorrelativa.forEach(correlativaId => { //recorro las correlativas
      if (materiasjson.primeraño[correlativaId - 1].estado === 'aprobada' || materiasjson.primeraño[correlativaId - 1].estado === 'cursada') { //si la correlativa esta aprobada o cursada
        contador++; //cuento las correlativas aprobadas
      }
    });


    if (contador === materiasjson.primeraño[id - 1].correlativas.length) {
      hacer = true;
    }
  }
  return hacer;
}


function agregarMateria() {

  const root = document.querySelector('#materiasContainer');
  const card = document.createElement('div');
  //aca se le puede insertar etiquetas html
  card.innerHTML = `<div class="materiasGrilla">
            <div class="card pendiente" id="${materiasjson.primeraño[4].id}" onclick="verDetalle('${materiasjson.primeraño[4].nombre}', 'Aprobada')">
                <div class="card-header"></div>
                <div class="card-body">
                    <h4>ID: ${materiasjson.primeraño[4].id}</h4>
                    <h2 class="card-title">${materiasjson.primeraño[4].nombre}</h2>
                    <p id="estado-${materiasjson.primeraño[4].id}"class="card-status">Estado: ${materiasjson.primeraño[4].estado}</p>
                    </div>
                    </div>
      `
  root.appendChild(card);
}
function mostrarMaterias() {
  const root = document.querySelector('#materiasContainer');
  Array.from(materiasjson.primeraño).forEach(materia => {
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
function cursar(id) {
  var element = document.getElementById(id).classList;
  element.remove('card', 'pendiente');
  element.add('card', 'cursada');
  materiasjson.primeraño[id - 1].estado = "cursada";
  document.getElementById(`estado-${id}`).textContent = "Estado: Cursada";
  revisarCorrelativas();
  cerrarDetalle();
}
function aprobar(id) {
  // console.log(id);
  var element = document.getElementById(id).classList;
  if (element.contains('pendiente')) {
    element.remove('card', 'pendiente');
  } else {
    element.remove('card', 'cursada');
  }
  element.add('card', 'aprobada');
  materiasjson.primeraño[id - 1].estado = "aprobada";
  document.getElementById(`estado-${id}`).textContent = "Estado: Aprobada";
  revisarCorrelativas();
  cerrarDetalle();
}
function cerrarDetalle() {
  document.getElementById('detalleMateria').classList.add('oculto');
  //agregamos la clase oculto para que se oculte el detalle
}

function revisarCorrelativas() {
  materiasjson.primeraño.forEach(materia => {
    hacer = verCorrelativa(materia.id); // Ver si se puede hacer la materia
    if (hacer == true && materia.estado == 'bloqueada') { 
      var element = document.getElementById(materia.id).classList;
      element.remove('card', 'bloqueada');
      element.add('card', 'pendiente');
      materia.estado = "pendiente";
      document.getElementById(`estado-${materia.id}`).textContent = "Estado: Pendiente";
    } 
    
  })
}
