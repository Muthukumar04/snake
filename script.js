const NO_OF_CELLS = 9;
const CELL_DIMENSION = 50;

const ARROW_KEYS = {
  DOWN: "ArrowDown",
  UP: "ArrowUp",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
};

const CLASSES = {
  GRID: "grid",
  HEAD: "head",
  BODY: "body",
};

function getInitalSnake() {
  return [
    { row: 0, col: 4 },
    { row: 0, col: 3 },
    { row: 0, col: 2 },
    { row: 0, col: 1 },
    { row: 0, col: 0 },
  ];
}

const generateCellId = (row, col) => `row${row}_col${col}`;

const getCell = (row, col) =>
  document.querySelector(`#${generateCellId(row, col)}`);

function createGrid(dimension, cellWidth) {
  const grid = document.createElement("div");
  const cells = [];
  grid.classList.add("grid");
  grid.style.gridTemplate = `repeat(${dimension},${cellWidth}px) / repeat(${dimension},${cellWidth}px)`;
  for (let row = 0; row < dimension; row++) {
    for (let col = 0; col < dimension; col++) {
      const cell = createCell(-row, col);
      cells.push(cell);
      grid.append(cell);
    }
  }
  return { grid, cells };
}

function createCell(row, col) {
  const cell = document.createElement("div");
  cell.id = generateCellId(row, col);
  return cell;
}

function paintSnake(snake, cells, callback = () => {}) {
  resetGrid(cells);
  snake.forEach(({ row, col }, index) => {
    const isHead = index === 0;
    const cell = getCell(row, col);
    let className = CLASSES.BODY;
    if (isHead) {
      className = CLASSES.HEAD;
    }
    cell.className = className;
  });
  callback(snake);
}

function resetGrid(cells) {
  cells.forEach((cell) => (cell.className = ""));
}

function attachOnMoveEvent(callback) {
  document.addEventListener("keydown", (e) => {
    const keyCode = e.code;
    const isArrowKeyPressed = Object.values(ARROW_KEYS).includes(keyCode);
    if (isArrowKeyPressed) {
      callback(keyCode);
    }
  });
}

function movePart(part, direction) {
  const newPart = { ...part };

  switch (direction) {
    case ARROW_KEYS.DOWN: {
      newPart.row = part.row - 1;
      break;
    }
    case ARROW_KEYS.UP: {
      newPart.row = part.row + 1;
      break;
    }
    case ARROW_KEYS.LEFT: {
      newPart.col = part.col - 1;
      break;
    }
    case ARROW_KEYS.RIGHT: {
      newPart.col = part.col + 1;
      break;
    }
  }

  newPart.col =
    newPart.col === NO_OF_CELLS
      ? 0
      : newPart.col === -1
      ? NO_OF_CELLS - 1
      : newPart.col;

  newPart.row =
    newPart.row === -NO_OF_CELLS
      ? 0
      : newPart.row === 1
      ? -(NO_OF_CELLS - 1)
      : newPart.row;

  return newPart;
}

function onMove(currentSnake = [], direction, cells, callback) {
  const updatedSnake = currentSnake.map((part, index) => {
    if (index === 0) {
      const updatedHead = movePart(part, direction);
      if (willCollide(updatedHead, currentSnake)) {
        alert("Colliding");
        paintSnake(getInitalSnake(), cells);
      }
      return updatedHead;
    } else {
      return currentSnake[index - 1];
    }
  });

  paintSnake(updatedSnake, cells, callback);
}

const willCollide = (head, snake) =>
  snake.find((part) => part.col === head.col && part.row === head.row);

function moveHead(fromPosition, toPosition, callback) {
  const currentHeadCell = getCell(fromPosition.row, fromPosition.col);
  currentHeadCell.classList.toggle(CLASSES.HEAD);
  const movedHeadCell = getCell(toPosition.row, toPosition.col);
  movedHeadCell.classList.toggle(CLASSES.HEAD);
  callback(toPosition);
}

let snake = getInitalSnake();

const gameDiv = document.querySelector("#game");

const { grid, cells } = createGrid(NO_OF_CELLS, CELL_DIMENSION);
gameDiv.append(grid);

paintSnake(snake, cells);

attachOnMoveEvent((direction) =>
  onMove(snake, direction, cells, (updatedSnake) => (snake = updatedSnake))
);
