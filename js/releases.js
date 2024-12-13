const releases = [
    {
        version: "1.0.0",
        date: "04-01-2023",
        changes: [
            "Primer commit",
            "Juego funcional",
            "Movimiento de zombies, daño al jugador",
            "Movimiento del player, disparos"
        ]
    },
    {
        version: "1.0.1",
        date: "09-01-2023",
        changes: [
            "Cambio de sprite de balas",
        ]
    },
    {
        version: "1.0.2",
        date: "10-01-2023",
        changes: [
            "Se agrega mancha de sangre al morir el zombie",
            "Drop de monedas al matar zombies",
            "Se agrega HUD de vida y monedas",
        ]
    },
    {
        version: "1.0.3",
        date: "17-01-2023",
        changes: [
            "Corrección del tamaño de la vida del player cuando baja por el ataque de un zombie",
        ]
    },
    {
        version: "1.0.4",
        date: "24-02-2024",
        changes: [
            "Errores varios corregidos",
        ]
    },
    {
        version: "1.0.5",
        date: "02-12-2024",
        changes: [
            "Se actualizó la licencia del juego",
            "Se añadió el archivo README.md con los detalles del juego",
            "Optimización del uso de imágenes precargadas en el código para evitar lag",
        ]
    },
    {
        version: "1.0.6",
        date: "03-12-2024",
        changes: [
            "Se mejoró el diseño de la interfaz del juego",
            "Se integró Tailwind CSS al proyecto",
            "Se ajustó el contenedor del lienzo del juego",
            "Se aumentó el límite de zombies a 100",
            "Se agrega el puntaje y la cantidad de zombies vivos al HUD",
            "Se agrega el item HEART para recuperar vida",
            "Se agrega tiempo de juego transcurrido al HUD",
        ]
    },
    {
        version: "1.0.7",
        date: "10-12-2024",
        changes: [
            "Se agrega el item BOMB para matar a todos los zombies en la pantalla",
            "Se agrega la página de Releases en el sitio web del juego",
        ]
    },
    {
        version: "1.0.8",
        date: "13-12-2024",
        changes: [
            "Se añade boton de Inicio de juego en la página web",
            "Se aplico el sistema de puntuaciones con LocalStorage",
            "Se optimizaron las imagenes para reducir el tamaño del juego y mejorar los tiempos de carga",
            "Se añade fuente personalizada al juego para un estilo mas retro",
            "Nuevo estilo de ingreso de nombre de jugador",
            "HUD de High Scores modificado y estilizado",
        ]
    },
];


function renderReleases() {
    const container = document.getElementById('releases-container');
    
    [...releases].reverse().forEach((release, index) => {
        const isEven = index % 2 === 0;
        const isLatest = index === 0;
        const html = `
            <div class="mb-8 md:flex justify-between ${isEven ? '' : 'flex-row-reverse'} items-center w-full">
                <div class="order-1 w-5/12"></div>
                <div class="z-20 mb-2 md:mb-0 flex items-center order-1 shadow-xl w-12 h-12 rounded-full">
                    <img src="/img/zombie-icon.svg" class="mx-auto">
                </div>
                <div class="order-1 bg-zinc-800 rounded-lg shadow-xl md:w-5/12 px-6 py-4 w-full">
                    <div class="flex justify-between items-center">
                        <time class="font-mono italic text-green-500">${release.date}</time>
                        ${isLatest ? '<span class="px-2 py-1 text-[10px] bg-green-500 text-black rounded-full">NUEVO</span>' : ''}
                    </div>
                    <h3 class="mb-3 font-bold text-green-400 text-xl">Version ${release.version}</h3>
                    <ul class="list-disc list-inside text-sm text-gray-300">
                        ${release.changes.map(change => `<li>${change}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
        container.innerHTML += html;
    });
}

document.addEventListener('DOMContentLoaded', renderReleases);
