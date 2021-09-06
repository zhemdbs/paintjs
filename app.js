const canvas = document.querySelector("#jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.querySelector("#jsMode");
const saveBtn = document.querySelector("#jsSave");

const INITIAL_COLOR = "#2c2c2c"
const CANVAS_SIZE = 500;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;


let painting = false;
let filling = false;

function stopPainting() {
  painting = false;
}

function startPainting(){
  painting = true;
}

function onMounseMove(ev){
  const x = ev.offsetX;
  const y = ev.offsetY;
  if(!painting){
    ctx.beginPath();
    ctx.moveTo(x,y);
  } else {
    ctx.lineTo(x,y);
    ctx.stroke();
  }
}

function handleColorClick(ev) {
  const color = ev.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(ev) {
  const size = ev.target.value;
  ctx.lineWidth = size;
}

function handleModeClick(){
  if(filling === true) {
    filling = false;
    mode.innerText = "Fill"
  } else {
    filling = true;
    mode.innerText = "Paint"
  }
}

function handleCanvasClick(){
  if(filling){
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  }
}

function handleCM(ev) {
  ev.preventDefault();
}

function handleSaveClick() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "PaintJS[🎈]";
  link.click();
}

if(canvas) {
  canvas.addEventListener("mousemove", onMounseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleCM);
}

Array.from(colors).forEach(color => 
  color.addEventListener('click', handleColorClick)
);

if(range){
  range.addEventListener("input", handleRangeChange);
}

if(mode){
  mode.addEventListener("click", handleModeClick);
}

if(saveBtn){
  saveBtn.addEventListener("click", handleSaveClick);
}