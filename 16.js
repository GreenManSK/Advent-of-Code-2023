const { getInput } = require("./helpers/input-loader");
const { Grid } = require("./helpers/grid");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input, [0, 0, Directions.right]));
  console.log("2:", solve2(input));
};

const prepareInput = (content) =>
  content.split("\n").map((line) => parseLine(line));

const parseLine = (line) => {
  return line.trim().split("");
};

const Directions = {
  left: [0, -1],
  right: [0, 1],
  up: [-1, 0],
  down: [1, 0],
};

const solve1 = (grid, startBeam) => {
  let beams = [startBeam];
  const energized = new Set([getKey(startBeam)]);
  const processedBeams = new Set([getBeamKey(startBeam)]);

  while (beams.length > 0) {
    const newBeams = [];
    for (const beam of beams) {
      const movedBeams = moveBeam(beam, grid);
      movedBeams.forEach((movedBeam) => {
        const key = getBeamKey(movedBeam);
        if (processedBeams.has(key)) {
          return;
        }
        processedBeams.add(key);
        if (Grid.isInGrid(grid, movedBeam)) {
          newBeams.push(movedBeam);
          energized.add(getKey(movedBeam));
        }
      });
    }
    beams = newBeams;
  }

  return energized.size;
};

const solve2 = (grid) => {
  const height = grid.length - 1;
  const width = grid[0].length - 1;
  let bestEnergized = 0;
  for (let x = 0; x <= height; x++) {
    for (let y = 0; y <= width; y++) {
      if (x !== 0 && y !== 0 && x !== height && y !== width) continue;

      if (x === 0) {
        bestEnergized = Math.max(
          bestEnergized,
          solve1(grid, [x, y, Directions.down])
        );
      } else if (x === height) {
        bestEnergized = Math.max(
          bestEnergized,
          solve1(grid, [x, y, Directions.up])
        );
      }

      if (y === 0) {
        bestEnergized = Math.max(
          bestEnergized,
          solve1(grid, [x, y, Directions.right])
        );
      } else if (y === height) {
        bestEnergized = Math.max(
          bestEnergized,
          solve1(grid, [x, y, Directions.left])
        );
      }
    }
  }
  return bestEnergized;
};

const moveBeam = ([x, y, direction], grid) => {
  const currentTile = grid[x][y];
  switch (currentTile) {
    case ".":
      const [dx, dy] = direction;
      return [[x + dx, y + dy, direction]];
    case "/":
    case "\\":
      return [reflect([x, y, direction], currentTile)];
    case "-":
    case "|":
      return splitBeam([x, y, direction], currentTile);
    default:
      return undefined;
  }
};

const splitBeam = ([x, y, direction], splitter) => {
  if (
    (splitter === "-" &&
      (direction === Directions.left || direction === Directions.right)) ||
    (splitter === "|" &&
      (direction === Directions.up || direction === Directions.down))
  ) {
    const [dx, dy] = direction;
    return [[x + dx, y + dy, direction]];
  }
  if (splitter === "|") {
    return [
      [x + 1, y, Directions.down],
      [x - 1, y, Directions.up],
    ];
  } else {
    return [
      [x, y - 1, Directions.left],
      [x, y + 1, Directions.right],
    ];
  }
};

const reflect = ([x, y, direction], mirror) => {
  let newDirection = direction;
  if (mirror === "/") {
    if (direction === Directions.left) {
      newDirection = Directions.down;
    } else if (direction === Directions.right) {
      newDirection = Directions.up;
    } else if (direction === Directions.down) {
      newDirection = Directions.left;
    } else if (direction === Directions.up) {
      newDirection = Directions.right;
    }
  } else if (mirror === "\\") {
    if (direction === Directions.left) {
      newDirection = Directions.up;
    } else if (direction === Directions.right) {
      newDirection = Directions.down;
    } else if (direction === Directions.down) {
      newDirection = Directions.right;
    } else if (direction === Directions.up) {
      newDirection = Directions.left;
    }
  }
  const [dx, dy] = newDirection;
  return [x + dx, y + dy, newDirection];
};

const getKey = ([x, y]) => `${x}_${y}`;
const getBeamKey = ([x, y, [dx, dy]]) => `${x}_${y}_${dx}_${dy}`;

main();
