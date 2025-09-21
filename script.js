
//Creates a trash icon element with click event to delete its parent <li>
function createTrashIcon() {
    //Adds span with trash can emoji
    const trash = document.createElement('span');
    trash.textContent = '🗑️';
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
    }
}


//Connects button to addTask function
document.querySelector('button').addEventListener('click', (event) => {
    event.preventDefault();
    addTask();
});

// Add trash icon to all existing <li> elements on page load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('ol li').forEach(li => {
        // Avoid adding multiple trash icons if already present
        if (!li.querySelector('span')) {
            li.appendChild(createTrashIcon());
        }
    });
});