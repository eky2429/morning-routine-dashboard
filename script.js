import { loadTasks, addTask, saveTasks, enableDragAndDrop, filterTasks, createTaskElement } from './tasks.js';
import { setBackgroundByTime, updateClock } from './clock.js';
import { initQuotes, displayNewQuote } from './quotes.js';

// Button to fetch a new quote
document.getElementById('new-quote').addEventListener('click', () => {
    displayNewQuote();
});

// Filter buttons event listeners
document.querySelectorAll('#filter-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('#filter-buttons button')
            .forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        filterTasks(filter);
    });
});

// When the submit button is pressed, add a new task
document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});

//Button for clearing tasks
document.getElementById('clear-tasks').addEventListener('click', () => {
    document.querySelectorAll('ol li').forEach(li => li.remove());
    updateProgress(); //Updates progress text after clearing
    saveTasks(); // Auto-save after clearing
});

//Button to reset tasks to default list
document.getElementById('reset-tasks').addEventListener('click', () => {
    const defaultTasks = [
    { text: 'Wake up', completed: false, label: 'Body', time: 5 },
    { text: 'Drink water', completed: false, label: 'Body', time: 2 },
    { text: 'Stretch or light exercise', completed: false, label: 'Body', time: 10 },
    { text: 'Meditate or reflect', completed: false, label: 'Mind', time: 10 },
    { text: 'Read or learn something new', completed: false, label: 'Mind', time: 15 },
    { text: 'Plan your day', completed: false, label: 'Productivity', time: 10 },
    { text: 'Personal hygiene / get ready', completed: false, label: 'Body', time: 15 }
];

    const ol = document.querySelector('ol');
    ol.innerHTML = '';
    defaultTasks.forEach(task => ol.appendChild(createTaskElement(task)));
    enableDragAndDrop();
    saveTasks(); // Auto-save after reset
});

// Start the clock
setInterval(updateClock, 1000);
updateClock(); // Initial call to set time immediately on load

// Initial setup on page load
window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setBackgroundByTime();
});


// Initialize quotes when the module is loaded
initQuotes();