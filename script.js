let timer;
let config = {};

// Cargar configuración desde archivo externo
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error('Error al cargar configuración');
        config = await response.json();
        startTimer();
    } catch (error) {
        console.error('Error:', error);
        // Configuración por defecto si falla la carga
        config = {
            startDate: "2024-12-07T00:00:01",
            refreshInterval: 1000
        };
        startTimer();
    }
}

// Función para calcular meses exactos entre dos fechas
function getMonthsBetweenDates(startDate, endDate) {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    
    return (endYear - startYear) * 12 + (endMonth - startMonth);
}

// Función para calcular días restantes después de completar meses exactos
function getRemainingDays(startDate, endDate) {
    const lastMonthDate = new Date(endDate);
    lastMonthDate.setDate(startDate.getDate());
    lastMonthDate.setHours(0, 0, 0, 0);
    
    if (endDate.getDate() >= startDate.getDate()) {
        return endDate.getDate() - startDate.getDate();
    } else {
        lastMonthDate.setMonth(endDate.getMonth() - 1);
        return Math.floor((endDate - lastMonthDate) / (1000 * 60 * 60 * 24));
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
    
    // Cálculos precisos
    const totalMonths = getMonthsBetweenDates(startDate, now);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const days = getRemainingDays(startDate, now);
    
    const diff = now - startDate;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Actualizar el DOM
    const timeValues = document.querySelectorAll('.time-value');
    timeValues[0].textContent = years;
    timeValues[1].textContent = months;
    timeValues[2].textContent = days;
    timeValues[3].textContent = hours;
    timeValues[4].textContent = minutes;
    timeValues[5].textContent = seconds;
}

// Iniciar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', loadConfig);
