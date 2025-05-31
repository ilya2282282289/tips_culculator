// script.js
document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------
  // 1) Работа калькулятора и toasts
  // -----------------------------------
  const caclTipsEl    = document.querySelector('#calc-tips');
  const sumEl         = document.querySelector('.total');
  const teaEl         = document.querySelector('.tea');
  const sum1El        = document.querySelector('.total1');
  const notifications = document.querySelector('.notifications');

  // Десятичное округление (Math.round10)
  function decimalAdjust(type, value, exp) {
    if (typeof exp === "undefined" || +exp === 0) return Math[type](value);
    value = +value; exp = +exp;
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) return NaN;
    let parts = value.toString().split("e");
    value = Math[type](+(parts[0] + "e" + (parts[1] ? +parts[1] - exp : -exp)));
    parts = value.toString().split("e");
    return +(parts[0] + "e" + (parts[1] ? +parts[1] + exp : exp));
  }
  if (!Math.round10) Math.round10 = (v, e) => decimalAdjust("round", v, e);

  const toastDetails = {
    timer:   5000,
    success: { icon: "fa-circle-check",  text: "Вы успешно посчитали чаевые." },
    error:   { icon: "fa-circle-xmark", text: "Вы сбросили значения." }
  };
  function removeToast(toast) {
    toast.classList.add("hide");
    clearTimeout(toast.timeoutId);
    setTimeout(() => toast.remove(), 500);
  }
  window.removeToast = removeToast;
  function createToast(id) {
    const { icon, text } = toastDetails[id];
    const li = document.createElement('li');
    li.className = `toast ${id}`;
    li.innerHTML = `
      <div class="column">
        <i class="fa-solid ${icon}"></i>
        <span>${text}</span>
      </div>
      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>
    `;
    notifications.appendChild(li);
    li.timeoutId = setTimeout(() => removeToast(li), toastDetails.timer);
  }

  // Обработка формы
  caclTipsEl.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(caclTipsEl));
    const per   = data['total-bill'] / data['qty-people'];
    const tip   = per * data['select'];
    const total = per + tip;

    teaEl.textContent  = Math.round10(tip, -1);
    sumEl.textContent  = Math.round10(total, -1);
    sum1El.textContent = Math.round10(total * data['qty-people'], -1);

    const calcData = {
      totalBill:      data['total-bill'],
      qtyPeople:      data['qty-people'],
      qualityService: data['select'],
      tip:             Math.round10(tip, -1),
      per:             Math.round10(total, -1),
      total:           Math.round10(total * data['qty-people'], -1)
    };
    localStorage.setItem('calcData', JSON.stringify(calcData));
    createToast('success');
  });

  caclTipsEl.addEventListener('reset', () => {
    teaEl.textContent = sumEl.textContent = sum1El.textContent = 0;
    localStorage.removeItem('calcData');
    createToast('error');
  });

  // -----------------------------------
  // 2) Flip‑card
  // -----------------------------------
  const flipCard = document.querySelector('.flip-card');
  const purpleBox = document.querySelector('.calc-tips-box');
  const backSide = document.querySelector('.flip-card-back');
  purpleBox.addEventListener('click', e => {
    if (e.target === purpleBox) flipCard.classList.add('flipped');
  });
  backSide.addEventListener('click', () => {
    flipCard.classList.remove('flipped');
  });

  // -----------------------------------
  // 3) Восстановление данных и языка
  // -----------------------------------
  const savedCalc = JSON.parse(localStorage.getItem('calcData'));
  if (savedCalc) {
    teaEl.textContent  = savedCalc.tip;
    sumEl.textContent  = savedCalc.per;
    sum1El.textContent = savedCalc.total;
    caclTipsEl.querySelector('#total-bill').value      = savedCalc.totalBill;
    caclTipsEl.querySelector('#qty-people').value      = savedCalc.qtyPeople;
    caclTipsEl.querySelector('#quality-service').value = savedCalc.qualityService;
  }

  const btnEng = document.querySelector('#eng');
  const btnRus = document.querySelector('#rus');
  function setEnglish() {
    document.querySelector("#name-culc").textContent = "Tip Calculator";
    document.querySelector("#sum-chet").textContent = "Invoice amount";
    document.querySelector("#quality-service-text").textContent = "Quality of service";
    document.querySelector("#quality-gread").textContent = "Great (20%)";
    document.querySelector("#quality-good").textContent = "Good (10%)";
    document.querySelector("#quality-normal").textContent = "Normal (5%)";
    document.querySelector("#qty-people-text").textContent = "Number of people";
    document.querySelector("#submit-text").textContent = "Calculate";
    document.querySelector("#reset-text").textContent = "Reset";
    document.querySelector("#tips-text").textContent = "Tips: ";
    document.querySelector("#total-text1").textContent = "Total: ";
    document.querySelector("#total-text2").textContent = "Subtotal: ";
    document.querySelector("#ench-one-text1").textContent = " (each)";
    document.querySelector("#ench-one-text2").textContent = " (each)";
    document.querySelector("#flip-card-back-h2").textContent = "Thank you for visiting our restaurant";
    document.querySelector("#flip-card-back-p").textContent = "Come back again";
    localStorage.setItem('lang', 'en');
  }
  function setRussian() {
    document.querySelector("#name-culc").textContent = "Калькулятор чаевых";
    document.querySelector("#sum-chet").textContent = "Сумма по счету";
    document.querySelector("#quality-service-text").textContent = "Качество обслуживания";
    document.querySelector("#quality-gread").textContent = "Отличное (20%)";
    document.querySelector("#quality-good").textContent = "Хорошее (10%)";
    document.querySelector("#quality-normal").textContent = "Нормальное (5%)";
    document.querySelector("#qty-people-text").textContent = "Количество человек";
    document.querySelector("#submit-text").textContent = "Посчитать";
    document.querySelector("#reset-text").textContent = "Сбросить";
    document.querySelector("#tips-text").textContent = "Чаевые: ";
    document.querySelector("#total-text1").textContent = "Всего: ";
    document.querySelector("#total-text2").textContent = "Итого: ";
    document.querySelector("#ench-one-text1").textContent = " (с каждого)";
    document.querySelector("#ench-one-text2").textContent = " (с каждого)";
    document.querySelector("#flip-card-back-h2").textContent = "Спасибо что посетили наш ресторан";
    document.querySelector("#flip-card-back-p").textContent = "Приходите ещё";
    localStorage.setItem('lang', 'ru');
  }
  btnEng.addEventListener('click', setEnglish);
  btnRus.addEventListener('click', setRussian);
  const savedLang = localStorage.getItem('lang');
  if (savedLang === 'en') setEnglish();
  else if (savedLang === 'ru') setRussian();

  // -----------------------------------
  // 4) Плавающие иконки с переключателем
  // -----------------------------------
  const ICONS    = [
    'sprite/culc1.png',
    'sprite/culc2.png',
    'sprite/culc3.png',
    'sprite/culc4.png'
  ];
  const COUNT    = 25;
  const IW       = 50;
  const MARGIN   = 5;
  const AREA     = document.getElementById('float-area');
  let items      = [], W, H, calcRect, animId = null;

  const rand = (min, max) => Math.random() * (max - min) + min;

  function isOutsideCalc(x, y) {
    return (
      x + IW < calcRect.left  - MARGIN ||
      x     > calcRect.right + MARGIN ||
      y + IW < calcRect.top   - MARGIN ||
      y     > calcRect.bottom+ MARGIN
    );
  }

  function animate() {
    for (let obj of items) {
      obj.x += obj.vx;
      obj.y += obj.vy;
      if (obj.x < MARGIN || obj.x > W - IW - MARGIN) obj.vx *= -1;
      if (obj.y < MARGIN || obj.y > H - IW - MARGIN) obj.vy *= -1;
      if (!isOutsideCalc(obj.x, obj.y)) {
        obj.vx *= -1; obj.vy *= -1;
      }
      obj.el.style.transform = `translate(${obj.x}px,${obj.y}px)`;
    }
    animId = requestAnimationFrame(animate);
  }
  function startFloating() {
    if (!animId) animId = requestAnimationFrame(animate);
  }
  function stopFloating() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
  }
  function clearFloating() {
    stopFloating();
    AREA.innerHTML = '';
    items = [];
  }

  function initFloating() {
    localStorage.setItem('animEnabled', 'true');
    W = window.innerWidth;
    H = window.innerHeight;
    calcRect = purpleBox.getBoundingClientRect();
    AREA.innerHTML = '';
    items = [];

    for (let i = 0; i < COUNT; i++) {
      const img = document.createElement('img');
      img.className = 'float-item';
      img.src = ICONS[i % ICONS.length];
      AREA.appendChild(img);

      let x, y;
      do {
        x = rand(MARGIN, W - IW - MARGIN);
        y = rand(MARGIN, H - IW - MARGIN);
      } while (!isOutsideCalc(x, y));

      const speed = rand(0.3, 1.2);
      const angle = rand(0, Math.PI * 2);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      items.push({ el: img, x, y, vx, vy });
      img.style.transform = `translate(${x}px,${y}px)`;
    }
    startFloating();
  }

  // Ждём конца авто‑масштабирования
  purpleBox.addEventListener('animationend', e => {
    if (e.animationName === 'autoScale') {
      const toggle = document.getElementById('toggle-animation');
      // если включено — инициализируем, иначе очищаем
      if (toggle.checked) initFloating();
      else clearFloating();
    }
  });

  // Чекбокс вкл/выкл анимации
  const toggle = document.getElementById('toggle-animation');
  const savedFlag = localStorage.getItem('animEnabled') === 'true';
  toggle.checked = savedFlag;
  // при загрузке, если css-анимация уже закончилась, запустим/почистим
  if (purpleBox.getAnimations().some(a => a.playState === 'finished')) {
    savedFlag ? initFloating() : clearFloating();
  }
  toggle.addEventListener('change', () => {
    if (toggle.checked) initFloating();
    else {
      localStorage.setItem('animEnabled', 'false');
      clearFloating();
    }
  });

});


const themeToggleBth = document.getElementById("theme-toggle");
let isDark = false;

function updateTheme() {
  document.body.classList.toggle("dark-theme", isDark);
  document.body.classList.toggle("light-theme", !isDark);
  document.querySelector(".calc-tips-box").classList.toggle("dark-theme", isDark);
  document.querySelector(".calc-tips-box").classList.toggle("light-theme", !isDark);
  themeToggleBth.textContent = isDark ? "Светлая" : "Темная"
}


themeToggleBth.addEventListener("click", () => {
  isDark = !isDark
  updateTheme();
})