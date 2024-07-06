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
  HEAD_CELL: "headCell",
};

const INITIAL_HEAD_POSITION = { col: 0, row: 0 };

const generateCellId = (row, col) => `row${row}_col${col}`;

const getCell = (row, col) =>
  document.querySelector(`#${generateCellId(row, col)}`);

function createGrid(dimension, cellWidth) {
  const grid = document.createElement("div");
  grid.classList.add("grid");
  grid.style.gridTemplate = `repeat(${dimension},${cellWidth}px) / repeat(${dimension},${cellWidth}px)`;
  for (let row = 0; row < dimension; row++) {
    for (let col = 0; col < dimension; col++) {
      const cell = createCell(-row, col);
      grid.append(cell);
    }
  }
  return grid;
}

function createCell(row, col) {
  const cell = document.createElement("div");
  cell.id = generateCellId(row, col);
  return cell;
}

function createHead(row, col) {
  const headCell = getCell(row, col);
  headCell.classList.add(CLASSES.HEAD_CELL);
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

function onMove(currentHeadPosition, arrowKey, callback) {
  const newHeadPosition = {
    col: currentHeadPosition.col,
    row: currentHeadPosition.row,
  };

  switch (arrowKey) {
    case ARROW_KEYS.DOWN: {
      newHeadPosition.row = newHeadPosition.row - 1;
      break;
    }
    case ARROW_KEYS.UP: {
      newHeadPosition.row = newHeadPosition.row + 1;
      break;
    }
    case ARROW_KEYS.LEFT: {
      newHeadPosition.col = newHeadPosition.col - 1;
      break;
    }
    case ARROW_KEYS.RIGHT: {
      newHeadPosition.col = newHeadPosition.col + 1;
      break;
    }
  }

  newHeadPosition.col =
    newHeadPosition.col === NO_OF_CELLS
      ? 0
      : newHeadPosition.col === -1
      ? NO_OF_CELLS - 1
      : newHeadPosition.col;

  newHeadPosition.row =
    newHeadPosition.row === -NO_OF_CELLS
      ? 0
      : newHeadPosition.row === 1
      ? -(NO_OF_CELLS - 1)
      : newHeadPosition.row;

  moveHead(currentHeadPosition, newHeadPosition, callback);
}

function moveHead(fromPosition, toPosition, callback) {
  const currentHeadCell = getCell(fromPosition.row, fromPosition.col);
  currentHeadCell.classList.toggle(CLASSES.HEAD_CELL);
  const movedHeadCell = getCell(toPosition.row, toPosition.col);
  movedHeadCell.classList.toggle(CLASSES.HEAD_CELL);
  callback(toPosition);
}

const headPosition = INITIAL_HEAD_POSITION;

const gameDiv = document.querySelector("#game");

const grid = createGrid(NO_OF_CELLS, CELL_DIMENSION);
gameDiv.append(grid);

createHead(headPosition.row, headPosition.col);

attachOnMoveEvent((arrowKeyCode) =>
  onMove(headPosition, arrowKeyCode, (newHeadPosition) => {
    headPosition.col = newHeadPosition.col;
    headPosition.row = newHeadPosition.row;
  })
);
