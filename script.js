const mensaje = document.getElementById('mensaje');
const gifVela = document.getElementById('vela-gif');
const btnComenzar = document.getElementById('btn-comenzar');

// Elementos nuevos del gato y la carta
const gatoContainer = document.getElementById('gato-container');
const gatoBtn = document.getElementById('gato-btn');
const modalCarta = document.getElementById('modal-carta');
const btnCerrarCarta = document.getElementById('cerrar-carta');

// Rutas de tus archivos
const gifPrendido = "PRENDIDO.gif";
const gifSoplando = "CAMBIO.gif";
const gifApagado = "APAGADO.gif";

btnComenzar.addEventListener('click', () => {
    // Pedir permiso para el micrófono
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        btnComenzar.style.display = 'none'; // Ocultamos el botón
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            for (let i = 0; i < array.length; i++) {
                values += array[i];
            }

            const promedio = values / array.length;

            // Si el volumen supera el umbral
            if (promedio > 40) {
                apagarVela();
                // Detener el micrófono
                stream.getTracks().forEach(track => track.stop());
                javascriptNode.onaudioprocess = null;
            }
        };
    })
    .catch(err => {
        alert("¡Necesitas permitir el micrófono para que funcione!");
        console.error(err);
    });
});

function apagarVela() {
    const v = "?t=" + new Date().getTime(); // Fuerza al GIF a iniciar de cero

    // 1. Cambiar al GIF de "soplando"
    gifVela.src = gifSoplando + v;

    // 2. Después de la animación de soplido
    setTimeout(() => {
        gifVela.src = gifApagado + v;
        
        // --- CAMBIO AQUÍ ---
        const gato = document.getElementById('gato-container');
        if (gato) {
            gato.style.display = 'block'; // Lo mostramos
            gato.style.opacity = '1';    // Nos aseguramos de que no sea transparente
            console.log("El gato debería ser visible ahora");
        }
        
        mensaje.innerText = " Aprieta el gato nigga :3";
        
    }, 1900);
}

// --- LÓGICA DE LA CARTA ---

// Abrir la carta al hacer clic en el gato
gatoBtn.addEventListener('click', () => {
    modalCarta.classList.add('open'); // Si usas la clase CSS 'open'
    modalCarta.style.display = 'flex'; // O directamente con style
});

// Cerrar la carta al hacer clic en la X
btnCerrarCarta.addEventListener('click', () => {
    modalCarta.style.display = 'none';
});

// Cerrar si hace clic fuera de la imagen (en el fondo oscuro)
window.addEventListener('click', (e) => {
    if (e.target === modalCarta) {
        modalCarta.style.display = 'none';
    }
});