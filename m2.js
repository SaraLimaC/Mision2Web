const input = document.querySelector("#pais");
const boton = document.querySelector("#buscar");
const resultado = document.querySelector("#resultado");
const listaPaises = document.querySelector("#listaPaises");

let todosPaises = [];
//lista de paises
async function cargarPaises() {

  const response = await fetch(
    "https://countries.dev/countries"
  );

  todosPaises = await response.json();
  mostrarLista(todosPaises)
}

function mostrarLista(paises) {
  listaPaises.innerHTML = paises.map(pais => `
    <div class="pais-item" data-nombre="${pais.name}">
      <img src="${pais.flags.png}" width="40">
      <span>${pais.name}</span>
    </div>
  `).join("");
}

document.addEventListener("click", (e) => {
  const item = e.target.closest(".pais-item");

  if (item) {
    buscarPais(item.dataset.nombre);
  }
});

if (input.value.trim() === "") {
  cargarPaises();
}

//Función que escucha si presiono Enter para buscar el país que he escrito
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscarPais(input.value);
  }
});
//También puedes buscar con el botón al hacer click
boton.addEventListener("click", () => {
  buscarPais(input.value);
});

//función que busca el país
async function buscarPais(nombre) {
  try {
    resultado.innerHTML = "<p>Cargando...</p>";

    const response = await fetch(
      `https://countries.dev/name/${nombre}`
    );

    //Si no lo encuentra lanza un error con el mensaje
    if (!response.ok) {
      throw new Error("País no encontrado");
    }

    const data = await response.json();
    console.log(data);
   const pais = data[0];

    resultado.innerHTML = `
      <h2>${pais.name}</h2>

      <img
        src="${pais.flags.svg}"
        alt="Bandera de ${pais.name}"
        width="200"
      >

      <p><strong>Capital:</strong> ${pais.capital}</p>

      <p><strong>Población:</strong>
        ${pais.population.toLocaleString()}
      </p>

      <p><strong>Región:</strong>
        ${pais.region}
      </p>

      <p><strong>Subregión:</strong>
        ${pais.subregion}
      </p>

      <p><strong>Moneda:</strong>
        ${pais.currencies[0].name}
      </p>
    `;
  } catch (error) {
    console.error(error.message);
  }
}
