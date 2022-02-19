// Import stylesheets
import './style.css';

// Write Javascript code!
// Write Javascript code!
const appDiv = document.getElementById('app');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
appDiv.appendChild(canvas);

const VIEWPORT_HEIGHT = 150;
const VIEWPORT_WIDTH = 300;

const TOWER_WIDTH = 300;
const TOWER_HEIGHT = 600;

const ASSETS = ["https://atariage.com/forums/uploads/monthly_04_2018/post-33891-0-54298600-1524899928.png"];

const images = [];

const camera = {
  x: 0,
  y: 0,
};

const entity = {
  x: 100,
  y: 0,
};

let t = 0;
let frame = 0;

// draw ground.
ctx.moveTo(0, VIEWPORT_HEIGHT);
ctx.lineTo(TOWER_WIDTH, VIEWPORT_HEIGHT);
ctx.stroke();

// draw entity
renderEntity(entity);

init();

function clear() {
  ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
}

function renderEntity(e) {
  const x = toScreenX(e);
  const y = toScreenY(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 5);
  ctx.stroke();
}

function renderEntity2(e) {
  const x = toScreenX2(e);
  const y = toScreenY(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 5);
  ctx.stroke();
}

function renderBricks() {
  if (!images[0]) return;
  let f = frame;
  let sy = 8 * frame;
  ctx.drawImage(images[0], 0, sy, 128, 8, 0, 0, 128, 8);
  f = frame + 4;
  f %= 8;
  sy = 8 * f;
  ctx.drawImage(images[0], 0, sy, 128, 8, 0, 8, 128, 8);
  f = frame;
  f %= 8;
  sy = 8 * f;
  ctx.drawImage(images[0], 0, sy, 128, 8, 0, 16, 128, 8);
  f = frame + 4;
  f %= 8;
  sy = 8 * f;
  ctx.drawImage(images[0], 0, sy, 128, 8, 0, 24, 128, 8);
}

function toScreenX(e) {
  return normalize(e.x - camera.x, 0, TOWER_WIDTH);
}

function toScreenX2(e) {
  const x = normalize(e.x - camera.x);
  const tx = x / TOWER_WIDTH;
  // tx * 2 * Math.PI 
  // is like, percentage of 360 degrees.
  const tx1 = (TOWER_WIDTH/4) * Math.sin(tx * 2 * Math.PI);
  return tx1;
}

function toScreenY(e) {
  const y = e.y - camera.y;
  const screenY = VIEWPORT_HEIGHT - y;
  return screenY;
}

function radiansToDegrees(r) {
  return r * (180 / Math.PI);
}

function degreesToRadians(d) {
  return d * (Math.PI / 180);
}

function normalize(n, min, max) {
  while (n < min) {
    n += max - min;
  }
  while (n >= max) {
    n -= max - min;
  }
  return n;
}

function loadImage(url) {
  const image = new Image();
  image.src = url;
  image.onload = function () {
    console.log('i load');
  }
  images.push(image);
}

function loadAssets() {
  for(const asset of ASSETS) {
    console.log(asset);
    loadImage(asset);
  }
}

function rafCallback() {
  ++t;
  if (t % 3 === 0) {
    ++frame;
    frame %= 8;
  }
  entity.x += 1;
  // entity.x = normalize(entity.x, 0, TOWER_WIDTH);
  clear();
  renderBricks();
  renderEntity(entity);
  ctx.strokeStyle = 'green';
  renderEntity2(entity);
  requestAnimationFrame(rafCallback);
}

function init() {
  loadAssets();
  requestAnimationFrame(rafCallback);
}
