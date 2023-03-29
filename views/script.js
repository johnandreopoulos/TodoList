const header = document.getElementsByClassName('task-header-title')[0];
header.innerHTML = `Todo ${new Date().toDateString()}`;

// its like "0 tasks"
let deletedTasks = 0;
const taskCount = document.querySelector('.task-count');
let isDeletingTask = false; // lock variable to prevent multiple delete requests

fetch('/tasks')
  .then(res => res.json())
  .then(tasks => {
    const taskList = document.querySelector('.task-list');
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      taskList.innerHTML = '<div class="task-item" id="no-tasks">No tasks</div>';
      taskCount.innerHTML = '0 tasks';
      return;
    }
    tasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.classList.add('task-item');
      if (task.completed) taskItem.classList.add('is-completed');
      taskItem.innerHTML = `
                    <input class="task-status" type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <label class="task-name">${task.name}</label>
                    <button class="task-delete" data-id="${task.id}"></button>
                `;
      taskList.appendChild(taskItem);
      taskCount.innerHTML = tasks.length + ' tasks';
    });
  });

const taskForm = document.querySelector('.task-form');
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskInput = document.querySelector('.task-input');
  const taskName = taskInput.value;
  if (taskName) {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: taskName
      })
    })
      .then(res => res.json())
      .then(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
                    <input class="task-status" type="checkbox" data-id="${task.id}">
                    <label class="task-name">${task.name}</label>
                    <button class="task-delete" data-id="${task.id}"></button>
                `;
        const taskList = document.querySelector('.task-list');
        taskList.appendChild(taskItem);
        taskInput.value = '';

        const noTasks = document.getElementById('no-tasks');
        if (noTasks) noTasks.remove();
        taskCount.innerHTML = parseInt(taskCount.innerHTML) + 1 + ' tasks';
      });
  }
});

const taskList = document.querySelector('.task-list');
taskList.addEventListener('click', e => {
  if (e.target.classList.contains('task-delete') && !isDeletingTask) {
    isDeletingTask = true; // set lock variable to true
    const taskId = e.target.dataset.id;
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(task => {
        e.target.parentNode.remove();
        taskCount.innerHTML = parseInt(taskCount.innerHTML) - 1 + ' tasks';
        isDeletingTask = false; // reset lock variable to false after response is received

        // if all tasks are deleted, show "No tasks" message
        if (parseInt(taskCount.innerHTML) === 0) {
          const taskItem = document.createElement('div');
          taskItem.classList.add('task-item');
          taskItem.id = 'no-tasks';
          taskItem.innerHTML = 'No tasks';
          const taskList = document.querySelector('.task-list');
          taskList.appendChild(taskItem);
        }
      })
      .catch(err => {
        console.log('Error deleting task:', err);
        isDeletingTask = false; // reset lock variable to false in case of error
      });
  }
});

const taskStatus = document.querySelector('.task-list');
taskStatus.addEventListener('change', e => {
  if (e.target.classList.contains('task-status')) {
    const taskId = e.target.dataset.id;
    fetch(`/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: taskId,
        name: e.target.parentNode.querySelector('.task-name').innerText,
        completed: e.target.checked
      })
    })
      .then(res => res.json())
      .then(task => {
        e.target.parentNode.classList.toggle('is-completed');
      });
  }
});

// TaskFilters
const taskFilters = document.querySelectorAll('.task-filter');

taskFilters.forEach(taskFilter => {
  taskFilter.addEventListener('click', () => {
    taskFilters.forEach(taskFilter => {
      taskFilter.classList.remove('is-active');
    });
    taskFilter.classList.add('is-active');
  });
});

// when clicking the "All" button, show all items
taskFilters[0].addEventListener('click', () => {
  const taskItems = document.querySelectorAll('.task-item');
  taskItems.forEach(taskItem => {
    taskItem.classList.remove('is-hidden');
  });
});

// when clicking the "Active" button, show only the items that are not completed
taskFilters[1].addEventListener('click', () => {
  const taskItems = document.querySelectorAll('.task-item');
  taskItems.forEach(taskItem => {
    if (taskItem.classList.contains('is-completed')) taskItem.classList.add('is-hidden');
    else taskItem.classList.remove('is-hidden');
  });
});

// when clicking the "Completed" button, show only the items that are completed
taskFilters[2].addEventListener('click', () => {
  const taskItems = document.querySelectorAll('.task-item');
  taskItems.forEach(taskItem => {
    if (taskItem.classList.contains('is-completed')) taskItem.classList.remove('is-hidden');
    else taskItem.classList.add('is-hidden');
  });
});
