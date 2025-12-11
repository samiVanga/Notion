// Load tasks from storage
function loadTasks() {
  const today = new Date().toDateString();
  const lastDay = localStorage.getItem("lastResetDay");

  // Reset all tasks at start of new day
  if (today !== lastDay) {
    localStorage.clear();
    localStorage.setItem("lastResetDay", today);
  }

  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(task => addTaskToDOM(task.text, task.checked, task.id));
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    const id = li.dataset.id;
    const text = li.querySelector(".task-text").value;
    const checked = li.querySelector(".heart").classList.contains("filled");

    tasks.push({ id, text, checked });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Add a task to the DOM
function addTaskToDOM(text, checked = false, id = Date.now()) {
  const list = document.getElementById("todo-list");

  const li = document.createElement("li");
  li.dataset.id = id;

  li.innerHTML = `
    <span class="heart ${checked ? "filled" : "empty"}"></span>
    <input class="task-text" type="text" value="${text}">
    <button class="delete-btn">×</button>
  `;

  const heart = li.querySelector(".heart");
  const textInput = li.querySelector(".task-text");

  // Toggle heart
  heart.addEventListener("click", () => {
    const nowFilled = heart.classList.toggle("filled");
    heart.classList.toggle("empty");
    saveTasks();
  });

  textInput.addEventListener("input", saveTasks);

  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  list.appendChild(li);
  saveTasks();
}

// Add button click
document.getElementById("add-btn").addEventListener("click", () => {
  const input = document.getElementById("new-task");
  const text = input.value.trim();
  if (!text) return;

  addTaskToDOM(text);
  input.value = "";
});

// Enter key adds task
document.getElementById("new-task").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const text = e.target.value.trim();
    if (!text) return;

    addTaskToDOM(text);
    e.target.value = "";
  }
});

// Load tasks on start
loadTasks();
