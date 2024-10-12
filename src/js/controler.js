// DOM elements
const themeBtn = document.querySelector(".theme");
const form = document.querySelector(".create");
const formChecked = document.querySelector(".create__checkbox");
const formContent = document.querySelector(".create__input");
const listDOM = document.querySelector(".list");
const control = document.querySelector(".control");
const clearCompleted = document.querySelector("a.clear");
const taskNumber = document.querySelector(".left");

// global variables
let tasks = [];
let filter = "all";

/////////////////////////////////////////////////////////
// event handling
// dark theme
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark"))
    themeBtn.src = "src/images/icon-sun.svg";
  else themeBtn.src = "src/images/icon-moon.svg";
});

// add new task
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addNewTask();
});

// remove task
listDOM.addEventListener("click", (e) => {
  const task = e.target.closest(".task");
  const target = e.target.closest(".remove");
  // guard class
  if (!task || !target) return;
  removeTask(task);
});

// mark task comlete
listDOM.addEventListener("click", (e) => {
  const checkbox = e.target.closest(`input[type='checkbox']`);
  const task = e.target.closest(".task");

  // guard class
  if (!task || !checkbox) return;
  task.classList.toggle("completed");

  filterList();
});

// filter tasks
control.addEventListener("click", (e) => {
  const target = e.target.closest("a");

  // guard class
  if (!target) return;

  // update current filter
  control.querySelectorAll("a").forEach((el) => el.classList.remove("current"));
  target.classList.add("current");

  filter = target.textContent.toLowerCase();
  filterList();
});

// clear complete
clearCompleted.addEventListener("click", () => {
  const completedTasks = tasks.filter((task) =>
    task.classList.contains("completed")
  );
  completedTasks.forEach((task) => removeTask(task));
});

/////////////////////////////////////////////////////////
// functionalities
const clear = function () {
  listDOM.innerHTML = "";
};

const addNewTask = function () {
  const checked = formChecked.checked;
  const content = formContent.value;

  // guard class
  if (!content) return;

  // reset inpur
  formChecked.checked = false;
  formContent.value = "";

  // generate the task in dom
  const markup = `
          <li class="task ${checked ? "completed" : ""}" draggable="true">
            <input type="checkbox" class="task__checkbox " 
            ${checked ? "checked" : ""}>
            <p class="task__content">${content}</p>
            <img src="src/images/icon-cross.svg" alt class="remove">
          </li>
  `;
  listDOM.insertAdjacentHTML("afterbegin", markup);
  updateArray();
  filterList();
};

const removeTask = function (task) {
  const index = tasks.indexOf(task);
  tasks.splice(index, 1);
  updateListDOM();
  filterList();
};

const renderTask = function (task) {
  listDOM.insertAdjacentElement("afterbegin", task);
};

const updateArray = function () {
  tasks = [];
  let data = Array.from(listDOM.querySelectorAll(".task"));
  if (Array.isArray(data)) tasks = data;
};

const updateListDOM = function () {
  clear();
  tasks.reverse().forEach((task) => renderTask(task));
  tasks.reverse();
};

const filterList = function () {
  clear();
  let tasksNum = 0;
  tasks.reverse().forEach((task) => {
    const complete = task.classList.contains("completed");
    if (
      filter === "all" ||
      (filter === "active" && !complete) ||
      (filter === "completed" && complete)
    ) {
      tasksNum++;
      renderTask(task);
    }
  });
  tasks.reverse();
  taskNumber.textContent = tasksNum;
};

// initializing the app
clear();
filterList();
