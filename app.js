let canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let ball_x = 120;
let ball_y = 40;
let Speed_x = 20;
let Speed_y = 20;
let radius = 20;
let plate_x = 100;
let plate_y = 500;
let plate_height = 5;

canvas.addEventListener("mouseover", (e) => {
  plate_x = e.clientX;
});

const unit = 40;
const row = canvas.height / unit; //960/40 = 14
const column = canvas.width / unit; //440/40 =11

class Box {
  static totalBox = [];
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * (row - 4)) * unit;

    let overLapping = Box.checkOverLap(this.x, this.y);
    do {
      this.x = Math.floor(Math.random() * column) * unit;
      this.y = Math.floor(Math.random() * (row - 4)) * unit;
      overLapping = Box.checkOverLap(this.x, this.y);
      // console.log(overLapping);
    } while (overLapping);
    const pos = {
      x: this.x,
      y: this.y,
    };
    Box.totalBox.push(pos);
  }

  drawBox() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  static checkOverLap(x, y) {
    for (let i = 0; i < Box.totalBox.length; i++) {
      if (x == Box.totalBox[i].x && y == Box.totalBox[i].y) {
        return true;
      }
    }
    return false;
  }
}

let box1 = new Box();
let box2 = new Box();
let box3 = new Box();
let box4 = new Box();
let box5 = new Box();
let box6 = new Box();
let box7 = new Box();
let box8 = new Box();
let box9 = new Box();
let box10 = new Box();

function drawBox() {
  box1.drawBox();
  box2.drawBox();
  box3.drawBox();
  box4.drawBox();
  box5.drawBox();
  box6.drawBox();
  box7.drawBox();
  box8.drawBox();
  box9.drawBox();
  box10.drawBox();
}

function drawPlate() {
  ctx.strokeStyle = "brown";
  //x,y,width,height
  ctx.fillRect(plate_x, plate_y, 200, plate_height);
}

function ballMove() {
  if (ball_y >= canvas.height - radius || ball_y <= radius) {
    Speed_y *= -1;
  }
  if (ball_x >= canvas.width - radius || ball_x <= radius) {
    Speed_x *= -1;
  }
  ball_y += Speed_y;
  ball_x += Speed_x;
  drawBall(ball_x, ball_y);
}

function drawCircle() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ballMove();
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x + unit / 2, y + unit / 2, unit / 2, 0, Math.PI * 2); // 畫圓
  ctx.fillStyle = "blue"; // 設定球的顏色
  ctx.fill();
  ctx.closePath();
}

// function draw() {
//   ctx.fillStyle = "black";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
//   drawBox();
//   drawPlate();
//   window.addEventListener("keydown", changeDirection);
//   drawBall(ball_x, ball_y);
// }

// let myGame = setInterval(draw, 100);
let game = setInterval(drawCircle, 25);
