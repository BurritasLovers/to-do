let currentUser = null;
let tasks = [];
let categories = [];

// DOM Elements
const userRegistration = document.getElementById('user-registration');
const taskManagement = document.getElementById('task-management');
const userName = document.getElementById('user-name');
const registrationForm = document.getElementById('registration-form');
const taskForm = document.getElementById('task-form');
const categoryForm = document.getElementById('category-form');
const taskList = document.getElementById('task-list');
const categoryList = document.getElementById('category-list');
const categorySelect = document.getElementById('task-category');

// Event Listeners
registrationForm.addEventListener('submit', registerUser);
taskForm.addEventListener('submit', createTask);
categoryForm.addEventListener('submit', addCategory);

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => openTab(button.dataset.tab));
});

// User Registration
function registerUser(e) {
    e.preventDefault();
    currentUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };
    userName.textContent = currentUser.name;
    userRegistration.classList.add('hidden');
    taskManagement.classList.remove('hidden');
}

// Task Management
function createTask(e) {
    e.preventDefault();
    const newTask = {
        id: tasks.length + 1,
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        subtasks: document.getElementById('task-subtasks').value.split(',').map(s => s.trim()),
        endDate: document.getElementById('task-end-date').value,
        category: document.getElementById('task-category').value,
        startDate: new Date().toISOString(),
        state: 'started',
        importance: document.getElementById('task-importance').value
    };
    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Subtasks:</strong> ${task.subtasks.join(', ')}</p>
            <p><strong>Category:</strong> ${task.category}</p>
            <p><strong>Importance:</strong> ${task.importance}</p>
            <p><strong>State:</strong> ${task.state}</p>
            <p><strong>Start Date:</strong> ${new Date(task.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> ${new Date(task.endDate).toLocaleDateString()}</p>
            <div class="task-actions">
                <select class="task-state" ${task.state === 'completed' ? 'disabled' : ''}>
                    <option value="started" ${task.state === 'started' ? 'selected' : ''}>Started</option>
                    <option value="in progress" ${task.state === 'in progress' ? 'selected' : ''}>In Progress</option>
                    <option value="completed" ${task.state === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="postponed" ${task.state === 'postponed' ? 'selected' : ''}>Postponed</option>
                </select>
                <button class="delete-task">Delete</button>
            </div>
        `;
        
        const stateSelect = taskElement.querySelector('.task-state');
        stateSelect.addEventListener('change', () => updateTaskState(task.id, stateSelect.value));
        
        const deleteButton = taskElement.querySelector('.delete-task');
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(taskElement);
    });
}

function updateTaskState(taskId, newState) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.state !== 'completed') {
        task.state = newState;
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
}

// Category Management
function addCategory(e) {
    e.preventDefault();
    const newCategory = document.getElementById('new-category').value;
    if (categories.length < 10 && !categories.includes(newCategory)) {
        categories.push(newCategory);
        renderCategories();
        updateCategorySelect();
        document.getElementById('new-category').value = '';
    } else {
        alert('Maximum number of categories reached or category already exists');
    }
}

function renderCategories() {
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category;
        categoryList.appendChild(li);
    });
}

function updateCategorySelect() {
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Tab Management
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabName).classList.remove('hidden');
    
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Initialize
renderCategories();
updateCategorySelect();