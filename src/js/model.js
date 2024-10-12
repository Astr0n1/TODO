export const storeLocal = function (taskList) {
  localStorage.setItem("task-list", JSON.stringify(taskList));
};

export const restoreLocal = function () {
  const items = JSON.parse(localStorage.getItem("task-list"));
  if (!items) return;
  return items;
};
