
async function main() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    //agarro la materia por id de la api
    const res = await fetch(`http://localhost:3000/api/plan/${id}`);
    if (!res.ok) {
        document.getElementById("detalleMateria").innerHTML = "<p>Error cargando materia</p>";
        return;
    }
    //hago el json con la materia obtenida
    const materia = await res.json();
    //titulo y logo
    const tituloDiv = document.getElementById("titulo");
    tituloDiv.innerHTML = ` 
    <div class="icontitulo">
    <img class="iconfai"
    src="https://www.fi.uncoma.edu.ar/wp-content/uploads/2022/05/cropped-fai-e1660670932900.png"
    alt="Icono FAI">
    <h1 class="title">${materia.nombre}</h1>
    </div>
    `;
    //busco que me retorne las correlativas y finales en formato html con link
    const correlativasHTML = await listaDeMateriasConLink(materia.correlativas);
    const finalHTML = await listaDeMateriasConLink(materia.final);

    const detalleDiv = document.getElementById("detalleMateria");
    const div = document.createElement('div');
    detalleDiv.innerHTML = `
    <section class="detalleMateria">
    <h3 style="text-align: center">${materia.nombre}</h3>
    <p>Año: ${materia.anio}</p>
    <p>Estado: ${materia.estado}</p>
    <p id="correlativas">Correlativas: ${correlativasHTML}</p>
    <p>Final: ${finalHTML}</p>
    <button onclick="volverAtras()" class="btn" style="">Volver</button> 
    </section>
    `;
    detalleDiv.appendChild(div);
}

async function listaDeMateriasConLink(ids) {
    let conjuntoCorrelativa = "";
    //aca si los ids son null o vacios entonces no necesita coorelativa
    if (!ids || ids.length === 0) {
        return "No necesita";
    }
    //lo que hace el map es crear un array con las materias para cada id, que agarra de la api
    const materiasCorr = ids.map(id =>
        fetch(`/api/plan/${id}`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
    );
//el promise all espera a que todas las promesas del array se resuelvan
    const materias = await Promise.all(materiasCorr);
//m es cada materia obtenida del array materias, si no existe pone desconocida
    materias.forEach(m => {
        if (!m) {
            conjuntoCorrelativa += "(desconocida), ";
        } else {
            //armo el hipervinculo con el nombre y id de la materia
            conjuntoCorrelativa += `<a href="detalle.html?id=${m.id}" >${m.nombre} (${m.id})</a>, `;
        }
    });
    return conjuntoCorrelativa;
}

function volverAtras() {
    window.history.back();
}