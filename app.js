document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  document
    .getElementById("taskInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") addTask();
    });

  window.addTask = function () {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    addTodo(taskText);
    taskInput.value = "";
  };

  window.editTask = function (id) {
    const li = document.querySelector(`[data-id='${id}']`);
    const span = li.querySelector("span");
    const editButton = li.querySelector(".edit");

    span.contentEditable = true;
    span.focus();
    editButton.textContent = "✅";

    span.addEventListener("blur", function () {
      editTodo(id, span.textContent.trim());
      span.contentEditable = false;
      editButton.textContent = "✏️";
    });
  };

  window.removeCompletedTasks = function () {
    deleteCompleted();
  };

  window.removeAllTasks = function () {
    deleteAll();
  };
});

// Массив задач
const todos = getTasksFromLocalStorage();

function loadTasks() {
  renderTodos();
}

function createTodo({ id, isDone, text }) {
  const li = document.createElement("li");
  li.setAttribute("data-id", id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isDone;
  checkbox.onclick = () => toggleIsDone(id);
  li.appendChild(checkbox);

  const span = document.createElement("span");
  span.textContent = text;
  span.style.textDecoration = isDone ? "line-through" : "none";
  li.appendChild(span);

  const editButton = document.createElement("button");
  editButton.textContent = "✏️";
  editButton.className = "edit";
  editButton.onclick = () => editTask(id);
  li.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑️";
  deleteButton.onclick = () => deleteTodo(id);
  li.appendChild(deleteButton);

  return li;
}

function renderTodos() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  todos.forEach((todo) => {
    const li = createTodo(todo);
    taskList.appendChild(li);
  });
}

function addTodo(text) {
  const todo = {
    text: text,
    id: `id-${Date.now()}`,
    isDone: false,
  };
  todos.push(todo);
  setTasksToLocalStorage(todos);
  renderTodos();
}

function editTodo(id, text) {
  const todo = todos.find((todo) => todo.id === id);
  todo.text = text;
  setTasksToLocalStorage(todos);
}

function toggleIsDone(id) {
  const todo = todos.find((todo) => todo.id === id);
  todo.isDone = !todo.isDone;
  setTasksToLocalStorage(todos);
  renderTodos();
}

function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  todos.splice(index, 1);
  setTasksToLocalStorage(todos);
  renderTodos();
}

function deleteCompleted() {
  const uncompletedTodos = todos.filter((todo) => !todo.isDone);
  todos.length = 0;
  todos.push(...uncompletedTodos); 
  setTasksToLocalStorage(todos);
  renderTodos(); /
}

function deleteAll() {
  todos.length = 0; 
  localStorage.removeItem("tasks");
  renderTodos(); 
}

function getTasksFromLocalStorage() {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

function setTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
