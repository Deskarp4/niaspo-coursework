const actionButtons = document.querySelectorAll('.action-btn');
const showDataBtn = document.querySelector('.show-data-btn');
const response = document.querySelector('.response');

let activeMode = null;

actionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    actionButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeMode = btn.id;

    response.innerHTML =
      '<div class="empty">Нажмите «Показать данные»</div>';
  });
});

showDataBtn.addEventListener('click', async () => {
  if (!activeMode) {
    response.innerHTML =
      '<div class="empty">Сначала выберите режим</div>';
    return;
  }

  if (activeMode === 'combined') {
    await combinedRequest();
  }

  if (activeMode === 'load') {
    await loadSimulation();
  }
});

async function combinedRequest() {
  response.innerHTML = '<div class="loading">Загрузка...</div>';

  try {
    const res = await fetch('/api/objects');
    if (!res.ok) throw new Error();

    const result = await res.json();

    response.innerHTML = `
      <div class="empty">
        Ответил контейнер: <b>${result.container}</b>
      </div>
    `;

    const ul = document.createElement('ul');

    result.data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'data-item';
      li.textContent = `ID: ${item.id}, Name: ${item.name}`;
      ul.appendChild(li);
    });

    response.appendChild(ul);
  } catch {
    response.innerHTML = '<div class="empty">Ошибка загрузки</div>';
  }
}

async function loadSimulation() {
  response.innerHTML = '<div class="loading">Отправка 10 запросов...</div>';

  const ul = document.createElement('ul');
  response.innerHTML = '';
  response.appendChild(ul);

  for (let i = 1; i <= 10; i++) {
    try {
      const res = await fetch('/api/objects');
      const result = await res.json();

      const li = document.createElement('li');
      li.className = 'data-item';
      li.textContent = `Запрос ${i} → ${result.container}`;
      ul.appendChild(li);

      await new Promise(r => setTimeout(r, 200));
    } catch {
      const li = document.createElement('li');
      li.className = 'data-item';
      li.textContent = `Запрос ${i} → ошибка`;
      ul.appendChild(li);
    }
  }
}
