const { getInput } = require("./helpers/input-loader");
const { Grid } = require("./helpers/grid");
// global.useTest = true;

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
  fixPipeShape(start, grid);
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
  grid = blowUpGrid(grid);

  const empties = new Set(grid.flat().filter(({ isEmpty }) => isEmpty));
  while (empties.size > 0) {
    const [start] = empties;
    const currents = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const current = queue.pop();
      Grid.forEachNeighNoDiagonal(
        grid,
        [current.x, current.y],
        ({ value: point, x, y }) => {
          if (point.isEmpty) {
            if (!currents.has(point)) {
              queue.push(point);
              currents.add(point);
            }
          }
        }
      );
    }

    const isOutside = [...currents].some((point) => point.isInside === false);
    currents.forEach((point) => {
      point.isInside = !isOutside;
      empties.delete(point);
    });
  }
  // printGrid(grid, true);
  return grid
    .flat()
    .filter((point) => !point.isFake && point.isEmpty && point.isInside).length;
};

const blowUpGrid = (grid) => {
  const newGrid = [];
  const newHeight = grid.length * 2;
  const newWidth = grid[0].length * 2;
  for (let x = 0; x < newHeight; x++) {
    newGrid[x] = [];
    for (let y = 0; y < newWidth; y++) {
      newGrid[x][y] = { x, y, isFake: true, isEmpty: true };
    }
  }

  grid.flat().forEach((point) => {
    const newX = point.x * 2;
    const newY = point.y * 2;

    newGrid[newX][newY] = {
      ...point,
      x: newX,
      y: newY,
      isEmpty: point.isEmpty || point.distance === undefined,
    };
  });

  newGrid.flat().forEach((point) => {
    if (point.isFake) {
      fixPipeShape(point, newGrid);
      point.isEmpty = point.pipe === undefined;
    }
    if (
      point.x === 0 ||
      point.y === 0 ||
      point.x === newHeight - 1 ||
      point.y === newWidth - 1
    )
      point.isInside = false;
  });

  return newGrid;
};

const printGrid = (grid, onlyReal = false) => {
  console.log(
    grid
      .map((line) =>
        line
          .filter(({ isFake }) => !onlyReal || !isFake)
          .map(({ pipe, isEmpty, isInside }) =>
            pipe ? pipe : isEmpty ? (isInside ? "I" : "O") : "?"
          )
          .join("")
      )
      .filter((n) => n.length)
      .join("\n")
  );
};

const findStart = (grid) => {
  return grid.flat().find(({ isStart }) => isStart);
};

const fixPipeShape = (point, grid) => {
  let hasLeft = false,
    hasRight = false,
    hasTop = false,
    hasBottom = false;
  Grid.forEachNeighNoDiagonal(grid, [point.x, point.y], ({ value, x, y }) => {
    if (
      getConnections(value, grid).some(
        ({ x, y }) => x == point.x && y == point.y
      )
    ) {
      if (x != point.x) {
        if (x < point.x) {
          hasTop = true;
        } else {
          hasBottom = true;
        }
      } else {
        if (y < point.y) {
          hasLeft = true;
        } else {
          hasRight = true;
        }
      }
    }
  });

  if (hasLeft && hasRight) {
    point.pipe = "-";
  }

  if (hasTop && hasBottom) {
    point.pipe = "|";
  }

  if (hasTop && hasRight) {
    point.pipe = "L";
  }

  if (hasLeft && hasTop) {
    point.pipe = "J";
  }

  if (hasLeft && hasBottom) {
    point.pipe = "R";
  }

  if (hasBottom && hasRight) {
    point.pipe = "F";
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
