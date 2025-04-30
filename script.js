let tasks = [];
let deleteIndex = null;
let toggleIndex = null;

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Adicionar nova tarefa
function addTask() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim() !== '') {
        const now = new Date();
        const createdAt = now.toISOString();
        tasks.push({ text: taskInput.value, completed: false, createdAt });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const filter = document.getElementById('filter').value;
    const sort = document.getElementById('sort') ? document.getElementById('sort').value : 'none';

    let filteredTasks = tasks.filter(task => {
        return (
            filter === 'all' ||
            (filter === 'completed' && task.completed) ||
            (filter === 'pending' && !task.completed)
        );
    });

    // Aplicar ordenação
    if (sort === 'recent') {
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'completedFirst') {
        filteredTasks.sort((a, b) => (b.completed === true) - (a.completed === true));
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');

        li.innerHTML = `
            <div style="flex: 1;">
                <span>${task.text}</span><br>
                <small class="text-muted">Criada em: ${new Date(task.createdAt).toLocaleString()}</small>
            </div>
            <div class="actions">
                <button class="btn btn-success" onclick="toggleComplete(${tasks.indexOf(task)})">
                    <i class="bi bi-check"></i>
                </button>
                <button class="btn btn-danger" onclick="openModal(${tasks.indexOf(task)})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        if (task.completed) {
            const span = li.querySelector('span');
            span.style.textDecoration = "line-through";
            span.style.color = "#6b7280";
        }

        taskList.appendChild(li);
    });
}

function toggleComplete(index) {
    if (tasks[index].completed) {
        toggleIndex = index;
        deleteIndex = null;
        document.querySelector('#confirmModal .modal-title').innerText = "ATENÇÃO!";
        document.querySelector('#confirmModal .modal-body p').innerText = "Esta tarefa já foi concluída. Deseja desmarcá-la?";
        document.getElementById('confirmModal').style.display = 'block';
    } else {
        tasks[index].completed = true;
        saveTasks();
        renderTasks();
    }
}

function openModal(index) {
    deleteIndex = index;
    toggleIndex = null;
    document.querySelector('#confirmModal .modal-title').innerText = "ATENÇÃO!";
    document.querySelector('#confirmModal .modal-body p').innerText = "Deseja realmente excluir esta tarefa?";
    document.getElementById('confirmModal').style.display = 'block';
}

function closeModal() {
    deleteIndex = null;
    toggleIndex = null;
    document.getElementById('confirmModal').style.display = 'none';
}

function confirmDelete() {
    if (deleteIndex !== null) {
        tasks.splice(deleteIndex, 1);
    } else if (toggleIndex !== null) {
        tasks[toggleIndex].completed = false;
    }
    deleteIndex = null;
    toggleIndex = null;
    saveTasks();
    renderTasks();
    closeModal();
}

window.onload = function() {
    loadTasks();
    renderTasks();
};
