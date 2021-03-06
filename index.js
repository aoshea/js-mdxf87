// Import stylesheets
import './style.css';

const appDiv = document.getElementById('app');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
appDiv.appendChild(canvas);

const VIEWPORT_HEIGHT = 150;
const VIEWPORT_WIDTH = 300;

const TOWER_WIDTH = 300;
const TOWER_HEIGHT = 600;

const KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }; // input key codes
const ASSETS = [
  'https://atariage.com/forums/uploads/monthly_04_2018/post-33891-0-54298600-1524899928.png',
];

const images = [];

const input = {
  left: false,
  right: false,
  up: false,
};

const entity = {
  x: 0,
  y: 0,
  height: 10,
};

const platform = {
  x: 100,
  y: 20,
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
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'black';
}

function renderPlatform(p) {
  const x = toScreenX(p);
  const y = toScreenY(p);
  ctx.fillStyle = 'blue';
  ctx.fillRect(x-5, y-2, 10, 4);
}

function renderEntity(e) {
  const x = toScreenX(e);
  const y = toScreenY(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - e.height);
  ctx.stroke();
}

function renderEntity2(e) {
  const x = toScreenX2(e);
  const y = toScreenY(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - e.height);
  ctx.stroke();
}

function renderBricks() {
  if (!images[0]) return;
  ctx.save();
  ctx.translate(VIEWPORT_WIDTH * 0.5, 0);
  const dx = -64;
  let dy = 0;
  const rows = 19;
  for (let i = 0; i < rows; ++i) {
    let offset = i % 2 === 0 ? 4 : 0;
    let f = (frame + offset) % 8;
    let sy = 8 * f;
    ctx.drawImage(images[0], 0, sy, 128, 8, dx, dy, 128, 8);
    dy += 8;
  }
  ctx.restore();
}

function toScreenX(e) {
  return normalize(e.x, 0, TOWER_WIDTH);
}

function toScreenX2(e) {
  const x = normalize(e.x, 0, TOWER_WIDTH);
  const tx = x / TOWER_WIDTH;
  // tx * 2 * Math.PI
  // is like, percentage of 360 degrees.
  const tx1 = (TOWER_WIDTH / 4) * Math.sin(tx * 2 * Math.PI);
  return tx1;
}

function toScreenY(e) {
  const y = e.y;
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
  images.push(image);
}

function loadAssets() {
  for (const asset of ASSETS) {
    loadImage(asset);
  }
}

function handleKeyDown(e) {
  e.preventDefault();
  switch (e.keyCode) {
    case KEY.UP:
      input.up = true;
      break;
    case KEY.LEFT:
      input.left = true;
      break;
    case KEY.RIGHT:
      input.right = true;
      break;
  }
}

function handleKeyUp(e) {
  e.preventDefault();
  switch (e.keyCode) {
    case KEY.UP:
      input.up = false;
      break;
    case KEY.LEFT:
      input.left = false;
      break;
    case KEY.RIGHT:
      input.right = false;
      break;
  }
}

function addListeners() {
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

function rafCallback() {
  t++;
  if (t % 32 === 0) {
    ++frame;
    frame %= 8;
  }
  // entity.x += 1;
  // entity.x = normalize(entity.x, 0, TOWER_WIDTH);
  if (input.right) {
    entity.x += 1;
  }
  if (input.left) {
    entity.x -= 1;
  }
  if (input.up) {
    entity.y += 1;
  }
  clear();
  //renderBricks();
  renderEntity(entity);
  ctx.strokeStyle = 'red';
  renderEntity2(entity);
  renderPlatform(platform);
  requestAnimationFrame(rafCallback);
}

function init() {
  loadAssets();
  addListeners();
  requestAnimationFrame(rafCallback);
}
