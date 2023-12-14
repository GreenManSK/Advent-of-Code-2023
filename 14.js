const { getInput } = require("./helpers/input-loader");
const { Grid } = require("./helpers/grid");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  console.log("2:", solve2(input));
};

const prepareInput = (content) =>
  content.split("\n").map((line) => parseLine(line));

const parseLine = (line) => {
  return line.trim().split("");
};

const solve1 = (input) => {
  const inputCopy = [...input.map((n) => [...n])];
  const tilted = tiltNorth(inputCopy);
  return getLoad(tilted);
};

const solve2 = (input) => {
  const cycleDetection = [];
  let cycleStart = -1;
  const iterations = 1000000000;
  for (let i = 0; i < iterations; i++) {
    const before = Grid.printGrid(input);
    if (cycleDetection.indexOf(before) !== -1) {
      cycleStart = cycleDetection.indexOf(before);
      break;
    } else {
      cycleDetection.push(before);
    }
    input = doCycle(input);
  }
  const unrelated = cycleStart;
  const cycleLength = cycleDetection.length - cycleStart;
  const cyclic = iterations - unrelated;
  const final = cycleStart + (cyclic % cycleLength);

  return getLoad(prepareInput(cycleDetection[final]));
};

const doCycle = (input) => {
  input = tiltNorth(input);
  input = tiltWest(input);
  input = tiltSouth(input);
  input = tiltEast(input);
  return input;
};

const getLoad = (grid) => {
  let load = 0;
  for (const x in grid) {
    for (const tile of grid[x]) {
      if (tile === "O") {
        load += grid.length - x;
      }
    }
  }
  return load;
};

const tiltNorth = (grid) => {
  for (const y in grid[0]) {
    let lastEmpty = 0;
    for (let x = 0; x < grid.length; x++) {
      if (grid[x][y] === "#") {
        lastEmpty = x + 1;
      } else if (grid[x][y] === "O") {
        grid[x][y] = ".";
        grid[lastEmpty][y] = "O";
        lastEmpty++;
      }
    }
  }

  return grid;
};

const tiltSouth = (grid) => {
  for (const y in grid[0]) {
    let lastEmpty = grid.length - 1;
    for (let x = grid.length - 1; x >= 0; x--) {
      if (grid[x][y] === "#") {
        lastEmpty = x - 1;
      } else if (grid[x][y] === "O") {
        grid[x][y] = ".";
        grid[lastEmpty][y] = "O";
        lastEmpty--;
      }
    }
  }

  return grid;
};

const tiltWest = (grid) => {
  for (const x in grid) {
    let lastEmpty = 0;
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === "#") {
        lastEmpty = y + 1;
      } else if (grid[x][y] === "O") {
        grid[x][y] = ".";
        grid[x][lastEmpty] = "O";
        lastEmpty++;
      }
    }
  }

  return grid;
};

const tiltEast = (grid) => {
  for (const x in grid) {
    let lastEmpty = grid[x].length - 1;
    for (let y = grid[x].length - 1; y >= 0; y--) {
      if (grid[x][y] === "#") {
        lastEmpty = y - 1;
      } else if (grid[x][y] === "O") {
        grid[x][y] = ".";
        grid[x][lastEmpty] = "O";
        lastEmpty--;
      }
    }
  }

  return grid;
};

main();
