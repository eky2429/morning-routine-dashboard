// Sets background based on time of day
function setBackgroundByTime() {
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

//Code that updates the progress text based on completed tasks
function updateProgress() {
    const tasks = document.querySelectorAll('ol li');
    const completedCount = document.querySelectorAll('ol li.completed').length;
    const totalCount = tasks.length;

    const progressEl = document.getElementById('task-progress');
    progressEl.textContent = `${completedCount} / ${totalCount} tasks completed`;
}

// Creates a trash icon element with click event to delete its parent <li>
function createTrashIcon() {
    const trash = document.createElement('button');
    trash.textContent = '🗑️';
    trash.classList.add('delete-btn');
    trash.style.cursor = 'pointer';
    trash.style.marginLeft = '10px';
    trash.title = 'Delete task';

    trash.addEventListener('click', function (e) {
        e.stopPropagation();
        this.parentElement.remove();
        updateProgress();
        saveTasks(); // Auto-save after deletion
    });

    return trash;
}

// Makes list items draggable and enables reordering
function enableDragAndDrop() {
    const listItems = document.querySelectorAll('ol li');

    listItems.forEach(li => {
        li.draggable = true;

        li.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
            this.classList.add('dragging');
        });

        li.addEventListener('dragend', function () {
            this.classList.remove('dragging');
        });

        li.addEventListener('dragover', function (e) {
            e.preventDefault();
            if (this.classList.contains('dragging')) return;
            this.classList.add('drag-over');
        });

        li.addEventListener('dragleave', function () {
            this.classList.remove('drag-over');
        });

        li.addEventListener('drop', function (e) {
            e.preventDefault();
            if (this.classList.contains('dragging')) return;

            const draggingItem = document.querySelector('.dragging');
            if (draggingItem !== this) {
                this.parentElement.insertBefore(draggingItem, this);
                saveTasks(); // Auto-save after reorder
            }
            this.classList.remove('drag-over');
        });
    });
}

// Creates a task <li> element from text and completion state
function createTaskElement(task) {
    const li = document.createElement('li');

    // Create checkbox (outside the label now)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;

    // Create task text span
    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = task.text;

    // Apply completed style
    if (task.completed) {
        li.classList.add('completed');
    }

    // Toggle completed state when checkbox clicked
    checkbox.addEventListener('change', function () {
        li.classList.toggle('completed', checkbox.checked);
        saveTasks();
        updateProgress();
    });

    // Double-click to edit text
    span.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const currentText = span.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.classList.add('edit-input');

        li.replaceChild(input, span);
        input.focus();
        input.select(); // Optional: select all text immediately

        function finishEdit() {
            span.textContent = input.value.trim() || currentText;
            li.replaceChild(span, input);
            saveTasks();
            updateProgress();
        }

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finishEdit();
            if (e.key === 'Escape') li.replaceChild(span, input);
        });
    });

    // Create delete button
    const deleteBtn = createTrashIcon();

    // Append elements to <li>
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
}

// Adds a new task when submit button is pressed
function addTask() {
    const input = document.querySelector('input[type="text"]');
    const newTaskText = input.value.trim();

    if (newTaskText) {
        const ol = document.querySelector('ol');
        const li = createTaskElement({ text: newTaskText, completed: false });
        ol.appendChild(li);
        updateProgress();

        input.value = '';
        enableDragAndDrop();
        saveTasks(); // Auto-save on add
    }
}

// Loads tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const ol = document.querySelector('ol');
    ol.innerHTML = ''; // Clear any existing tasks

    savedTasks.forEach(task => {
        // Handle old format (string)
        if (typeof task === 'string') {
            task = { text: task, completed: false };
        }
        ol.appendChild(createTaskElement(task));
    });

    enableDragAndDrop();
    updateProgress(); // Update progress text after loading
}

// Saves tasks to localStorage
function saveTasks() {
    const tasks = [];

    document.querySelectorAll('ol li').forEach(li => {
        const text = li.querySelector('.task-text').textContent;
        const completed = li.querySelector('.task-checkbox').checked;

        tasks.push({ text, completed });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks saved:', tasks);
}

// Button event connections
document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});

document.getElementById('clear-tasks').addEventListener('click', () => {
    document.querySelectorAll('ol li').forEach(li => li.remove());
    updateProgress(); //Updates progress text after clearing
    saveTasks(); // Auto-save after clearing
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
    ol.innerHTML = '';
    defaultTasks.forEach(task => ol.appendChild(createTaskElement({ text: task, completed: false })));
    enableDragAndDrop();
    saveTasks(); // Auto-save after reset
});

// Initial setup on page load
window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setBackgroundByTime();
});