// URL de la API para obtener palabras aleatorias
const apiUrl = 'https://random-word-api.herokuapp.com/word?length=5';

// Seleccionar una palabra aleatoria de la API
async function obtenerPalabraAleatoria() {
    try {
        const respuesta = await fetch(apiUrl);
        const data = await respuesta.json();
        return data[0].toUpperCase(); // Convertir la palabra a mayúsculas
    } catch (error) {
        console.error('Error al obtener palabra de la API:', error);
        // Puedes manejar el error de manera apropiada aquí
    }
}

let palabra; // Esta variable se actualizará con la palabra obtenida de la API

let intentos = 6;
let intentosRestantes = intentos;

const input = document.getElementById("adivinar-input");
const boton = document.getElementById("adivinar-button");
const mensaje = document.getElementById("mensaje");
const intentoSobrante = document.getElementById("intentos-restantes");
const numeroIntento = document.getElementById("mensaje-intentos");

document.addEventListener("DOMContentLoaded", async function () {
    // Obtener la palabra aleatoria de la API al inicio del juego
    palabra = await obtenerPalabraAleatoria();
    console.log(palabra);

    mostrarIntentosRestantes();
    boton.addEventListener("click", manejarIntento);
});

function manejarIntento() {
    const intento = leerIntento();

    if (validarIntento(intento)) {
        if (intento === palabra) {
            mostrarResultado("Ganaste", intento, true);
            deshabilitarJuego();
        } else {
            intentos--;

            if (intentos === 0) {
                mostrarResultado("Perdiste. La palabra correcta era: " + palabra, intento);
                deshabilitarJuego();
            } else {
                mostrarIntentosRestantes();
                mostrarPalabraAnterior(intento);
            }
        }
    } else {
        mostrarResultado("Intento inválido. Debes ingresar una palabra de 5 caracteres.");
    }
}

function deshabilitarJuego() {
    input.disabled = true;
    boton.removeEventListener("click", manejarIntento);
}

function leerIntento() {
    // Obtener los primeros 5 caracteres del input y convertir a mayúsculas
    const userInput = input.value.slice(0, 5).toUpperCase();
    return userInput;
}

function validarIntento(intento) {
    // Verificar si el intento es una cadena y tiene exactamente 5 caracteres
    return typeof intento === 'string' && intento.length === 5;
}

function mostrarResultado(mensajeTexto, palabraIngresada, esGanador) {
    mensaje.textContent = mensajeTexto;
    mensaje.style.color = esGanador ? "green" : "red";

    const palabraAnteriorElement = document.createElement("div");
    palabraAnteriorElement.classList.add("mensaje-anterior");

    const palabraMostrar = palabraIngresada || ''; // Si palabraIngresada es undefined, usar cadena vacía

    for (let i = 0; i < palabraMostrar.length; i++) {
        const letraElement = document.createElement("span");
        letraElement.textContent = palabraMostrar[i];

        if (esGanador) {
            letraElement.classList.add("mensaje-verde");
        } else {
            const letraCorrecta = palabra[i] === palabraMostrar[i];
            const letraEnPalabra = palabra.includes(palabraMostrar[i]);

            if (letraCorrecta) {
                letraElement.classList.add("mensaje-verde");
            } else if (letraEnPalabra) {
                letraElement.classList.add("mensaje-amarillo");
            } else {
                letraElement.classList.add("mensaje-gris");
            }
        }

        palabraAnteriorElement.appendChild(letraElement);
    }

    numeroIntento.appendChild(palabraAnteriorElement);
}

function mostrarIntentosRestantes() {
    intentoSobrante.textContent = "Intentos sobrantes: " + intentos;
}

function mostrarPalabraAnterior(palabraIngresada) {
    mostrarResultado("Intento incorrecto", palabraIngresada);
}
