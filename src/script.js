//fetch agarra el archivo, el primer then lo convierte a json y el segundo then agarra los datos para poder usarlos en el json 
fetch('materias.json').then(res => res.json()).then(materias => {
  console.log(materias);

  // funcion para mostrar el detalle de una materia
  function verDetalle(nombre, estado) {

    document.getElementById('detalleTitulo').textContent = nombre;
    //En la card oculta tenemos el id detalleTitulo y le agregamos con textContent el nombre que recibimos por parametro
    document.getElementById('detalleEstado').textContent = "Estado: " + estado;
    document.getElementById('detalleMateria').classList.remove('oculto');
    //removemos la clase oculto para que se muestre el detalle
  }
  function mostrarMaterias() {
    const materiasGrilla = document.getElementById("materiasGrilla");
    const btnAgregar = document.getElementById("botonmaterias");
    for (i <= materias.length; i = 0; i++) {
      let nombre = materias[i].nombre;
      botonmaterias.addEventListener("click", () => {
        card.classList.add("card aprobada");
        card.onclick = () => verDetalle("Álgebra I", "Aprobada");
        header.classList.add("card-header");
        body.classList.add("card-body");
        const title = document.createElement("h2");
        title.classList.add("card-title");
        title.textContent = "Álgebra I";
        const status = document.createElement("p");
        status.classList.add("card-status");
        status.textContent = "Estado: Aprobada";
      }
      );

      }
}
  


  function cerrarDetalle() {
    document.getElementById('detalleMateria').classList.add('oculto');
    //agregamos la clase oculto para que se oculte el detalle
  }
}
)



