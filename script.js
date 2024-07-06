const GRID_DIMENSION = 9;
const GRID_CELL_DIMENSION = 50;
const KEYS = {
  DOWN: "ArrowDown",
  UP: "ArrowUp",
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
};
const CLASSES = {
  GRID: "grid",
  HEAD_CELL: "headCell",
};
const headPosition = { col: 0, row: 0 };

const generateCellId = (row, col) => `row${row}_col${col}`;

const getCell = (row, col) =>
  document.querySelector("#" + generateCellId(row, col));

function drawGrid(dimension, cellWidth) {
  const grid = document.createElement("div");
  grid.classList.add("grid");
  grid.style.gridTemplate = `repeat(${dimension},${cellWidth}px) / repeat(${dimension},${cellWidth}px)`;
  for (let row = 0; row < dimension; row++) {
    for (let col = 0; col < dimension; col++) {
      const cell = getGridCell(-row, col);
      grid.append(cell);
    }
  }
  gameDiv.append(grid);
  return grid;
}

function getGridCell(row, col) {
  const cell = document.createElement("div");
  //  cell.style.width = width + "px";
  cell.id = generateCellId(row, col);
  // cell.classList.add("gridCell");
  return cell;
}

function createHead(row, col) {
  const headCell = document.querySelector(`#${generateCellId(row, col)}`);
  headCell.classList.add(CLASSES.HEAD_CELL);
}

function attachEvent(callback) {
  document.addEventListener("keydown", (e) => {
    const keyCode = e.code;
    if (Object.values(KEYS).includes(keyCode)) {
      callback(e, keyCode);
    }
  });
}

function onMove(currentHeadPosition, direction, event, callback) {
  const newHeadPosition = {
    col: currentHeadPosition.col,
    row: currentHeadPosition.row,
  };
  switch (direction) {
    case KEYS.DOWN: {
      newHeadPosition.row = newHeadPosition.row - 1;
      break;
    }
    case KEYS.UP: {
      newHeadPosition.row = newHeadPosition.row + 1;
      break;
    }
    case KEYS.LEFT: {
      newHeadPosition.col = newHeadPosition.col - 1;
      break;
    }
    case KEYS.RIGHT: {
      newHeadPosition.col = newHeadPosition.col + 1;
      break;
    }
  }
  newHeadPosition.col =
    newHeadPosition.col === GRID_DIMENSION
      ? 0
      : newHeadPosition.col === -1
      ? GRID_DIMENSION - 1
      : newHeadPosition.col;
  newHeadPosition.row =
    newHeadPosition.row === -GRID_DIMENSION
      ? 0
      : newHeadPosition.row === 1
      ? -(GRID_DIMENSION - 1)
      : newHeadPosition.row;
  moveHead(currentHeadPosition, newHeadPosition, callback);
}

function moveHead(fromHeadPosition, toHeadPostion, callback) {
  const currentHeadCell = getCell(fromHeadPosition.row, fromHeadPosition.col);
  currentHeadCell.classList.toggle(CLASSES.HEAD_CELL);
  const movedHeadCell = getCell(toHeadPostion.row, toHeadPostion.col);
  movedHeadCell.classList.toggle(CLASSES.HEAD_CELL);
  callback(toHeadPostion);
}

const gameDiv = document.querySelector("#game");

const grid = drawGrid(GRID_DIMENSION, GRID_CELL_DIMENSION);

createHead(headPosition.row, headPosition.col);

attachEvent((event, direction) =>
  onMove(headPosition, direction, event, ({ col, row }) => {
    headPosition.col = col;
    headPosition.row = row;
  })
);
