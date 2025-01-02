
const background = document.getElementById('background');
const dateTime = document.getElementById('dateTime');
const modal = document.getElementById('goalModal');
const goalTitle = document.getElementById('goalTitle');
const goalDescription = document.getElementById('goalDescription');
const goalResults = document.getElementById('goalResults');
let currentGoal = null;
let currentListId = null; // Global variable to store the current list ID

// Update Date & Time
function updateDateTime() {
    const now = new Date();
    dateTime.textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Load daily image from an API
async function fetchDailyImage() {
    const accessKey = secrets.unsplashAccessKey;
    if (!accessKey) return;

    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=nature&client_id=${accessKey}`);
        const data = await response.json();
        background.style.backgroundImage = `url(${data.urls.full})`;
    } catch (error) {
        console.error('Failed to fetch image:', error);
    }
}
fetchDailyImage();

// Generate a unique ID
function generateGoalId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Save Goal
function saveGoal(listId, goal) {
    const savedGoals = JSON.parse(localStorage.getItem(listId) || '[]');
    savedGoals.push(goal);
    localStorage.setItem(listId, JSON.stringify(savedGoals));
}

// Add Goal
function addGoal(listId) {
    const list = document.getElementById(listId);
    const goalText = prompt('Enter your goal:');
    if (goalText) {
        const goalId = generateGoalId();
        const goal = {
            id: goalId,
            text: goalText,
            completed: false,
            description: '',
            result: ''
        };

        const listItem = document.createElement('li');
        listItem.setAttribute('data-goal-id', goalId);
        listItem.innerHTML = `
                    <input type="checkbox" onchange="toggleGoalCompletion('${listId}', '${goalId}')">
                    <span onclick="editGoal(this)">${goal.text}</span>
                    <div class="description" style="display:none;">${goal.description}</div>
                    <div class="result" style="display:none;">${goal.result}</div>
                `;
        list.appendChild(listItem);

        saveGoal(listId, goal);
        updateStats(listId);
    }
}

// Toggle Goal Completion
function toggleGoalCompletion(listId, goalId) {
    const savedGoals = JSON.parse(localStorage.getItem(listId) || '[]');
    const goalIndex = savedGoals.findIndex(goal => goal.id === goalId);

    if (goalIndex !== -1) {
        savedGoals[goalIndex].completed = !savedGoals[goalIndex].completed;
        localStorage.setItem(listId, JSON.stringify(savedGoals));
        updateStats(listId);
    }
}

// Open Modal to Edit Goal
function editGoal(element) {
    const listItem = element.closest('li');
    currentGoal = {
        id: listItem.getAttribute('data-goal-id'),
        text: listItem.querySelector('span').textContent,
        description: listItem.querySelector('.description').textContent,
        result: listItem.querySelector('.result').textContent
    };
    currentListId = listItem.closest('ul').id; // Store the list ID

    goalTitle.value = currentGoal.text;
    goalDescription.value = currentGoal.description;
    goalResults.value = currentGoal.result;

    modal.classList.add('show');
}

// Save Goal Edit
function saveGoalEdit() {
    const goalTitle = document.getElementById('goalTitle').value;
    const goalDescription = document.getElementById('goalDescription').value;
    const goalResults = document.getElementById('goalResults').value;

    const savedGoals = JSON.parse(localStorage.getItem(currentListId) || '[]');
    const goalIndex = savedGoals.findIndex(goal => goal.id === currentGoal.id);

    if (goalIndex !== -1) {
        savedGoals[goalIndex].text = goalTitle;
        savedGoals[goalIndex].description = goalDescription;
        savedGoals[goalIndex].result = goalResults;

        localStorage.setItem(currentListId, JSON.stringify(savedGoals));
        loadGoals(); // Reload goals to reflect the changes
        closeModal(); // Close the modal after saving
    } else {
        console.error(`Goal with ID ${currentGoal.id} not found in list ${currentListId}`);
    }
}

// Delete Goal
function deleteGoal() {
    const savedGoals = JSON.parse(localStorage.getItem(currentListId) || '[]');
    const goalIndex = savedGoals.findIndex(goal => goal.id === currentGoal.id);

    if (goalIndex !== -1) {
        savedGoals.splice(goalIndex, 1); // Remove the goal from the array
        localStorage.setItem(currentListId, JSON.stringify(savedGoals));
        loadGoals(); // Reload goals to reflect the changes
        closeModal(); // Close the modal after deleting
    } else {
        console.error(`Goal with ID ${currentGoal.id} not found in list ${currentListId}`);
    }
}

// Close Modal
function closeModal() {
    modal.classList.remove('show');
    currentGoal = null;
    currentListId = null; // Reset the list ID
    document.getElementById('goalTitle').value = '';
    document.getElementById('goalDescription').value = '';
    document.getElementById('goalResults').value = '';
}

// Update Stats
function updateStats(listId) {
    const savedGoals = JSON.parse(localStorage.getItem(listId) || '[]');
    const total = savedGoals.length;
    const completed = savedGoals.filter(goal => goal.completed).length;

    const stats = document.getElementById(`${listId}Stats`);
    if (stats) {
        stats.textContent = total > 0 ? `Completed: ${completed} / ${total}` : 'No goals yet.';
    }
}

// Load Goals
function loadGoals() {
    ['annualGoals', 'monthlyGoals', 'weeklyGoals', 'dailyGoals'].forEach(listId => {
        const savedGoals = JSON.parse(localStorage.getItem(listId) || '[]');
        console.log(`Loading goals for ${listId}:`, savedGoals); // Debug log
        const list = document.getElementById(listId);
        if (list) {
            list.innerHTML = ''; // Clear the list before loading
            savedGoals.forEach(goal => {
                const listItem = document.createElement('li');
                listItem.setAttribute('data-goal-id', goal.id);
                listItem.innerHTML = `
                            <input type="checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoalCompletion('${listId}', '${goal.id}')"> 
                            <span onclick="editGoal(this)">${goal.text}</span>
                            <div class="description" style="display:none;">${goal.description}</div>
                            <div class="result" style="display:none;">${goal.result}</div>
                        `;
                list.appendChild(listItem);
            });
            updateStats(listId);
        }
    });
}

// Load goals and stats on page load
window.onload = function () {
    loadGoals();
};