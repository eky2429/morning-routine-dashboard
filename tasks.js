/** Code associated with the task elements */

export function updateTotalTime() {
    let total = 0;

    document.querySelectorAll('ol li').forEach(li => {
        const timeText = li.querySelector('.task-time')?.textContent;
        const minutes = parseInt(timeText) || 0;
        total += minutes;
    });

    const totalEl = document.getElementById('total-time');
    if (totalEl) {
        totalEl.textContent = `Total Time: ${total} min`;
    }
}

// Creates a trash icon element with click event to delete its parent <li>
export function createTrashIcon() {
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
        updateTotalTime();
        saveTasks(); // Auto-save after deletion
    });

    return trash;
}

// Makes list items draggable and enables reordering
export function enableDragAndDrop() {
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
export function createTaskElement(task) {
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

    //Create a time tag span
    const timeTag = document.createElement('span');
    timeTag.classList.add('task-time');
    timeTag.textContent = `${task.time} min`;
    timeTag.title = "Double-click to edit time";
    timeTag.addEventListener('dblclick', (e) => {
        e.stopPropagation();

        const currentTime = parseInt(timeTag.textContent) || 0;

        const input = document.createElement('input');
        input.type = 'number';
        input.value = currentTime;
        input.min = 0;
        input.classList.add('edit-input');

        li.replaceChild(input, timeTag);
        input.focus();
        input.select();

        function finishEdit() {
            const newTime = parseInt(input.value) || 0;
            timeTag.textContent = `${newTime} min`;
            li.replaceChild(timeTag, input);

            saveTasks();
            updateTotalTime(); // 🔥 important
        }

        input.addEventListener('blur', finishEdit);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finishEdit();
            if (e.key === 'Escape') li.replaceChild(timeTag, input);
        });
    });

    //Create label tag
    const labelTag = document.createElement('span');
    labelTag.classList.add('task-label');
    labelTag.textContent = task.label;
    labelTag.setAttribute('data-label', task.label);

    // Apply completed style
    if (task.completed) {
        li.classList.add('completed');
    }

    // Toggle completed state when checkbox clicked
    checkbox.addEventListener('change', function () {
        li.classList.toggle('completed', checkbox.checked);
        saveTasks();
        updateProgress();
        updateTotalTime();
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
    li.appendChild(labelTag);
    li.appendChild(timeTag);
    li.appendChild(deleteBtn);

    return li;
}

//Code that updates the progress text based on completed tasks
export function updateProgress() {
    const tasks = document.querySelectorAll('ol li');
    const completedCount = document.querySelectorAll('ol li.completed').length;
    const totalCount = tasks.length;

    const progressEl = document.getElementById('task-progress');
    progressEl.textContent = `${completedCount} / ${totalCount} tasks completed`;
}

// Adds a new task when submit button is pressed
export function addTask() {
    const input = document.querySelector('input[type="text"]');
    const newTaskText = input.value.trim();

    if (newTaskText) {
        const labelSelect = document.getElementById('task-label');
        const selectedLabel = labelSelect.value;
        const timeInput = document.getElementById('task-time');
        const timeValue = parseInt(timeInput.value) || 0;

        const ol = document.querySelector('ol');
        const li = createTaskElement({
            text: newTaskText,
            completed: false,
            label: selectedLabel,
            time: timeValue
        });
        timeInput.value = '';
        ol.appendChild(li);
        updateProgress();
        updateTotalTime();

        input.value = '';
        enableDragAndDrop();
        saveTasks(); // Auto-save on add
    }
}

// Loads tasks from localStorage
export function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const ol = document.querySelector('ol');
    ol.innerHTML = ''; // Clear any existing tasks

    savedTasks.forEach(task => {
        // Handle old format (string)
        if (typeof task === 'string') {
            task = {
                text: task.text,
                completed: task.completed,
                label: task.label || "Other",
                time: task.time || 0
            };
        }
        ol.appendChild(createTaskElement(task));
    });

    enableDragAndDrop();
    updateProgress(); // Update progress text after loading
    updateTotalTime(); // Update total time on load
}

// Saves tasks to localStorage
export function saveTasks() {
    const tasks = [];

    document.querySelectorAll('ol li').forEach(li => {
        const text = li.querySelector('.task-text').textContent;
        const completed = li.querySelector('.task-checkbox').checked;

        const label = li.querySelector('.task-label')?.textContent || "Other";

        const time = parseInt(li.querySelector('.task-time')?.textContent) || 0;

        tasks.push({
            text,
            completed,
            label,
            time
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks saved:', tasks);
}

//Filters tasks based on selected label
export function filterTasks(label) {
    const tasks = document.querySelectorAll('ol li');

    tasks.forEach(li => {
        const taskLabel = li.querySelector('.task-label')?.textContent;

        if (label === "All" || taskLabel === label) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}