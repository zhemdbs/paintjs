# paintjs

Painting Board made with Vanilla Js
<br/>
<br/>

## _Features_

- Paint
- Change brush size
- Change color
- fill canvas
- Save Images

---

## _Canvas Events_

<br/>

_**캔버스 위로 마우스를 두면 움직임을 감지하게 하기**_

- 마우스의 움직임을 캐치하기 위해 `mousemove` 사용
- offsetX,Y 는 캔버스 내에서의 마우스 위치값을 나타냄(캔버스 내의 좌표값)
- clientX,Y 는 윈도우 전체의 범위 내에서 마우스 위치값을 나타내는 것(전체 윈도우에서 좌표값을 알고 싶을때)
- <U>**_만약 캔버스를 스크린사이즈로 만들었다면 사이즈가 같아서 offsetX,clientX는 차이가 없음_**</U>

```js
//마우스의 위치값을 offsetx,y를 통해 값을 나타냄
function onMounseMove(ev) {
  const x = ev.offsetX;
  const y = ev.offsetY;
}

if (canvas) {
  canvas.addEventListener("mousemove", onMounseMove);
}
```

<br/>

_**캔버스를 클릭했을 때 painting을 시작**_

- painting 은 기본적으로 `false`가 되는데, 그것을 마우스가 클릭했을 땐 `true`, 클릭한 마우스를 놓으면 다시 `false`로 설정되어야 함
- 마우스가 캔버스를 벗어나면 `false`

```js
let painting = false;

function stopPainting() {
  //클릭한 마우스를 놓을 때, 마우스가 캔버스를 벗어날 때
  painting = false;
}

function onMouseDown(ev) {
  //마우스 클릭했을 때
  painting = true;
}

if (canvas) {
  canvas.addEventListener("mousemove", onMounseMove);
  canvas.addEventListner("mousedown", onMouseDown);
  canvas.addEventListner("mouseup", stopPainting);
  canvas.addEventListner("mouseleave", stopPainting);
}
```

<br/>

---

## _2D Context_

<br/>

_**CANVAS to MDN**_

- 기본적으로 canvas는 HTML의 한 요소이지만 다른 점은 Context를 가짐
- Context는 canvas 요소 안에서 사용자가 픽셀에 접근할 수 있는 방법

```
- strokeStyle : 색상이나 스타일을 shape안에 사용할 수 있도록 함(default)
- lineWidth : 선의 너비로 브러쉬의 크기 조정이 가능
- path : 라인(선)
- beginPath : 새로운 경로를 생성하고자 할 때
- moveTo : 새 하위 경로의 시작점을 (x, y)좌표로 이동
- lineTo : 이 전 위치에서 현재 위치까지 직선으로 연결
- stroke : 현재 획 스타일로 현재 하위 경로를 획함
```

- 움직이면서 path를 만들고 마우스가 가는 곳으로 path를 옮김(클릭하면 클릭한 위치가 그 path의 끝나는 지점으로서 선택됨)
- 캔버스는 두가지 사이즈를 가지는데, `css size`, `pixel manipulating size` pms는 pixel을 다룰 수 있는 요소로서 만드는 것이기 때문에 그 요소에 width와 height를 지정해 줘야 그릴 수 있음

```js
const ctx = canvas.getContext("2d");

//실제 pixel modifier에 사이즈를 줘야지 그려짐
canvas.width = 500;
canvas.height = 500;

ctx.strokeStyle = "#2c2c2c"; //기본 선 색상
ctx.lineWidth = 2.5; //기본 선 너비

function startPainting() {
  //마우스 클릭했을 때
  painting = true;
}

function onMounseMove(ev) {
  const x = ev.offsetX;
  const y = ev.offsetY;
  if (!painting) {
    //클릭하고 움직이면 실행하지 않음
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    //클릭하고 움직이면 실행(마우스를 움직이는 내내 발생)
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

if (canvas) {
  canvas.addEventListener("mousemove", onMounseMove);
  canvas.addEventListner("mousedown", startPainting); //onMouseDown을 startPainting으로 바꿔줌
  canvas.addEventListner("mouseup", stopPainting);
  canvas.addEventListner("mouseleave", stopPainting);
}
```

<br/>

---

## _Changing Color_

<br/>

_**나열되어 있는 색상 선택하기**_

- 나열된 색상을 배열로 만들기 위해 `Array.from`이라는 배열constructor로 부터 메소드를 호출
- `Array.from` 메소드는 객체로부터 배열을 만듬
- colors가 배열을 주면 그 배열안에서 forEach로 color를 가질 수 있음
- **_array를 만들고 forEach로 color를 돌려 이벤트를 호출_**
- 배열로 생성된 클릭한 color(target)의 backgroundColor(rgb)를 color변수에 저장
- target의 색상으로 바꾸기 위해 `strokeStyle`에 덮어씀(override)

