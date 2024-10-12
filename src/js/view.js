const form = document.querySelector("form");
const checkedDOM = form.querySelector(".create__check-box");
const contentDOM = form.querySelector(".create__input");
const themeBtn = document.querySelector(".theme");
const todoList = document.querySelector(".list");
const itemsLeft = document.querySelector(".items-left");
// controls
const filterList = document.querySelector(".filter");
const clearBtn = document.querySelector(".clear");

class View {
  addHandlerTheme() {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      if (document.body.classList.contains("dark"))
        themeBtn.src = "src/images/icon-sun.svg";
      else themeBtn.src = "src/images/icon-moon.svg";
    });
  }
}

class List {
  _tasks = [];
  _filter = filterList.querySelector(".current").textContent.toLowerCase();
  _localTasks = [];

  constructor() {
    this._renderList();
  }

  _clear() {
    todoList.innerHTML = "";
  }

  _addNew(task, fromLocal = false) {
    let content, checked, id;
    if (!fromLocal) {
      content = contentDOM.value;
      checked = checkedDOM.checked;
      id = Date.now() + "";

      contentDOM.value = "";
      checkedDOM.checked = false;

      if (content === "") return;
    }
    if (fromLocal) {
      content = task.content;
      checked = task.checked;
      id = task.id;
    }
    const markup = `
          <div class="task ${checked ? "completed-task" : ""}" id="${id}">
            <input type="checkbox" ${checked ? "checked" : ""}>
            <p class="content">${content}</p>
            <img  class="remove" src="src/images/icon-cross.svg" alt="">

          </div>
    `;

    todoList.insertAdjacentHTML("afterbegin", markup);
    this._updateTasksArray();
    this._renderList();
  }

  _removeTask(id) {
    let index;
    this._tasks.forEach((task, i) => (task.id === id ? (index = i) : ""));
    this._tasks.splice(index, 1);
    this._renderList();
  }

  _renderList() {
    let tasksNumper = 0;
    this._clear();
    this._tasks.forEach((task) => {
      const completed = task.classList.contains("completed-task");

      if (
        this._filter === "all" ||
        (this._filter === "active" && !completed) ||
        (this._filter === "completed" && completed)
      ) {
        tasksNumper++;
        todoList.insertAdjacentElement("beforeend", task);
      }
    });
    itemsLeft.textContent = tasksNumper;
  }

  _updateTasksArray() {
    this._tasks = [];
    const tasksNodes = todoList.querySelectorAll(".task");
    tasksNodes.forEach((task) => this._tasks.push(task));
  }

  addHandlerNewTask(handler) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._addNew();
      // update local storage
      this._updateLocal();
      handler(this._localTasks);
    });
  }

  addHandlerMarkComplete(handler) {
    todoList.addEventListener("click", (e) => {
      const target = e.target.closest(`input[type="checkbox"]`);
      // guard class
      if (!target) return;
      target.closest(".task").classList.toggle("completed-task");
      this._renderList();
      // update local storage
      this._updateLocal();
      handler(this._localTasks);
    });
  }

  addHandlerRemoveTask(handler) {
    todoList.addEventListener("click", (e) => {
      const task = e.target.closest(".task");
      const remove = e.target.closest(".remove");

      // guard class
      if (!remove) return;
      this._removeTask(task.id);
      // update local storage
      this._updateLocal();
      handler(this._localTasks);
    });
  }

  addHandlerFilter() {
    filterList.addEventListener("click", (e) => {
      const target = e.target.closest("li");
      // guard class
      if (!target) return;
      // reset current filter
      filterList
        .querySelectorAll("li")
        .forEach((filter) => filter.classList.remove("current"));
      target.classList.add("current");
      this._filter = target.textContent.toLowerCase();
      this._renderList();
    });
  }

  addHandlerClearComplete(handler) {
    clearBtn.addEventListener("click", () => {
      const removed = this._tasks.filter((task) =>
        task.classList.contains("completed-task")
      );
      removed.reverse().forEach((task) => this._removeTask(task.id));
      // update local storage
      this._updateLocal();
      handler(this._localTasks);
    });
  }

  _updateLocal() {
    this._localTasks = [];
    this._tasks.forEach((task) => {
      const id = task.id;
      const content = task.querySelector(".content").textContent;
      const checked = task.classList.contains("completed-task");

      const taskObject = {
        id,
        content,
        checked,
      };
      this._localTasks.push(taskObject);
    });
  }

  restoreLocal(handler) {
    window.addEventListener("load", () => {
      this._localTasks = handler();
      // reversed to keep the original order
      this._localTasks.reverse().forEach((task) => this._addNew(task, true));
    });
  }
}

export const todo = new List();
export const view = new View();
