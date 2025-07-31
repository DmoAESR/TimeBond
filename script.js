let timer;
let config = {};

async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        startTimer();
    } catch (error) {
        console.error('Error:', error);
        config = {
            startDate: "2024-12-07T16:00:00",
            refreshInterval: 1000 // Actualizado a 1 segundo
        };
        startTimer();
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    
    const startDate = new Date(config.startDate);
    
    if (isNaN(startDate.getTime())) {
        document.querySelector('.time-grid').innerHTML = '<p>Fecha de inicio no válida</p>';
        return;
    }
    
    updateTime(startDate);
    timer = setInterval(() => updateTime(startDate), config.refreshInterval);
}

function updateTime(startDate) {
    const now = new Date();
    const diff = now - startDate;
    
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44) % 12);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24) % 30.44);
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Actualizar solo los elementos necesarios
    const timeValues = document.querySelectorAll('.time-value');
    timeValues[0].textContent = years;
    timeValues[1].textContent = months;
    timeValues[2].textContent = days;
    timeValues[3].textContent = hours;
    timeValues[4].textContent = minutes;
    timeValues[5].textContent = seconds;
}

document.addEventListener('DOMContentLoaded', loadConfig);