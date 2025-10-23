let materiasjson = null;
const agarrarJson = fetch('materias.json')
  .then(res => res.json())
  .then(m => { materiasjson = m; return m; });
function main() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const nombre = params.get("nombre");
    const estado = params.get("estado");
    const anio = params.get("anio");
    const correlativas = params.get("correlativas");
    const final = params.get("final");
    const tituloDiv = document.getElementById("titulo");
    tituloDiv.innerHTML = ` <div class="icontitulo">
    <img class="iconfai"
    src="https://www.fi.uncoma.edu.ar/wp-content/uploads/2022/05/cropped-fai-e1660670932900.png"
    alt="Icono FAI">
    <h1 class="title">${nombre}</h1>
    
    </div>`;
    
    const detalleDiv = document.getElementById("detalleMateria");
    const div = document.createElement('div');
    detalleDiv.innerHTML = `
    <section class="detalleMateria">
    <h3 style="text-align: center">${nombre}</h3>
    <p>Año: ${anio}</p>
    <p>Estado: ${estado}</p>
    <p id="correlativas">Correlativas: ${correlativasList(correlativas)}</p>
    <p>Final: ${finalList(final)}</p>
    <button onclick="volverAtras()" class="btn" style="">Volver</button> 
    </section>
    `;
    detalleDiv.appendChild(div);
}

    function correlativasList(correlativas) {
        texto = "";
        textoHTML= document.querySelector('#correlativas');
        const card = document.createElement('div');
        

        if (correlativas == "null") {
            texto = "No necesita correlativas para cursar.";
        } else {
texto = correlativas.split(',');
}  
        return texto;
    }
    function finalList(final) {
        texto = ""
        if (final == "null") {
            texto = "No necesita finales para cursar.";
        } else {
            texto = final.split(',');
        }
        return texto;
    } 
    function volverAtras(){
        window.history.back();
      }