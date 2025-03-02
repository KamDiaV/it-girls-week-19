// Ключ для хранения данных в localStorage
const STORAGE_KEY = "taskPlannerData";

// Получаем элементы из HTML по их ID
const taskInput = document.getElementById("taskInput"); // Поле ввода задачи
const addTaskBtn = document.getElementById("addTaskBtn"); // Кнопка "Добавить задачу"
const taskList = document.getElementById("taskList"); // Список задач
const emptyMessage = document.getElementById("emptyMessage"); // Сообщение "Задачи отсутствуют"
const clearTasksBtn = document.getElementById("clearTasksBtn"); // Кнопка "Очистить список"
const taskCounter = document.getElementById("taskCounter"); // Счетчик выполненных задач
const progressBar = document.getElementById("progressBar"); // Прогресс-бар

// Массив для хранения задач изначально пустой
let tasks = [];

// Функция инициализации приложения
function init() {
  loadTasksFromStorage(); // Загружаем сохраненные задачи из localStorage
  renderTasks(); // Отрисовываем задачи на странице
}

// Загружаем задачи из localStorage
function loadTasksFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY); // Получаем данные из LocalStorage
  tasks = data ? JSON.parse(data) : []; // Если данные есть, парсим их, иначе создаем пустой массив
}

// Сохраняем задачи в localStorage
function saveTasksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); // Преобразуем массив в строку и сохраняем
}

// Обновляем интерфейс (сообщение + кнопка очистки)
function updateUI() {
  if (tasks.length === 0) {
    emptyMessage.style.display = "block"; // Показываем сообщение, если задач нет
    clearTasksBtn.disabled = true; // Отключаем кнопку "Очистить список"
  } else {
    emptyMessage.style.display = "none"; // Скрываем сообщение
    clearTasksBtn.disabled = false; // Включаем кнопку
  }
  updateProgressBar(); // Обновляем прогресс-бар
}

// Обновляем индикатор выполнения задач
function updateProgressBar() {
  const total = tasks.length; // Всего задач
  const completed = tasks.filter(task => task.completed).length; // Количество выполненных задач
  
  taskCounter.innerText = `Выполнено: ${completed} из ${total}`; // Обновляем текст счетчика
  
  const progressValue = total === 0 ? 0 : (completed / total) * 100; // Вычисляем процент выполнения
  progressBar.value = progressValue; // Устанавливаем значение прогресса
}

// Отображаем задачи на странице
function renderTasks() {
  taskList.innerHTML = ""; // Очищаем список перед обновлением, чтобы не дублировать задачи

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.style.cursor = "pointer";

    // Создаем чекбокс
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("click", (event) => {
      event.stopPropagation(); // Останавливаем всплытие, чтобы не срабатывало событие клика на весь li
      tasks[index].completed = !tasks[index].completed;
      saveTasksToStorage();
      renderTasks();
    });

    // Создаем текст задачи
    const taskText = document.createElement("span");
    taskText.textContent = task.title;

    // Позволяет кликнуть на всю задачу для удобства
    li.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasksToStorage();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskText);
    taskList.appendChild(li);
  });

  updateUI(); // Обновляем интерфейс
}

// Добавляем новую задачу
function addTask() {
  const title = taskInput.value.trim(); // Убираем пробелы по краям
  if (!title) {
    alert("Пожалуйста, введите текст задачи!"); // Выводим сообщение, если поле пустое
    return;
  }

  const newTask = {
    title: title,
    completed: false, // По умолчанию задача не выполнена
  };

  tasks.push(newTask); // Добавляем в массив
  saveTasksToStorage(); // Сохраняем в localStorage
  taskInput.value = ""; // Очищаем поле ввода
  renderTasks(); // Перерисовываем список
}

// Удаляем все задачи
function clearTasks() {
  tasks = []; // Очищаем массив
  saveTasksToStorage(); // Сохраняем пустой список в LocalStorage
  renderTasks(); // Перерисовываем интерфейс
}

// Добавляем задачу нажатием клавиши Enter
taskInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Назначаем обработчики событий на кнопки
addTaskBtn.addEventListener("click", addTask);
clearTasksBtn.addEventListener("click", clearTasks);

// Запускаем приложение
init();