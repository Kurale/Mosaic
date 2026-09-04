/* =====================================================================
   «Интерактивная математическая раскраска»
   Логика: fetch(data.json) → при ошибке встроенные fallback-данные →
   рендер меню → выбор уровня → загрузка SVG → палитра → игра → победа.
   ===================================================================== */

'use strict';

/* ---------------------------------------------------------------------
   Fallback-данные: используются, если data.json или SVG-файлы недоступны
   (например, страница открыта как file:// без Live Server).
   --------------------------------------------------------------------- */
/* Fallback-данные: уровень «Цыпа» целиком встроен в JS,
   чтобы приложение работало даже без data.json и SVG-файлов */
const FALLBACK_SVGS = {
  level5: `<svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg"><path id="seg_1" d="M100 0H80V20H100V0Z" /><path id="seg_1" d="M120 0H100V20H120V0Z" /><path id="seg_1" d="M160 0H140V20H160V0Z" /><path id="seg_1" d="M180 0H160V20H180V0Z" /><path id="seg_1" d="M220 0H200V20H220V0Z" /><path id="seg_1" d="M240 0H220V20H240V0Z" /><path id="seg_1" d="M120 20H100V40H120V20Z" /><path id="seg_1" d="M140 20H120V40H140V20Z" /><path id="seg_1" d="M160 20H140V40H160V20Z" /><path id="seg_1" d="M180 20H160V40H180V20Z" /><path id="seg_1" d="M200 20H180V40H200V20Z" /><path id="seg_1" d="M220 20H200V40H220V20Z" /><path id="seg_1" d="M140 40H120V60H140V40Z" /><path id="seg_1" d="M160 40H140V60H160V40Z" /><path id="seg_1" d="M180 40H160V60H180V40Z" /><path id="seg_1" d="M200 40H180V60H200V40Z" /><path id="seg_2" d="M300 100H280V120H300V100Z" /><path id="seg_2" d="M320 100H300V120H320V100Z" /><path id="seg_3" d="M120 120H100V140H120V120Z" /><path id="seg_3" d="M220 120H200V140H220V120Z" /><path id="seg_3" d="M120 140H100V160H120V140Z" /><path id="seg_3" d="M140 140H120V160H140V140Z" /><path id="seg_3" d="M160 140H140V160H160V140Z" /><path id="seg_3" d="M180 140H160V160H180V140Z" /><path id="seg_3" d="M200 140H180V160H200V140Z" /><path id="seg_3" d="M220 140H200V160H220V140Z" /><path id="seg_3" d="M120 160H100V180H120V160Z" /><path id="seg_3" d="M140 160H120V180H140V160Z" /><path id="seg_3" d="M160 160H140V180H160V160Z" /><path id="seg_3" d="M180 160H160V180H180V160Z" /><path id="seg_3" d="M200 160H180V180H200V160Z" /><path id="seg_3" d="M220 160H200V180H220V160Z" /><path id="seg_4" d="M120 60H100V80H120V60Z" /><path id="seg_4" d="M140 60H120V80H140V60Z" /><path id="seg_4" d="M160 60H140V80H160V60Z" /><path id="seg_4" d="M180 60H160V80H180V60Z" /><path id="seg_4" d="M200 60H180V80H200V60Z" /><path id="seg_4" d="M220 60H200V80H220V60Z" /><path id="seg_4" d="M120 80H100V100H120V80Z" /><path id="seg_4" d="M160 80H140V100H160V80Z" /><path id="seg_4" d="M180 80H160V100H180V80Z" /><path id="seg_4" d="M220 80H200V100H220V80Z" /><path id="seg_4" d="M120 100H100V120H120V100Z" /><path id="seg_4" d="M160 100H140V120H160V100Z" /><path id="seg_4" d="M180 100H160V120H180V100Z" /><path id="seg_4" d="M220 100H200V120H220V100Z" /><path id="seg_5" d="M100 120H80V140H100V120Z" /><path id="seg_5" d="M100 140H80V160H100V140Z" /><path id="seg_5" d="M100 160H80V180H100V160Z" /><path id="seg_6" d="M140 120H120V140H140V120Z" /><path id="seg_7" d="M200 120H180V140H200V120Z" /><path id="seg_8" d="M240 120H220V140H240V120Z" /><path id="seg_8" d="M240 140H220V160H240V140Z" /><path id="seg_8" d="M240 160H220V180H240V160Z" /><path id="seg_9" d="M120 180H100V200H120V180Z" /><path id="seg_9" d="M140 180H120V200H140V180Z" /><path id="seg_9" d="M160 180H140V200H160V180Z" /><path id="seg_9" d="M180 180H160V200H180V180Z" /><path id="seg_9" d="M200 180H180V200H200V180Z" /><path id="seg_9" d="M220 180H200V200H220V180Z" /><path id="seg_10" d="M20 80H0V100H20V80Z" /><path id="seg_10" d="M40 80H20V100H40V80Z" /><path id="seg_10" d="M20 100H0V120H20V100Z" /><path id="seg_10" d="M40 100H20V120H40V100Z" /><path id="seg_11" d="M60 120H40V140H60V120Z" /><path id="seg_12" d="M80 140H60V160H80V140Z" /><path id="seg_13" d="M160 120H140V140H160V120Z" /><path id="seg_13" d="M180 120H160V140H180V120Z" /><path id="seg_14" d="M140 200H120V220H140V200Z" /><path id="seg_15" d="M200 200H180V220H200V200Z" /><path id="seg_16" d="M280 120H260V140H280V120Z" /><path id="seg_16" d="M300 120H280V140H300V120Z" /><path id="seg_16" d="M320 120H300V140H320V120Z" /><path id="seg_16" d="M340 120H320V140H340V120Z" /><path id="seg_17" d="M260 140H240V160H260V140Z" /></svg>`,
};

