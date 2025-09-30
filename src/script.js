// funcion para mostrar el detalle de una materia
function verDetalle(nombre, estado) {
  document.getElementById('detalleTitulo').textContent = nombre;
  //En la card oculta tenemos el id detalleTitulo y le agregamos con textContent el nombre que recibimos por parametro
  document.getElementById('detalleEstado').textContent = "Estado: " + estado;
  document.getElementById('detalleMateria').classList.remove('oculto');
  //removemos la clase oculto para que se muestre el detalle
}

function cerrarDetalle() {
  document.getElementById('detalleMateria').classList.add('oculto');
  //agregamos la clase oculto para que se oculte el detalle
}
