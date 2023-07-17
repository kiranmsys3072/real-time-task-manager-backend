const socket = io();

const taskForm = document.getElementById('taskForm');
const taskTitleInput = document.getElementById('taskTitle');
const taskList = document.getElementById('taskList');

// Emit 'taskCreated' event when the form is submitted
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  if (title) {
    const newTask = {
      title,
      status: 'pending'
    };

    // Send 'taskCreated' event to the server
    socket.emit('taskCreated', newTask);
    taskTitleInput.value = '';
  }
});

// Listen for 'taskCreated' events from the server
socket.on('taskCreated', (task) => {
  // Create a new list item for the task
  const taskItem = document.createElement('li');
  taskItem.textContent = task.title;

  // Append the task item to the task list
  taskList.appendChild(taskItem);
});

// Listen for 'taskUpdated' events from the server
socket.on('taskUpdated', (task) => {
  // Find the task item by its title
  const taskItem = Array.from(taskList.children).find((item) => item.textContent === task.title);

  // Update the task status if found
  if (taskItem) {
    taskItem.classList.remove('pending', 'in-progress', 'completed');
    taskItem.classList.add(task.status);
  }
});

// Listen for 'taskDeleted' events from the server
socket.on('taskDeleted', (task) => {
  // Find the task item by its title
  const taskItem = Array.from(taskList.children).find((item) => item.textContent === task.title);

  // Remove the task item if found
  if (taskItem) {
    taskItem.remove();
  }
});
