// Retrieve todo from local storage or initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];
const todoInput = document.getElementById("todoInput");
const taskStartTime = document.getElementById("startTimeInput");
const taskEndTime = document.getElementById("endTimeInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
const filterButton = document.getElementById("filterButton");
const filterOptions = document.getElementById("filterOptions");

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents default Enter key behavior
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);

  // Add event listener for the Filter button
  filterButton.addEventListener("click", toggleFilterOptions);

  // Add event listener for the filter dropdown
  filterOptions.addEventListener("change", applyFilter);

  displayTasks();
});

// Function to toggle the visibility of filter options
function toggleFilterOptions() {
  if (filterOptions.style.display === "none") {
    filterOptions.style.display = "block";
  } else {
    filterOptions.style.display = "none";
  }
}

// Function to apply the selected filter
function applyFilter() {
  const filterValue = filterOptions.value;

  if (filterValue === "name") {
    // Sort by task name alphabetically
    todo.sort((a, b) => a.text.localeCompare(b.text));
  } else if (filterValue === "startTime") {
    // Sort by start time
    todo.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0; // If startTime is not provided, keep them in the same order
    });
  } else if (filterValue === "endTime") {
    // Sort by end time
    todo.sort((a, b) => {
      if (a.endTime && b.endTime) {
        return a.endTime.localeCompare(b.endTime);
      }
      return 0; // If endTime is not provided, keep them in the same order
    });
  }

  // Save the sorted tasks to local storage and re-render the tasks
  saveToLocalStorage();
  displayTasks();

  // Hide the filter dropdown after sorting
  filterOptions.style.display = "none";
}

// Function to add a task
function addTask() {
  const newTask = todoInput.value.trim();
  const startTime = taskStartTime.value;
  const endTime = taskEndTime.value;

  if (newTask !== "" && endTime !== "") {
    todo.push({
      text: newTask,
      disabled: false,
      startTime: startTime,
      endTime: endTime,
    });
    saveToLocalStorage();
    todoInput.value = "";
    taskStartTime.value = "";
    taskEndTime.value = "";
    displayTasks();
    setTaskAutoCompletion(endTime, todo.length - 1); // Schedule auto-completion
  }
}

// Function to display tasks
function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const p = document.createElement("p");
    p.innerHTML = `
      <div class="todo-container">
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${item.disabled ? "disabled" : ""}">
          <strong>${item.text}</strong><br>
          <small>Start: ${item.startTime || "N/A"} | End: ${item.endTime || "N/A"}</small>
        </p>
      </div>
    `;
    p.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTask(index)
    );
    todoList.appendChild(p);

    // Schedule auto-completion for tasks with valid end times
    if (item.endTime) {
      setTaskAutoCompletion(item.endTime, index);
    }
  });
  todoCount.textContent = todo.length;
}

// Function to toggle task completion
function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

// Function to delete all tasks
function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

// Function to save tasks to local storage
function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

// Function to set automatic task completion
function setTaskAutoCompletion(endTime, index) {
  const now = new Date();
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  // Calculate the task's end time
  const taskEndTime = new Date();
  taskEndTime.setHours(endHours, endMinutes, 0, 0);

  const timeDifference = taskEndTime - now;

  if (timeDifference > 0) {
    setTimeout(() => {
      // Mark task as completed when endTime is reached
      todo[index].disabled = true;
      saveToLocalStorage();
      displayTasks();
    }, timeDifference);
  } else {
    // If the end time has already passed, complete the task immediately
    todo[index].disabled = true;
    saveToLocalStorage();
    displayTasks();
  }
}
