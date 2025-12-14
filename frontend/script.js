// Получаем все кнопки источников
const actionButtons = document.querySelectorAll('.action-btn');
const showDataBtn = document.querySelector('.show-data-btn');
const response = document.querySelector('.response');

let selectedSource = null;

// Выбор источника данных
actionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Снимаем active со всех кнопок
    actionButtons.forEach(b => b.classList.remove('active'));

    // Добавляем active к текущей
    btn.classList.add('active');

    // Определяем источник по id
    selectedSource = btn.id;

    // Очистка контейнера до нажатия "Показать данные"
    response.innerHTML = `<div class="empty">Нажмите "Показать данные" для загрузки данных</div>`;
  });
});

// Загрузка данных при нажатии кнопки
showDataBtn.addEventListener('click', async () => {
  if (!selectedSource) {
    response.innerHTML = `<div class="empty">Сначала выберите источник данных</div>`;
    return;
  }

  response.innerHTML = `<div class="loading">Загрузка...</div>`;

  try {
    let apiEndpoint = '';

    switch (selectedSource) {
      case 'api-1':
        apiEndpoint = '/api/1'; // можно обработать на бэке отдельно для первой реплики
        break;
      case 'api-2':
        apiEndpoint = '/api/2'; // обработка второй реплики
        break;
      case 'api-combined':
        apiEndpoint = '/api/objects'; // балансировка через upstream
        break;
      default:
        throw new Error('Неизвестный источник данных');
    }

    const res = await fetch(apiEndpoint);
    if (!res.ok) throw new Error('Ошибка сети: ' + res.status);

    const data = await res.json();
    response.innerHTML = ''; // очистка контейнера

    if (!data.length) {
      response.innerHTML = '<div class="empty">Нет данных</div>';
    } else {
      const ul = document.createElement('ul');
      data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `ID: ${item.id}, Name: ${item.name}`;
        li.classList.add('data-item'); // стиль из CSS
        ul.appendChild(li);
      });
      response.appendChild(ul);
    }
  } catch (error) {
    console.error('Ошибка:', error);
    response.innerHTML = '<div class="empty">Ошибка загрузки данных</div>';
  }
});