const FALLBACK_DATA = [
  {
    "id": "level5",
    "title": "Цыпа",
    "emoji": "🐥",
    "svgUrl": "assets/Tsipa_processed.svg",
    "palette": [
      {
        "color": "#FDF2EC",
        "answer": 6,
        "expression": "2 × 3"
      },
      {
        "color": "#FFF25E",
        "answer": 8,
        "expression": "2 × 4"
      },
      {
        "color": "#BC8952",
        "answer": 10,
        "expression": "2 × 5"
      },
      {
        "color": "#FF8D4C",
        "answer": 12,
        "expression": "3 × 4"
      },
      {
        "color": "#888387",
        "answer": 14,
        "expression": "2 × 7"
      }
    ],
    "colorMapping": {
      "seg_1": "#FDF2EC",
      "seg_2": "#FDF2EC",
      "seg_3": "#FDF2EC",
      "seg_4": "#FFF25E",
      "seg_5": "#FFF25E",
      "seg_6": "#FFF25E",
      "seg_7": "#FFF25E",
      "seg_8": "#FFF25E",
      "seg_9": "#FFF25E",
      "seg_10": "#BC8952",
      "seg_11": "#BC8952",
      "seg_12": "#BC8952",
      "seg_13": "#FF8D4C",
      "seg_14": "#FF8D4C",
      "seg_15": "#FF8D4C",
      "seg_16": "#888387",
      "seg_17": "#888387"
    },
    "labelPositions": {
      "seg_1": [
        160,
        28
      ],
      "seg_2": [
        300,
        110
      ],
      "seg_3": [
        160,
        156
      ],
      "seg_4": [
        160,
        87
      ],
      "seg_5": [
        90,
        150
      ],
      "seg_6": [
        130,
        130
      ],
      "seg_7": [
        190,
        130
      ],
      "seg_8": [
        230,
        150
      ],
      "seg_9": [
        160,
        190
      ],
      "seg_10": [
        20,
        100
      ],
      "seg_11": [
        50,
        130
      ],
      "seg_12": [
        70,
        150
      ],
      "seg_13": [
        160,
        130
      ],
      "seg_14": [
        130,
        210
      ],
      "seg_15": [
        190,
        210
      ],
      "seg_16": [
        300,
        130
      ],
      "seg_17": [
        250,
        150
      ]
    },
    "unit": 20
  }
];


/* ---------------------------------------------------------------------
   Простой генератор звуков через Web Audio API (без внешних файлов).
   --------------------------------------------------------------------- */
