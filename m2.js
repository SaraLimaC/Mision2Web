// ---------- Referencias al DOM ----------
const input = document.querySelector("#pais");
const boton = document.querySelector("#buscar");
const mensaje = document.querySelector("#mensaje");
const listaPaises = document.querySelector("#listaPaises");
const resultado = document.querySelector("#resultado");
const busqueda = document.querySelector("#busqueda");
const detalle = document.querySelector("#detalle");
const botonVolver = document.querySelector("#volver");

// Aquí guardamos todos los países para poder filtrar sin volver a pedirlos
let todosPaises = [];

// ---------- Cambio de vista ----------
// Muestra solo el detalle del país y oculta buscador + lista
function verPais() {
  busqueda.hidden = true;
  detalle.hidden = false;
  window.scrollTo(0, 0);
}

// Vuelve a la lista y oculta el detalle
function verLista() {
  detalle.hidden = true;
  busqueda.hidden = false;
  resultado.innerHTML = "";
}

// ---------- Carga de la lista de países ----------
async function cargarPaises() {
  try {
    mensaje.textContent = "Cargando países...";

    const response = await fetch("https://countries.dev/countries");
    if (!response.ok) {
      throw new Error("No se pudo cargar la lista de países");
    }

    todosPaises = await response.json();
    mensaje.textContent = "";
    mostrarLista(todosPaises);
  } catch (error) {
    mensaje.textContent = error.message;
    console.error(error);
  }
}

// Pinta la lista de países (cada uno con su bandera y nombre)
function mostrarLista(paises) {
  if (paises.length === 0) {
    listaPaises.innerHTML = "<p class='vacio'>Ningún país empieza por ese texto.</p>";
    return;
  }

  listaPaises.innerHTML = paises.map(pais => `
    <div class="pais-item" data-nombre="${pais.name}">
      <img src="${pais.flags.svg}" alt="" width="40">
      <span>${pais.name}</span>
    </div>
  `).join("");
}

// ---------- Eventos ----------
// Un solo listener para toda la lista (delegación de eventos):
// funciona aunque la lista se vuelva a pintar al filtrar
listaPaises.addEventListener("click", (e) => {
  const item = e.target.closest(".pais-item");
  if (item) {
    buscarPais(item.dataset.nombre);
  }
});

// Buscar al pulsar Enter
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscarPais(input.value);
  }
});

// También se puede buscar con el botón
boton.addEventListener("click", () => {
  buscarPais(input.value);
});

// Botón para volver a la lista
botonVolver.addEventListener("click", verLista);

// Filtra la lista mientras se escribe
input.addEventListener("input", () => {
  const texto = input.value.trim().toLowerCase();
  mensaje.textContent = "";

  if (texto === "") {
    mostrarLista(todosPaises);
    return;
  }

  const filtrados = todosPaises.filter(
    pais => pais.name.toLowerCase().startsWith(texto)
  );
  mostrarLista(filtrados);
});

// ---------- Búsqueda de un país concreto ----------
async function buscarPais(nombre) {
  nombre = nombre.trim();

  // Si no han escrito nada, avisamos en vez de hacer la petición
  if (nombre === "") {
    mensaje.textContent = "Escribe el nombre de un país.";
    return;
  }

  try {
    mensaje.textContent = "Cargando...";

    const response = await fetch(
      `https://countries.dev/name/${nombre}`
    );

    // Si no lo encuentra lanzamos un error que se muestra en pantalla
    if (!response.ok) {
      throw new Error("País no encontrado");
    }

    const data = await response.json();

    // Preferimos la coincidencia exacta; si no hay, usamos la primera
    const pais = data.find(
      p => p.name.toLowerCase() === nombre.toLowerCase()
    ) || data[0];

    if (!pais) {
      throw new Error("País no encontrado");
    }

    mensaje.textContent = "";
    mostrarPais(pais);
  } catch (error) {
    mensaje.textContent = error.message;
    console.error(error.message);
  }
}

// ---------- Pintar el detalle ----------
function mostrarPais(pais) {
  // Algunos países pueden no tener ciertos datos, así que ponemos valores por defecto
  const capital = pais.capital || "—";
  const subregion = pais.subregion || "—";
  const moneda = pais.currencies && pais.currencies[0]
    ? pais.currencies[0].name
    : "—";

  resultado.innerHTML = `
    <article class="ficha">
      <img
        class="ficha-bandera"
        src="${pais.flags.svg}"
        alt="Bandera de ${pais.name}"
      >
      <h2>${pais.name}</h2>

      <dl>
        <dt>Capital</dt>
        <dd>${capital}</dd>

        <dt>Población</dt>
        <dd>${pais.population.toLocaleString("es-ES")}</dd>

        <dt>Región</dt>
        <dd>${pais.region}</dd>

        <dt>Subregión</dt>
        <dd>${subregion}</dd>

        <dt>Moneda</dt>
        <dd>${moneda}</dd>
      </dl>
    </article>
  `;

  verPais();
}

const selectorRegion = document.querySelector("#region");

selectorRegion.addEventListener("change", () => {

    const region = selectorRegion.value;

    console.log(region);

    if (region === "") {
        mostrarLista(todosPaises);
        return;
    }

    const filtrados = todosPaises.filter(
        pais => pais.region === region
    );

    console.log(filtrados);

    mostrarLista(filtrados);
});

// ---------- Inicio ----------
cargarPaises();