```js
const colors = document.getElementsByClassName("jsColor");

function handleColorClick(ev) {
  const color = ev.target.style.backgroundColor;
  ctx.strokeStyle = color;
}

//이름(color)은 배열안의 각각의 아이템을 대표
Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);
```

<br/>

---

## _Brush Size_

<br/>

_**사이즈 조절(range) 하기**_

- range이벤트는 input에 반응
- 범위를 조절하면서 그 값을 나타내는 target.value를 size변수에 저장(범위 조절은 html에서 지정)
- target의 라인의 너비를 조절하기 위해서 `lineWidth`에 override

```js
const range = document.getElementById("jsRange");

function handleRangeChange(ev) {
  const size = ev.target.value;
  ctx.lineWidth = size;
}

if (range) {
  range.addEventListener("input", handleRangeChange);
}
```

<br/>

---

## _Filling Mode_

<br/>

_**Paint와 Fill**_

- FILL버튼을 클릭하면 버튼이 PAINT로 바뀌고 다시 PAINT를 클릭하면 FILL이 되도록 바꿈
- filling이라는 변수를 만들고 그 기본값은 false로 지정(filling을 하고 있다는 것을 알기 위해)

```js
const mode = document.querySelector("#jsMode");

let filling = false;

function handleModeClick() {
  if (filling === true) {
    //painting모드일때
    filling = false;
    mode.innerText = "Fill";
  } else {
    //filling모드일때
    filling = true;
    mode.innerText = "Paint";
  }
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}
```

<br/>

_**캔버스 전체 칠하기**_

- 캔버스에서는 위에서부터 아래로 내려오면서 실행이 됨
- handleColorClick함수는 사용자가 color를 클릭하면 strokeStyle과 fillStyle을 color값으로 설정하도록 함 (filling 하던 painting(clicking)하던 모두 같은 style를 가짐)
- 기본 컬러값을 INITIAL_COLOR변수에 저장
- fillStyle을 통해 기본적인 배경을 하얀색으로 저장

```
- fillStlye : 내부 도형에 사용할 색상 또는 스타일
- fillRect : width와 height에 의해 결정된 사이즈로 (x, y)위치에 색칠된 사각형을 그림
```

- fillRect를 이용해 사각형을 만듬(0,0부터 시작해서 캔버스 크기만큼 사이즈를 만듬)
- fillRect를 이용하면 캔버스 사이즈가 전체 칠해짐 `if(filling)`을 통해서 paint로도 전환이 되도록 함

```js
const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 500;

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;

function handleColorClick(ev) {
  const color = ev.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleCanvasClick() {
  if (filling) {
    //paint로 전환이 가능하도록
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

if (canvas) {
  canvas.addEventListener("mousemove", onMounseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
}
```

<br/>

---

## _Saving the Image_

<br/>

_**우클릭 방지**_

- 이미 cavas가 pixel를 다루기 때문에 기본적으로 image가 되어 download와 save 부분이 이미 내장되어 있음
- 우클릭을 통해 나타나는 메뉴를 `context menu`라고 하는데 `context menu`를 이벤트리스너를 통해 가능
- handleCM함수를 통해 우클릭을 방지하도록 하도록 해서 save버튼을 눌러야지만 image를 다운 받도록 함

```js
function handleCM(ev) {
  //우클릭 방지
  ev.preventDefault();
}

if (canvas) {
  canvas.addEventListener("mousemove", onMounseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleCM);
}
```

<br/>

_**SAVE버튼을 누르면 이미지가 저장되도록 하기**_

- 캔버스의 데이터를 image처럼 얻어오도록 하기 위해 `toDataURL`를 사용

```
- toDataURL : (기본적으로 PNG로 설정된)type parameter에 의해 지정된 포맷의 이미지 표현을 포함한 dataURL를 반환함
(PNG던 jpeg던 뭐든 변경 할 수 있음)
```

- 기본적으로 png로 설정되있기 때문에 toDataURL에 type을 아무것도 안적어도 됨 <u>_( 만약 jpeg로 변환하려면 toDataURL("image/jpeg") 를 씀 단, 픽셀이 심하게 깨짐)_</u>
- 존재하지 않는 링크를 만드는데 download는 a태그의 속성인데, 브라우저에게 링크로 가는 대신 URL를 다운로드 하라고 지시함
- link의 href는 image가 되고, 이미지를 다운로드하면 PaintJS[🎈]이름으로 가지도록 함
- link.click을 통해 거짓된 클릭을 만듬

```js
const saveBtn = document.querySelector("#jsSave");

function handleSaveClick() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "PaintJS[🎈]";
  link.click(); //거짓된 클릭
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}
```