const Sound = {
  ctx: null,
  init() { this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)(); },

  // Короткий восходящий «звук победы» из двух нот
  playWin() {
    try {
      this.init();
      [[523.25, 0], [783.99, 0.12]].forEach(([freq, delay]) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + delay + 0.35);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + 0.4);
      });
    } catch (e) { /* звук не критичен */ }
  },

  // Низкий короткий сигнал ошибки
  playError() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 160;
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) { /* ... */ }
  },
};

/* ---------------------------------------------------------------------
   Главный класс приложения
   --------------------------------------------------------------------- */
class ColoringApp {
  constructor() {
    // Состояние игры
    this.levels = [];          // массив уровней из JSON/fallback
    this.currentLevelIndex = -1;
    this.selectedColor = null; // выбранный в палитре цвет
    this.coloredCount = 0;     // сколько сегментов закрашено верно
    this.totalPaths = 0;       // всего закрашиваемых сегментов

    // DOM-ссылки
    this.$ = (sel) => document.querySelector(sel);
    this.menuScreen = this.$('#menu-screen');
    this.gameScreen = this.$('#game-screen');
    this.menuGrid = this.$('#menu-grid');
    this.svgContainer = this.$('#svg-container');
    this.paletteEl = this.$('#palette');
    this.levelTitle = this.$('#level-title');
    this.progressFill = this.$('#progress-fill');
    this.progressText = this.$('#progress-text');
    this.winModal = this.$('#win-modal');

    this.bindEvents();
  }

