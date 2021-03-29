const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function draw() {
  ctx.strokeStyle = 'black';
  for (let i = 0; i < 10; i++) {
    console.log(i);
    ctx.moveTo(10, 10 + 50 * i);
    ctx.lineTo(460, 10 + 50 * i);
    ctx.stroke();
  }

  for (let i = 0; i < 10; i++) {
    ctx.moveTo(10 + 50 * i, 10);
    ctx.lineTo(10 + 50 * i, 460);
    ctx.stroke();
  }
}

function setPlot(i, j, status) {
  ctx.beginPath();
  ctx.arc(10 + i * 50, 10 + j * 50, 15, 0, 2 * Math.PI);

  if (status == 1) {
    // 白棋
    ctx.fillStyle = 'white';
  } else if (status == -1) {
    ctx.fillStyle = 'black';
  } else {
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = 'palegoldenrod';
    ctx.fill();
    ctx.fillStyle = 'palegoldenrod';
    ctx.fill();
    ctx.fillStyle = 'palegoldenrod';
    ctx.fill();
    ctx.beginPath();

    draw();
    return;
  }
  ctx.fill();
}

let status = 1;
function get_x_y(e) {
  let i = e.offsetY;
  let j = e.offsetX;
  [x, y] = [Math.floor(j / 50), Math.floor(i / 50)];
  setPlot(x, y, status);
  status = -status;
}
draw();
canvas.addEventListener('click', get_x_y);
