import { loadTasks, addTask, saveTasks, enableDragAndDrop, filterTasks, createTaskElement } from './tasks.js';
import { setBackgroundByTime, updateClock } from './clock.js';
import { initQuotes, displayNewQuote } from './quotes.js';
import {tags, getEmoji, getText} from './data/tags.js';
import {presets} from './data/presets.js';

// Load task settings (labels and filter buttons) based on the tags array
function loadTaskSettings(){
    for (let i = 0; i < tags.length; i++){
        const label = getText(i);
        const emoji = getEmoji(i);

        //Creates buttons to select task label for filtering based on the tags array
        const filterButton = document.createElement('button');
        filterButton.setAttribute('data-filter', label);
        filterButton.textContent = `${emoji} ${label}`;
        
        //Add event listener to filter tasks when the button is clicked
        filterButton.addEventListener('click', () => {
            document.querySelectorAll('#filter-buttons button')
                .forEach(btn => btn.classList.remove('active'));
            filterButton.classList.add('active');
            filterTasks(label);
        });
        document.getElementById('filter-buttons').appendChild(filterButton);

        //Creates options for the task label dropdown based on the tags array
        const option = document.createElement('option');
        option.value = label;
        option.textContent = `${emoji} ${label}`;
        document.getElementById('task-label').appendChild(option);
    }
}

//Load presets into the preset dropdown
function loadPresets(){
    const presetSelect = document.getElementById('preset-tasks');
    presets.forEach((preset, index) => {
        const option = document.createElement('option');
        option.value = index; // Use index as value to identify the preset
        option.textContent = preset.name;
        presetSelect.appendChild(option);
    });
}

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
    const presetElement = document.getElementById('preset-tasks');
    //Get the value from the preset dropdown and reset it to default
    const selectedPresetIndex = presetElement.value;

    if (selectedPresetIndex === "") {
        alert("Please select a preset from the dropdown before resetting tasks.");
        return;
    }

    presetElement.value = ""; // Reset preset dropdown to default
    const defaultTasks = presets[selectedPresetIndex].tasks; // Assuming the first preset is the default

    const ol = document.querySelector('ol');
    ol.innerHTML = '';
    defaultTasks.forEach(task => ol.appendChild(createTaskElement(task)));
    enableDragAndDrop();
    saveTasks(); // Auto-save after reset
});


//This is called to check if it is a new day and unchecks all current tasks if it is
    //Otherwise, it does nothing and leaves the tasks as they are
function resetTasks() {
    const lastReset = localStorage.getItem('lastReset');
    const today = new Date().toDateString();

    if (lastReset !== today) {
        localStorage.setItem('lastReset', today);
        document.querySelectorAll('ol li input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        saveTasks(); // Auto-save after resetting tasks
    }
}

// Start the clock
setInterval(updateClock, 1000);
updateClock(); // Initial call to set time immediately on load

// Initial setup on page load
window.addEventListener('DOMContentLoaded', () => {
    resetTasks(); // Load default tasks on page load
    loadTaskSettings();
    loadTasks();
    loadPresets(); // Load presets into the dropdown
    setBackgroundByTime();
});


// Initialize quotes when the module is loaded
initQuotes();