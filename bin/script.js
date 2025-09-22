// funcion para mostrar el detalle de una materia
function verDetalle(nombre, estado) {
  document.getElementById('detalleTitulo').textContent = nombre;
  document.getElementById('detalleEstado').textContent = "Estado: " + estado;
  document.getElementById('detalleMateria').classList.remove('oculto');
}

function cerrarDetalle() {
  document.getElementById('detalleMateria').classList.add('oculto');
}
