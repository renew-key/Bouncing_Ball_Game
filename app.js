let canvas = document.getElementById("myCanvas");
let sec = document.getElementById("mySec");
let minSec = document.getElementById("mySec2");
let start = document.querySelector("#start");
let pauseBtn = document.getElementById("pauseBtn");
let timer = 0;
let minTimer = localStorage.getItem("minTimer") || 0;
pauseBtn.innerText = "Paused";
let timeClock;
sec.innerHTML = `Seconds: ${timer}`;
minSec.innerHTML = `Minimum seconds: ${minTimer}`;
const ctx = canvas.getContext("2d");
const unit = 40; // 方塊大小
let ball_x = 120;
let ball_y = 40;
let Speed_x = 20;
let Speed_y = 20;
let radius = 20;
let plate_x = 100;
let plate_width = 200;
let plate_y = canvas.height - 100;
let plate_height = 5;
let move_x = 40;
let count = 0;
let gameOver = false; // 遊戲結束標誌
let game;
let isPaused = false; // 控制遊戲是否暫停

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    if (plate_x >= move_x) {
      plate_x -= move_x; // 向左移動
    }
  } else if (e.key === "ArrowRight") {
    if (plate_x < canvas.width - plate_width) plate_x += move_x; // 向右移動
  }
});

const row = canvas.height / unit; // 960 / 40 = 24
const column = canvas.width / unit; // 440 / 40 = 11

class Box {
  static totalBox = [];

  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
    this.height = unit;
    this.width = unit;
    this.visible = true;

    let overLapping = Box.checkOverLap(this.x, this.y);
    do {
      this.x = Math.floor(Math.random() * column) * unit;
      this.y = Math.floor(Math.random() * (row - 4)) * unit;
      overLapping = Box.checkOverLap(this.x, this.y);
    } while (overLapping);
    Box.totalBox.push(this);
  }

  drawBox() {
    if (this.visible) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, unit, unit);
    }
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

for (let i = 0; i < 10; i++) {
  new Box();
}

function drawPlate() {
  ctx.fillStyle = "brown";
  ctx.strokeStyle = "brown";
  ctx.fillRect(plate_x, plate_y, plate_width, plate_height);
}

function circleRectCollision(circle, rect) {
  // 找到方塊的最接近點
  let closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  let closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // 計算球和方塊最接近點的距離
  let distanceX = circle.x - closestX;
  let distanceY = circle.y - closestY;

  // 精確的碰撞檢測邏輯
  let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  return distance < circle.radius; // 如果距離小於球的半徑，則發生碰撞
}

function hitbox() {
  Box.totalBox.forEach((box) => {
    const ball = { x: ball_x, y: ball_y, radius: radius };
    const boxP = { x: box.x, y: box.y, width: box.width, height: box.height };

    // 碰撞並且該方塊是可見的才處理
    if (box.visible && circleRectCollision(ball, boxP)) {
      count++; // 只在碰撞時計算
      box.visible = false; // 使方塊不可見
      Speed_y *= -1; // 反彈
    }
  });

  // 判斷是否已經消除所有方塊
  if (count === Box.totalBox.length && !gameOver) {
    gameOver = true;
    setTimeout(() => {
      alert("Game Over!");
      if (timer < minTimer || minTimer == 0) {
        minTimer = timer;
        minSec.innerHTML = `Minimum seconds: ${timer}`;
        localStorage.setItem("minTimer", timer);
      }
      timer = 0;
      clearInterval(timeClock);
      clearInterval(game); // 停止遊戲
      game = null; // 防止再次調用
    }, 100); // 延遲500毫秒後顯示遊戲結束
  }
}

function hitPlate() {
  const ball = { x: ball_x, y: ball_y, radius: radius };
  const plate = {
    x: plate_x,
    y: plate_y,
    width: plate_width,
    height: plate_height,
  };

  if (circleRectCollision(ball, plate)) {
    Speed_y *= -1; // 反彈
  }
}

function hitBorder() {
  if (ball_y >= canvas.height - radius || ball_y <= radius) {
    Speed_y *= -1; // 反彈
  }
  if (ball_x >= canvas.width - radius || ball_x <= radius) {
    Speed_x *= -1; // 反彈
  }

  ball_y += Speed_y;
  ball_x += Speed_x;
}

function ballMove() {
  hitPlate();
  hitBorder();
  drawBall(ball_x, ball_y);
  hitbox();
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x + unit / 2, y + unit / 2, unit / 2, 0, Math.PI * 2); // 畫圓
  ctx.fillStyle = "blue"; // 設定球的顏色
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  Box.totalBox.forEach((box) => {
    box.drawBox();
  });
  drawPlate();
  ballMove();
}

pauseBtn.addEventListener("click", () => {
  if (!game) {
    return;
  }
  if (isPaused) {
    pauseBtn.innerText = "Pause"; // 按鈕顯示為「Pause」
    isPaused = false; // 解除暫停
    game = setInterval(draw, 25); // 繼續遊戲

    timeClock = setInterval(() => {
      timer++;
      sec.innerHTML = `Seconds: ${timer}`;
    }, 1000);
  } else {
    pauseBtn.innerText = "Continue"; // 按鈕顯示為「Continue」
    isPaused = true; // 暫停遊戲
    clearInterval(game); // 停止遊戲
    clearInterval(timeClock); // 停止計時
  }
});

// 開始遊戲
start.addEventListener("click", () => {
  // 防止重複啟動
  if (game || isPaused) return;

  gameOver = false; // 重置遊戲結束標誌
  Box.totalBox = []; // 重置方塊
  count = 0; // 重置計數器
  timer = 0; // 重置計時器
  sec.innerHTML = `Seconds: ${timer}`; // 更新顯示時間

  for (let i = 0; i < 10; i++) {
    new Box(); // 重新生成方塊
  }

  game = setInterval(draw, 25); // 每 25 毫秒更新畫面
  timeClock = setInterval(() => {
    timer++;
    sec.innerHTML = `Seconds: ${timer}`;
  }, 1000);
});
