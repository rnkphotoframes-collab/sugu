const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let images = [];
let positions = [];
let zoom = 1;
let activeIndex = null;
let offsetX = 0;
let offsetY = 0;

// 5 boxes (including center)
const boxes = [
  {x: 50, y: 50, w: 250, h: 250},
  {x: 480, y: 50, w: 250, h: 250},
  {x: 50, y: 800, w: 250, h: 250},
  {x: 480, y: 800, w: 250, h: 250},
  {x: 200, y: 400, w: 400, h: 300} // center
];

// upload
document.getElementById("upload").addEventListener("change", function(e) {
  const files = e.target.files;
  images = [];
  positions = [];

  let loaded = 0;

  for (let i = 0; i < files.length && i < boxes.length; i++) {
    const reader = new FileReader();

    reader.onload = function(evt) {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === Math.min(files.length, boxes.length)) {
          draw();
        }
      };
      img.src = evt.target.result;

      images.push(img);
      positions.push({x: 0, y: 0});
    };

    reader.readAsDataURL(files[i]);
  }
});

// zoom control
document.getElementById("zoom").addEventListener("input", function(e) {
  zoom = parseFloat(e.target.value);
  draw();
});

// draw
function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  boxes.forEach((box, i) => {
    if (images[i]) {
      const pos = positions[i];

      ctx.drawImage(
        images[i],
        box.x + pos.x,
        box.y + pos.y,
        box.w * zoom,
        box.h * zoom
      );
    }

    // frame
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
  });
}

// drag logic
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  boxes.forEach((box, i) => {
    if (
      x >= box.x &&
      x <= box.x + box.w &&
      y >= box.y &&
      y <= box.y + box.h
    ) {
      activeIndex = i;
      offsetX = x - positions[i].x;
      offsetY = y - positions[i].y;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (activeIndex === null) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  positions[activeIndex].x = x - offsetX;
  positions[activeIndex].y = y - offsetY;

  draw();
});

canvas.addEventListener("mouseup", () => {
  activeIndex = null;
});

// download
function downloadImage() {
  const link = document.createElement("a");
  link.download = "RNK_PHOTOFRAMES.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}