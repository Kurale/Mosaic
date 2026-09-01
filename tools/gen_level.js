/**
 * Генератор уровня раскраски из пиксель-арт SVG (rect-сетки 1×1 или path-клетки).
 * Клетки одного цвета склеиваются в связные области — один сегмент.
 * Пример запуска из папки Mosaic:
 *   node tools/gen_level.js assets/babochka.svg assets/_babochka.json
 */
'use strict';
const fs = require('fs');

const [,, srcPath, outPath] = process.argv;
const src = fs.readFileSync(srcPath, 'utf8');
const viewBox = src.match(/viewBox="[^"]+"/)[0];

// Яркость цвета 0..1: почти чёрное (глаза/контуры) и почти белое (блики)
// считаем справочным слоем и не раскрашиваем.
const lum = (hex) => {
  const n = hex.replace('#', '');
  const v = n.length === 3
    ? n.split('').map((c) => parseInt(c + c, 16))
    : [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  return (0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2]) / 255;
};
const isDecor = (fill) =>
  !fill || fill === 'none' || lum(fill) < 0.16 || lum(fill) > 0.94;

// --- 1. Сбор пикселей: rect или path, с центром и размером ---
const cells = [];
const collect = (tag, fill, x, y, w, h) => {
  if (isDecor(fill.toLowerCase())) return;
  cells.push({ tag, cx: x + w / 2, cy: y + h / 2, w, h });
};
const rectRe = /<rect[^>]*>/g;
let m;
while ((m = rectRe.exec(src))) {
  const t = m[0];
  const a = (name) => parseFloat((t.match(new RegExp(name + '="([^"]*)"')) || [])[1]);
  collect(t, (t.match(/fill="([^"]*)"/) || [])[1], a('x'), a('y'), a('width'), a('height'));
}
const pathRe = /<path[^>]*>/g;
while ((m = pathRe.exec(src))) {
  const t = m[0];
  const fill = (t.match(/fill="([^"]*)"/) || [])[1];
  if (!t.match(/ d=/)) continue;
  const nums = (t.match(/ d="([^"]*)"/)[1].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]); maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]); maxY = Math.max(maxY, nums[i + 1]);
  }
  collect(t, fill, minX, minY, maxX - minX, maxY - minY);
}

// Шаг сетки = размер самой частой клетки (1 у rect-сеток, 20 у Цыпы)
const sizes = new Map();
cells.forEach((c) => {
  const k = Math.round(Math.max(c.w, c.h) * 10) / 10;
  sizes.set(k, (sizes.get(k) || 0) + 1);
});
const unit = [...sizes.entries()].sort((a, b) => b[1] - a[1])[0][0];

// --- 2. Склейка клеток одного цвета в связные области (union-find) ---
const parent = cells.map((_, i) => i);
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
const union = (a, b) => { parent[find(a)] = find(b); };
const near = (a, b) => {
  const dx = Math.abs(a.cx - b.cx), dy = Math.abs(a.cy - b.cy);
  // Соседство по 8 направлениям (включая диагонали — важно для
  // «шахматного» дизеринга в пиксель-арте), в пределах одного шага сетки
  return dx <= unit && dy <= unit && dx + dy > 0 && dx < unit * 1.5 && dy < unit * 1.5;
};

// цвет храним в tag, для сравнения извлекаем fill
const fillOf = (tag) => (tag.match(/fill="([^"]*)"/) || [])[1].toLowerCase();
for (let i = 0; i < cells.length; i++)
  for (let j = i + 1; j < cells.length; j++)
    if (fillOf(cells[i].tag) === fillOf(cells[j].tag) && near(cells[i], cells[j]))
      union(i, j);

// --- 3. Сегменты = компоненты связности ---
const comps = new Map();
cells.forEach((c, i) => {
  const root = find(i);
  if (!comps.has(root)) comps.set(root, []);
  comps.get(root).push(c);
});

// --- 4. Палитра: ответы/примеры по возрастанию ---
const ANSWERS = [
  ['1 + 2', 3], ['2 + 3', 5], ['10 - 4', 6], ['3 + 4', 7], ['4 + 5', 9],
  ['6 + 4', 10], ['8 + 4', 12], ['7 + 7', 14], ['9 + 7', 16], ['10 + 8', 18],
  ['9 + 9', 18], ['20 - 2', 18], ['11 + 8', 19], ['10 + 10', 20], ['20 - 0', 20],
];
const byColor = new Map();
let colorIdx = 0;

const mapping = {};
const labelPositions = {};
const parts = [];
let seg = 0;
for (const list of comps.values()) {
  const color = fillOf(list[0].tag);
  if (!byColor.has(color)) {
    const [expression, answer] = ANSWERS[colorIdx++] || [`5 + ${colorIdx}`, 5 + colorIdx];
    byColor.set(color, { color: color.toUpperCase(), answer, expression });
  }
  const id = 'seg_' + (++seg);
  mapping[id] = color.toUpperCase();
  // Число — в центроид сегмента (центр «средней» клетки)
  const cx = list.reduce((s, c) => s + c.cx, 0) / list.length;
  const cy = list.reduce((s, c) => s + c.cy, 0) / list.length;
  labelPositions[id] = [
    Math.round(cx / unit) * unit + unit / 2,
    Math.round(cy / unit) * unit + unit / 2,
  ];
  for (const c of list) {
    parts.push(c.tag.replace(/fill="[^"]*"/, '').replace(/<(rect|path)/, `<$1 id="${id}"`));
  }
}

const svg = `<svg ${viewBox} xmlns="http://www.w3.org/2000/svg">\n${parts.join('\n')}\n</svg>`;
fs.writeFileSync(outPath, JSON.stringify({
  segments: seg,
  unit, // шаг пиксельной сетки — для подгонки размера чисел
  palette: [...byColor.values()],
  colorMapping: mapping,
  labelPositions,
  svg,
}, null, 1));
console.log(`${srcPath}: cells=${cells.length}, unit=${unit}, segments=${seg}, colors=${colorIdx}`);
