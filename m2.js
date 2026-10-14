const input = document.querySelector("#pais");
const boton = document.querySelector("#buscar");
const resultado = document.querySelector("#resultado");

//función que busca el país
async function buscarPais(nombre) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${nombre}`
    );
    //Si no lo encuentra lanza un error con el mensaje
    if (!response.ok) {
      throw new Error("País no encontrado");
    }

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}
//Función que escucha si presiono Enter para buscar el país que he escrito
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscarPais(input.value);
  }
});