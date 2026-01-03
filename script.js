
//Creates a trash icon element with click event to delete its parent <li>
function createTrashIcon() {
    //Adds span with trash can emoji
    const trash = document.createElement('span');
    trash.textContent = '🗑️';
    trash.classList.add('trash-icon');
    trash.style.cursor = 'pointer'; // Change cursor to pointer on hover
    trash.style.marginLeft = '10px';
    trash.title = 'Delete task';

    //Adds listener to delete parent <li> when clicked
    trash.addEventListener('click', function (e) {
        e.stopPropagation();
        this.parentElement.remove();
    });
    return trash;
}

// Makes list items draggable and enables reordering
function enableDragAndDrop() {
    const listItems = document.querySelectorAll('ol li');
    
    listItems.forEach(li => {
        li.draggable = true;
        
        li.addEventListener('dragstart', function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
            this.classList.add('dragging');
        });
        
        li.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
        });
        
        li.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (this.classList.contains('dragging')) return;
            this.classList.add('drag-over');
        });
        
        li.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });
        
        li.addEventListener('drop', function(e) {
            e.preventDefault();
            if (this.classList.contains('dragging')) return;
            
            const draggingItem = document.querySelector('.dragging');
            if (draggingItem !== this) {
                this.parentElement.insertBefore(draggingItem, this);
            }
            this.classList.remove('drag-over');
        });
    });
}

// Sets background based on time of day
function setBackgroundByTime() {
    const hour = new Date().getHours();
    const body = document.body;
    
    if (hour >= 5 && hour < 12) {
        // Morning: 5am - 12pm
        body.classList.add('morning');
        body.classList.remove('afternoon', 'evening');
    } else if (hour >= 12 && hour < 18) {
        // Afternoon: 12pm - 6pm
        body.classList.add('afternoon');
        body.classList.remove('morning', 'evening');
    } else {
        // Evening: 6pm - 5am
        body.classList.add('evening');
        body.classList.remove('morning', 'afternoon');
    }
}

//Adds a new task when submit button is pressed
function addTask() {
    const input = document.querySelector('input[type="text"]');
    const newTask = input.value.trim(); 
    if (newTask) {
        const ol = document.querySelector('ol');
        const li = document.createElement('li'); //Creates new list item
        li.textContent = newTask;
        li.appendChild(createTrashIcon()); //Appends trash icon to new list item
        ol.appendChild(li);
        input.value = ''; //Clears input field
        enableDragAndDrop(); //Enable drag and drop for new item
    }
}

function loadTasks() {
    // Placeholder for loading tasks from storage if needed
    const savedTasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
    const ol = document.querySelector('ol');
    savedTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        li.appendChild(createTrashIcon());
        ol.appendChild(li);
    });
}

function saveTasks() {
    // Placeholder for saving tasks to storage if needed
    const tasks = [];
    document.querySelectorAll('ol li').forEach(li => {
        tasks.push(li.textContent.replace('🗑️', '').trim());
    });
    console.log('Tasks to save:', tasks);
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
}


//Connects button to addTask function
document.querySelector('button').addEventListener('click', (event) => {
    event.preventDefault();
    addTask();
});

document.getElementById('clear-tasks').addEventListener('click', () => {
    document.querySelectorAll('ol li').forEach(li => li.remove());
    saveTasks(); // Save tasks after clearing all
});

document.getElementById('save-tasks').addEventListener('click', () => {
    saveTasks();
});

document.getElementById('reset-tasks').addEventListener('click', () => {
    const defaultTasks = [
        'Wake up early',
        'Drink a glass of water',
        'Do some light stretching',
        'Have a healthy breakfast',
        'Plan your day'
    ];
    const ol = document.querySelector('ol');
    ol.innerHTML = ''; // Clear existing tasks
    defaultTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        li.appendChild(createTrashIcon());
        ol.appendChild(li);
    });
    enableDragAndDrop(); // Enable drag and drop for all items
    saveTasks(); // Save tasks after resetting
});

// Add trash icon to all existing <li> elements on page load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('ol li').forEach(li => {
        // Avoid adding multiple trash icons if already present
        if (!li.querySelector('span')) {
            li.appendChild(createTrashIcon());
        }
    });
    enableDragAndDrop(); // Enable drag and drop for all items
    setBackgroundByTime(); // Set background based on current time
});


loadTasks(); // Load tasks on page load