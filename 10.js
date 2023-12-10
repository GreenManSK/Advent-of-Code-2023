const { getInput } = require("./helpers/input-loader");
const { Grid } = require("./helpers/grid");
global.useTest = true;

const main = async () => {
  const grid = await getInput().then(prepareInput);
  console.log("1:", solve1(grid));
  console.log("2:", solve2(grid));
};

const prepareInput = (content) => {
  const simpleGrid = content.split("\n").map((line) => parseLine(line));
  const grid = [];
  for (const x in simpleGrid) {
    grid[x] = [];
    for (const y in simpleGrid[x]) {
      const value = simpleGrid[x][y];
      grid[x][y] = {
        x: +x,
        y: +y,
        isStart: value === "S",
        isEmpty: value === ".",
        distance: undefined,
        isInside:
          +x === 0 ||
          +y === 0 ||
          +x === simpleGrid.length - 1 ||
          +y === simpleGrid[0].length - 1
            ? false
            : undefined,
      };
      grid[x][y].pipe =
        !grid[x][y].isEmpty && !grid[x][y].isStart ? value : undefined;
    }
  }

  return grid;
};

const parseLine = (line) => {
  return line
    .trim()
    .split("")
    .map((n) => (n === "7" ? "R" : n));
};

const solve1 = (grid) => {
  const start = findStart(grid);
  findStartShape(start, grid);
  start.distance = 0;
  let distance = 0;

  let currentPositions = getConnections(start, grid);
  while (currentPositions.length) {
    distance++;
    const newPositions = currentPositions
      .map((point) => getConnections(point, grid))
      .flat();
    currentPositions.forEach(({ x, y }) => (grid[x][y].distance = distance));

    currentPositions = newPositions.filter(
      (point) => point.distance === undefined
    );
  }

  return distance;
};

const solve2 = (grid) => {
  let unknownEmpty;
  do {
    unknownEmpty = grid
      .flat()
      .find(({ isEmpty, isInside }) => isEmpty && isInside === undefined);
    if (!unknownEmpty) break;
    const currents = new Set([unknownEmpty]);

    const isOutside = [...currents.values()].some(
      ({ isInside }) => isInside === false
    );
    currents.forEach((point) => (point.isInside = !isOutside));
  } while (unknownEmpty);
  return grid.flat().filter(({ isInside }) => isInside).length;
};

const findStart = (grid) => {
  return grid.flat().find(({ isStart }) => isStart);
};

const findStartShape = (start, grid) => {
  const connected = [];
  let hasLeft = false,
    hasRight = false,
    hasTop = false,
    hasBottom = false;
  Grid.forEachNeighNoDiagonal(grid, [start.x, start.y], ({ value, x, y }) => {
    if (getConnections(value, grid).some(({ isStart }) => isStart)) {
      if (x != start.x) {
        // top bot
        hasTop = x < start.x;
        hasBottom = x > start.x;
      } else {
        hasLeft = y < start.y;
        hasRight = y > start.y;
      }
    }
  });

  if (hasLeft && hasRight) {
    start.pipe = "-";
  }

  if (hasTop && hasBottom) {
    start.pipe = "|";
  }

  if (hasTop && hasRight) {
    start.pipe = "L";
  }

  if (hasLeft && hasTop) {
    start.pipe = "J";
  }

  if (hasLeft && hasBottom) {
    start.pipe = "R";
  }

  if (hasBottom && hasRight) {
    start.pipe = "F";
  }
};

const getConnections = (point, grid) => {
  const relatives = getRelativeConnections(point.pipe);
  return relatives
    .map(({ x, y }) => [y + point.x, x + point.y])
    .filter((point) => Grid.isInGrid(grid, point))
    .map(([x, y]) => grid[x][y]);
};

const getRelativeConnections = (pipe) => {
  switch (pipe) {
    case "|":
      return [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
      ];
    case "-":
      return [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
    case "L":
      return [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
      ];
    case "J":
      return [
        { x: 0, y: -1 },
        { x: -1, y: 0 },
      ];
    case "R":
      return [
        { x: 0, y: 1 },
        { x: -1, y: 0 },
      ];
    case "F":
      return [
        { x: 0, y: 1 },
        { x: 1, y: 0 },
      ];
    default:
      return [];
  }
};

main();
