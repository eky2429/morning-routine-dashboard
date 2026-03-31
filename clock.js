/**This script is for functions associated with time */

// Sets background based on time of day
export function setBackgroundByTime() {
    const hour = new Date().getHours();
    const body = document.body;

    if (hour >= 5 && hour < 12) {
        body.classList.add('morning');
        body.classList.remove('afternoon', 'evening');
    } else if (hour >= 12 && hour < 18) {
        body.classList.add('afternoon');
        body.classList.remove('morning', 'evening');
    } else {
        body.classList.add('evening');
        body.classList.remove('morning', 'afternoon');
    }
}

// Function to update the live clock every second
export function updateClock() {
    const clockEl = document.getElementById('live-clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
}