  /* ---------- Запуск приложения ---------- */
  async init() {
    // Пытаемся загрузить уровни из внешнего data.json
    try {
      const res = await fetch('data.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.levels = await res.json();
      if (!Array.isArray(this.levels) || !this.levels.length) throw new Error('Пустой JSON');
      console.info('Уровни загружены из data.json');
    } catch (err) {
      // Fallback: работаем на встроенных данных
      console.warn('data.json недоступен, использую встроенные данные:', err.message);
      this.levels = FALLBACK_DATA;
    }
    this.renderMenu();
  }

  /* ---------- Экран «Главное меню» ---------- */
  renderMenu() {
    this.menuGrid.innerHTML = '';
    this.levels.forEach((level, index) => {
      const card = document.createElement('button');
      card.className = 'level-card';
      // Миниатюра карточки: цветной образец (исходник без «_processed») →
      // встроенный шаблон → эмодзи
      const sampleUrl = level.svgUrl && level.svgUrl.includes('_processed')
        ? level.svgUrl.replace('_processed', '') : level.svgUrl;
      const avatar = sampleUrl
        ? `<img class="card-avatar" src="${sampleUrl}" alt="${level.title}">`
        : `<div class="card-avatar">${FALLBACK_SVGS[level.id] || '🎨'}</div>`;
      card.innerHTML = `
        ${avatar}
        <h3>${level.emoji || ''} ${level.title}</h3>`;
      card.addEventListener('click', () => this.startLevel(index));
      this.menuGrid.appendChild(card);
    });
  }

  /* ---------- Запуск уровня ---------- */
  async startLevel(index) {
    this.currentLevelIndex = index;
    const level = this.levels[index];

    // Сброс состояния уровня
    this.selectedColor = null;
    this.coloredCount = 0;

    this.levelTitle.textContent = `${level.emoji || ''} ${level.title}`;
    this.menuScreen.classList.remove('active');
    this.gameScreen.classList.add('active');

    // Загружаем SVG: сначала пробуем внешний файл, иначе fallback-шаблон
    let svgText = null;
    if (level.svgUrl) {
      try {
        const res = await fetch(level.svgUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        svgText = await res.text();
      } catch (err) {
        console.warn(`SVG ${level.svgUrl} недоступен, использую встроенный:`, err.message);
      }
    }
    if (!svgText) svgText = FALLBACK_SVGS[level.id];
    // Если ни внешний файл, ни fallback недоступны — возвращаемся в меню
    if (!svgText) { this.showMenu(); return; }
    this.renderSvg(svgText);
    this.renderPalette(level);
    this.updateProgress();
  }

  /* Вставка SVG в DOM и подготовка всех раскрашиваемых сегментов.
     Сегмент может состоять из НЕСКОЛЬКИХ контуров с одинаковым id
     (например, склеенные клетки пиксель-арта) — они красятся вместе. */
  renderSvg(svgText) {
    this.svgContainer.innerHTML = svgText;
    const svg = this.svgContainer.querySelector('svg');
    if (svg) svg.removeAttribute('width');

    const level = this.levels[this.currentLevelIndex];
    const mapping = level.colorMapping;
    const shapes = this.svgContainer.querySelectorAll('path, rect, circle, ellipse, polygon');

    // Контур сегментов — ровно 1 экранный пиксель при любом масштабе
    // (vector-effect: non-scaling-stroke), полупрозрачный (цвет в CSS)

    // Всем контурам с id из colorMapping добавляем класс .colorable
    // и собираем уникальные id (один id = один логический сегмент)
    const seen = new Set();
    shapes.forEach((shape) => {
      if (shape.id && mapping[shape.id] !== undefined) {
        shape.classList.add('colorable');
        shape.style.vectorEffect = 'non-scaling-stroke';
        shape.style.strokeWidth = 1;
        seen.add(shape.id);
      }
    });
    this.totalPaths = seen.size;

    // Слой лэйблов-ответов поверх картинки
    const labels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    labels.setAttribute('class', 'labels-layer');
    svg.appendChild(labels);

    // Кегль числа: однозначное — 0.8 клетки, двузначное (оно шире) — 0.55 клетки
    const vbW = svg.viewBox.baseVal.width || 400;
    const unit = level.unit || vbW / 16;
    const digitsOf = (n) => String(n).length;
    const fontFor = (answer) => unit * (digitsOf(answer) > 1 ? 0.55 : 0.8);
    const haloFor = (answer) => unit * (digitsOf(answer) > 1 ? 0.09 : 0.13);

    // Общий создатель метки в точке (x, y)
    const makeLabel = (id, answer, x, y) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('class', 'answer-label');
      text.setAttribute('data-for', id); // связь метки с сегментом
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('font-size', fontFor(answer));
      text.style.strokeWidth = haloFor(answer);
      text.textContent = answer;
      labels.appendChild(text);
    };

    if (level.unit) {
      /* Режим «клеточного» подписывания: число ставится в КАЖДУЮ клетку
         сегмента — числа мелкие, вписываются в клетку, не перекрывают
         соседей, и всегда видно, какого цвета должна быть клетка. */
      this.svgContainer.querySelectorAll('.colorable').forEach((shape) => {
        const paletteItem = level.palette.find(
          (p) => p.color.toLowerCase() === mapping[shape.id].toLowerCase());
        if (!paletteItem) return;
        const b = shape.getBBox();
        makeLabel(shape.id, paletteItem.answer, b.x + b.width / 2, b.y + b.height / 2);
      });
    } else {
      /* Режим «по сегменту»: одна метка в центре сегмента
         (позицию можно задать вручную через labelPositions или pos_-маркеры). */
      // Невидимые маркеры в SVG: <circle id="pos_seg_1" cx cy r="0.01" fill="none"/>
      const labelPos = {};
      svg.querySelectorAll('[id^="pos_"]').forEach((marker) => {
        labelPos[marker.id.slice(4)] = {
          x: parseFloat(marker.getAttribute('cx') || marker.getAttribute('x')),
          y: parseFloat(marker.getAttribute('cy') || marker.getAttribute('y')),
        };
      });

      seen.forEach((id) => {
        const parts = this.svgContainer.querySelectorAll(`.colorable[id="${id}"]`);
        const correctColor = mapping[id];
        const paletteItem = level.palette.find(
          (p) => p.color.toLowerCase() === correctColor.toLowerCase());
        if (!paletteItem) return;

        const manual = (level.labelPositions && level.labelPositions[id]) || labelPos[id];
        let box = null;
        if (!manual) {
          parts.forEach((p) => {
            const b = p.getBBox();
            box = box
              ? { x: Math.min(box.x, b.x), y: Math.min(box.y, b.y),
                  w: Math.max(box.x + box.width, b.x + b.width) - Math.min(box.x, b.x),
                  h: Math.max(box.y + box.height, b.y + b.height) - Math.min(box.y, b.y) }
              : { x: b.x, y: b.y, w: b.width, h: b.height };
          });
        }
        const cx = manual ? manual[0] ?? manual.x : box.x + box.w / 2;
        const cy = manual ? manual[1] ?? manual.y : box.y + box.h / 2;
        makeLabel(id, paletteItem.answer, cx, cy);
      });
    }
  }

  /* ---------- Палитра ---------- */
  renderPalette(level) {
    this.paletteEl.innerHTML = '';
    level.palette.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.style.background = item.color;
      btn.textContent = item.expression; // пример внутри кнопки цвета
      btn.dataset.color = item.color;
      // Клик по цвету — он становится активным
      btn.addEventListener('click', () => {
        this.selectedColor = item.color;
        this.paletteEl.querySelectorAll('.palette-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      this.paletteEl.appendChild(btn);
    });
  }

  /* ---------- Игровые события (делегирование) ---------- */
  bindEvents() {
    // Один обработчик на весь контейнер SVG вместо обработчиков на каждый сегмент
    this.svgContainer.addEventListener('click', (e) => this.handleSvgClick(e));

    this.$('#btn-back').addEventListener('click', () => this.showMenu());
    this.$('#btn-menu').addEventListener('click', () => { this.hideModal(); this.showMenu(); });
    this.$('#btn-next').addEventListener('click', () => {
      this.hideModal();
      // Переход на следующий уровень по кругу
      this.startLevel((this.currentLevelIndex + 1) % this.levels.length);
    });
  }

  /**
   * Главная проверка: сравнение выбранного цвета с colorMapping сегмента.
   */
  handleSvgClick(e) {
    const target = e.target;
    const level = this.levels[this.currentLevelIndex];

    // Клик должен попадать в закрашиваемый сегмент с известным id
    if (!target.classList || !target.classList.contains('colorable')) return;

    // Если цвет ещё не выбран — мягко подсказываем (трясём сегмент без ошибки)
    if (!this.selectedColor) {
      this.animateWrong(target);
      return;
    }
    // Уже закрашенные сегменты заблокированы (pointer-events: none в CSS),
    // но подстрахуемся на случай переопределения стилей
    if (target.classList.contains('colored')) return;

    const correctColor = level.colorMapping[target.id];

    // Сравниваем цвета без учёта регистра HEX-кода (#FFF == #fff)
    if (this.selectedColor.toLowerCase() === correctColor.toLowerCase()) {
      /* --- Верный ответ: красим ВСЕ контуры сегмента с этим id --- */
      const group = this.svgContainer.querySelectorAll(`.colorable[id="${target.id}"]`);
      group.forEach((el) => {
        el.classList.add('colored');
        el.style.fill = this.selectedColor;
      });
      // Метки-ответы сегмента больше не нужны — плавно убираем их все
      this.svgContainer
        .querySelectorAll(`.answer-label[data-for="${target.id}"]`)
        .forEach((label) => label.classList.add('label-done'));
      Sound.playWin();
      this.coloredCount++;
      this.updateProgress();
      // Если всё закрашено — уровень пройден
      if (this.coloredCount === this.totalPaths) this.finishLevel();
    } else {
      /* --- Ошибка: трясём сегмент, заливку не меняем --- */
      this.animateWrong(target);
      Sound.playError();
    }
  }

  /* Кратковременная анимация «тряски» сегмента */
  animateWrong(el) {
    el.classList.remove('wrong');
    void el.offsetWidth; // перезапуск CSS-анимации
    el.classList.add('wrong');
    setTimeout(() => el.classList.remove('wrong'), 450);
  }

  /* ---------- Прогресс и завершение ---------- */
  updateProgress() {
    this.progressFill.style.width = this.totalPaths
      ? `${(this.coloredCount / this.totalPaths) * 100}%` : '0%';
    this.progressText.textContent = `${this.coloredCount} / ${this.totalPaths}`;
  }

  finishLevel() {
    // Небольшая пауза, чтобы анимация последней заливки успела проиграться
    setTimeout(() => this.winModal.classList.remove('hidden'), 1000);
  }

  hideModal() { this.winModal.classList.add('hidden'); }

  showMenu() {
    this.gameScreen.classList.remove('active');
    this.menuScreen.classList.add('active');
    this.hideModal();
  }
}

/* Создаём приложение после загрузки DOM */
window.addEventListener('DOMContentLoaded', () => {
  new ColoringApp().init();
});
