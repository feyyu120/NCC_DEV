const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const clearCompletedBtn = document.getElementById('clearCompleted');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'} check-icon" 
               style="color: ${task.completed ? '#22c55e' : '#cbd5e1'}; font-size: 1.5rem; cursor: pointer;"></i>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" title="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        `;

        // Toggle completion
        const toggleComplete = () => {
            tasks[index].completed = !tasks[index].completed;
            saveAndRender();
        };

        li.querySelector('.check-icon').addEventListener('click', toggleComplete);
        li.querySelector('.task-text').addEventListener('click', toggleComplete);

        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            saveAndRender();
        });

        taskList.appendChild(li);
    });

    updateStats();
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    totalTasksEl.textContent = `${total} task${total !== 1 ? 's' : ''}`;
    completedTasksEl.textContent = `${completed} completed`;
}

function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert("⚠️ Please enter a task before adding!");
        taskInput.focus();
        return;
    }
    
    tasks.push({
        text: text,
        completed: false
    });
    
    taskInput.value = '';
    saveAndRender();
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

clearCompletedBtn.addEventListener('click', () => {
    if (tasks.filter(t => t.completed).length === 0) return;
    
    if (confirm('Clear all completed tasks?')) {
        tasks = tasks.filter(task => !task.completed);
        saveAndRender();
    }
});

// Initial render
renderTasks();