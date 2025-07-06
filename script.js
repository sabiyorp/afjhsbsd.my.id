const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const zoomSlider = document.getElementById('zoom');
const downloadBtn = document.getElementById('download');

let userImage = null;
const frameImage = new Image();
frameImage.src = 'frame.png';

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let startX, startY;

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    userImage = new Image();
    userImage.onload = () => {
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      draw();
    };
    userImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

zoomSlider.addEventListener('input', () => {
  scale = parseFloat(zoomSlider.value);
  draw();
});

canvas.addEventListener('mousedown', (e) => {
  dragging = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (dragging) {
    offsetX += e.offsetX - startX;
    offsetY += e.offsetY - startY;
    startX = e.offsetX;
    startY = e.offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', () => (dragging = false));
canvas.addEventListener('mouseleave', () => (dragging = false));

// Mobile support
canvas.addEventListener('touchstart', (e) => {
  dragging = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  startX = touch.clientX - rect.left;
  startY = touch.clientY - rect.top;
});

canvas.addEventListener('touchmove', (e) => {
  if (dragging) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    offsetX += x - startX;
    offsetY += y - startY;
    startX = x;
    startY = y;
    draw();
  }
  e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', () => (dragging = false));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userImage) {
    const iw = userImage.width * scale;
    const ih = userImage.height * scale;
    const ix = (canvas.width - iw) / 2 + offsetX;
    const iy = (canvas.height - ih) / 2 + offsetY;
    ctx.drawImage(userImage, ix, iy, iw, ih);
  }

  if (frameImage.complete) {
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
  }
}

downloadBtn.addEventListener('click', () => {
  if (!userImage || !frameImage.complete) {
    alert("Pastikan foto dan frame sudah dimuat.");
    return;
  }

  // Gambar ulang sebelum simpan
  draw();

  // Tunggu sebentar agar semua benar-benar tergambar
  setTimeout(() => {
    const link = document.createElement('a');
    link.download = 'twibbon.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, 200);
});
