const releases = [
    {
        version: "1.0.0",
        date: "04-01-2023",
        changes: [
            "Primer Commit",
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
            "Correccion del tamaño de la vida del player cuando baja por el ataque de un zombie",
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
            "Se actualizo la licencia del juego",
            "Se añadio el archivo README.md con los detalles del juego",
            "Optimizacion del uso de imagenes precargadas en el codigo para evitar lag",
        ]
    },
    {
        version: "1.0.6",
        date: "03-12-2024",
        changes: [
            "Se mejoro el diseño de la interfaz del juego",
            "Se integrò Tailwind CSS al proyecto",
            "Se ajusto el contenedor del lienzo del juego",
            "Se aumento el limite de zombies a 100",
            "Se agrega el puntaje y la cantidad de zombies vivos al HUB",
            "Se agrega el item HEART para recuperar vida",
            "Se agrega tiempo de juego transcurrido al HUB",
        ]
    }

];

function renderReleases() {
    const container = document.getElementById('releases-container');
    
    [...releases].reverse().forEach((release, index) => {
        const isEven = index % 2 === 0;
        const html = `
            <div class="mb-8 flex justify-between ${isEven ? '' : 'flex-row-reverse'} items-center w-full">
                <div class="order-1 w-5/12"></div>
                <div class="z-20 flex items-center order-1 bg-green-500 shadow-xl w-12 h-12 rounded-full">
                    <img src="/img/zombie-icon.svg" class="mx-auto">
                </div>
                <div class="order-1 bg-zinc-800 rounded-lg shadow-xl w-5/12 px-6 py-4">
                    <time class="font-mono italic text-green-500">${release.date}</time>
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
