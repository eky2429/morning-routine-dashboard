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
        // Remove the parent <li> element
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
    //Creates the li element
    const li = document.createElement('li');


    // Create checkbox (outside the label now) (task.completed is a boolean)
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;

    // Create task text span
        //Task.text is the text of the task
    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = task.text;

    //Create a time tag span
        //task.time is the time in minutes for the task
    const timeTag = document.createElement('span');
    timeTag.classList.add('task-time');
    timeTag.textContent = `${task.time} min`;
    timeTag.title = "Double-click to edit time";
    //Listener that triggers when user double clicks the time tage
    timeTag.addEventListener('dblclick', (e) => {
        // Prevent the double-click from also triggering the task text edit
        e.stopPropagation();

        const currentTime = parseInt(timeTag.textContent) || 0;

        //Create an input element to edit the time
        const input = document.createElement('input');
        input.type = 'number';
        input.value = currentTime;
        input.min = 0;
        input.classList.add('edit-input');
        li.replaceChild(input, timeTag);

        // Focus and select the input for easier editing
        input.focus();
        input.select();

        //Called to save the time
        function finishEdit() {
            const newTime = parseInt(input.value) || 0;
            timeTag.textContent = `${newTime} min`;
            li.replaceChild(timeTag, input);

            saveTasks();
            updateTotalTime(); // 🔥 important
        }

        // When the input loses focus, save the new time
        input.addEventListener('blur', finishEdit);

        // When the user presses Enter, save the new time. If they press Escape, cancel the edit.
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finishEdit();
            if (e.key === 'Escape') li.replaceChild(timeTag, input);
        });
    });

    //Create label tag
        //task.label is the label for the task (e.g. "Spiritual", "Mind", etc.)
    const labelTag = document.createElement('span');
    labelTag.classList.add('task-label');
    labelTag.textContent = task.label;
    labelTag.classList.add(task.label); // Add a class based on the label for styling

    // Apply completed style if task is completed
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

    // Double-click to edit span / name of task
    span.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const currentText = span.textContent;

        //Create an input element to edit the task text
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.classList.add('edit-input');
        li.replaceChild(input, span);

        // Focus and select the input for easier editing
        input.focus();
        input.select();

        //Called to save the task text
        function finishEdit() {
            span.textContent = input.value.trim() || currentText;
            li.replaceChild(span, input);
            saveTasks();
            updateProgress();
        }

        // When the input loses focus, save the new task text
        input.addEventListener('blur', finishEdit);
        // When the user presses Enter, save the new task text. If they press Escape, cancel the edit.
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

    //Compare the label of each task to the selected label. If they match, show the task. If the selected label is "All", show all tasks. Otherwise, hide the task.

    tasks.forEach(li => {
        const taskLabel = li.querySelector('.task-label')?.textContent || "Other";

        if (label === "All" || taskLabel === label) {
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    });
}