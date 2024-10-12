import { view, todo } from "./view.js";
import * as model from "./model.js";
////////////////////////////////////////////////
const updateLocalStorage = function (tasksList) {
  model.storeLocal(tasksList);
};
const restoreLocalStorage = function () {
  return model.restoreLocal();
};

////////////////////////////////////////////////
const init = function () {
  todo.restoreLocal(model.restoreLocal);

  view.addHandlerTheme();

  todo.addHandlerNewTask(updateLocalStorage);
  todo.addHandlerRemoveTask(updateLocalStorage);
  todo.addHandlerMarkComplete(updateLocalStorage);
  todo.addHandlerClearComplete(updateLocalStorage);
  todo.addHandlerFilter();
};

init();
