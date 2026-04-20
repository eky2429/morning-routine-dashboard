import { loadTasks, addTask, saveTasks, enableDragAndDrop, filterTasks, createTaskElement, updateProgress, updateTotalTime } from './tasks.js';
import { setBackgroundByTime, updateClock } from './clock.js';
import { initQuotes, displayNewQuote } from './quotes.js';
import {tags, getEmoji, getText} from './data/tags.js';
import {presets} from './data/presets.js';
import { addStreak } from './streakSystem.js';

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
        //Unchecks all tasks as completed when morning mode is done
        document.querySelectorAll('ol li').forEach(li => {
            const checkbox = li.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = false;
                li.classList.remove('completed');
            }
        });
        alert("Tasks have been reset");
    }
}

//Add listener to morning mode button to create an overlay with a timer and a button that the user can click when they are done with their morning routine
document.getElementById('morning-mode').addEventListener('click', () => {

    //Create an overlay div
    const overlay = document.createElement('div');
    overlay.id = 'morning-mode-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    //Create a timer element
    const timerElement = document.createElement('div');
    timerElement.id = 'morning-mode-timer';
    timerElement.style.fontSize = '48px';
    timerElement.style.color = '#fff';
    timerElement.textContent = '00:00';

    //Create a done button
    const doneButton = document.createElement('button');
    doneButton.textContent = "I'm Done!";
    doneButton.style.padding = '10px 20px';
    doneButton.style.fontSize = '16px';
    doneButton.style.marginTop = '20px';

    //Add timer and button to the overlay
    overlay.appendChild(timerElement);
    overlay.appendChild(doneButton);
    document.body.appendChild(overlay);

    let startTime = Date.now();

    //Update the timer every second
    const timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);

    //When the done button is clicked, stop the timer and remove the overlay
    doneButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        alert(`Great job! You spent ${timerElement.textContent} on your morning routine.`);
        //Checks all tasks as completed when morning mode is done
        document.querySelectorAll('ol li').forEach(checkbox => {
            classList.toggle('completed', true);
        });
        document.querySelectorAll('ol li input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        saveTasks(); // Auto-save after marking tasks as completed
        updateProgress();
        updateTotalTime();
        document.body.removeChild(overlay);
    });
});

//Connects play music button to an event listener
    //Plays a random playlist when button is clicked
document.getElementById('play-music').addEventListener('click', () => {
    const playlists = [
        'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', // Spotify's "Today's Top Hits"
        'https://open.spotify.com/playlist/37i9dQZF1DWXJfnUiYjUKT', // Spotify's "Peaceful Piano"
        'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', // Spotify's "Morning Acoustic"
        'https://open.spotify.com/playlist/37i9dQZF1DWVqfgj8NZEp7', // Spotify's "Wake Up Happy"
        'https://open.spotify.com/playlist/37i9dQZF1DX4E3UdUs7fUx'  // Spotify's "Feel Good Indie Rock"
    ];

    //Get a random playlist from array
    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    window.open(randomPlaylist, '_blank'); // Open the playlist in a new tab
});

// Start the clock
setInterval(updateClock, 1000);
updateClock(); // Initial call to set time immediately on load

// Initial setup on page load
window.addEventListener('DOMContentLoaded', () => {
    //Load settings to be added to website
    loadTaskSettings();
    loadTasks();
    loadPresets(); // Load presets into the dropdown
    setBackgroundByTime(); // Loads background


    resetTasks(); // Load default tasks on page load

    addStreak(); // Check and update streak count on page load
    saveTasks();
});


// Initialize quotes when the module is loaded
initQuotes();