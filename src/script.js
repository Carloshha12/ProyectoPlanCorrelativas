//fetch agarra el archivo, el primer then lo convierte a json y el segundo then agarra los datos para poder usarlos en el json 
fetch('materias.json').then(res => res.json()).then(materias => { materiasjson = materias })


// funcion para mostrar el detalle de una materia
function verDetalle(nombre, estado) {

  document.getElementById('detalleTitulo').textContent = `${nombre}`;
  //En la card oculta tenemos el id detalleTitulo y le agregamos con textContent el nombre que recibimos por parametro
  document.getElementById('detalleEstado').textContent = "Estado: " + estado;
  document.getElementById('detalleMateria').classList.remove('oculto');
  //removemos la clase oculto para que se muestre el detalle
}
function verCorrelativa(id, correlativa){
hacer=false;
if(materiasjson.primeraño[id-1].correlativas==null){
  hacer=true;
}
return hacer;
}

function mostrarMaterias() {
  console.log(materiasjson.primeraño[0].nombre);
  const root = document.querySelector('#materiasContainer');
  Array.from(materiasjson.primeraño).forEach(materia => {
    if(verCorrelativa(materia.id)){
    const card = document.createElement('div');
    //aca se le puede insertar etiquetas html
    card.innerHTML = `<div class="materiasGrilla">
            <div class="card pendiente" id="${materia.id}" onclick="verDetalle('${materia.nombre}', 'Aprobada')">
                <div class="card-header"></div>
                <div class="card-body">
                    <h4>ID: ${materia.id}</h4>
                    <h2 class="card-title">${materia.nombre}</h2>
                    <p id="estado"class="card-status">Estado: ${materia.estado}</p>
                    </div>
                    </div>
                      <div id="detalleMateria" class="detalle oculto">
            <h3 id="detalleTitulo"></h3>
            <p id="detalleEstado"></p>
            <button onclick="cursar(${materia.id})" class="btn cursada">Cursada</button>
            <button onclick="aprobar(${materia.id})" class="btn aprobada">Aprobada</button>
            <button onclick="cerrarDetalle()" class="btn">Cerrar</button>

        </div>
      `
      document.getElementById
    root.appendChild(card);//guardamos la card en el root
}})

}
function cursar(id) {
  var element = document.getElementById(1).classList;
  element.remove('card', 'pendiente');
  element.add('card', 'cursada');
  document.getElementById('estado').textContent="Estado: Cursada";
  document.getElementById('detalleMateria').classList.add('oculto');
  
  //agregamos la clase oculto para que se oculte el detalle
}
function aprobar(id) {
  var element = document.getElementById(1).classList;
  element.remove('card', 'pendiente');
  element.add('card', 'aprobada');
  document.getElementById('estado').textContent="Estado: Aprobada";
  document.getElementById('detalleMateria').classList.add('oculto');
  
  //agregamos la clase oculto para que se oculte el detalle
}
function cerrarDetalle() {
  document.getElementById('detalleMateria').classList.add('oculto');
  //agregamos la clase oculto para que se oculte el detalle
}





