/**This script is for functions associated with user information */

//Prompt user with his/her name and save it to localStorage
export function promptForName() {
    let name = localStorage.getItem('userName');

    //If there is no name in localStorage, prompt the user to enter one and save it
    while (!name) {
        name = prompt('Please enter your name:');
        if (name) {
            localStorage.setItem('userName', name);
        }
    }
    return name;
}

const userName = promptForName();
if (userName) {
    document.getElementById('greeting').textContent = `Hello, ${userName}!`;
}

// Button to update name
document.getElementById('update-name').addEventListener('click', () => {
    // Prompt user to enter a new name and update localStorage and greeting
    const newName = prompt('Please enter your name:');
    if (newName) {
        localStorage.setItem('userName', newName);
        document.getElementById('greeting').textContent = `Hello, ${newName}!`;
    } else {}
});