const { getInput } = require("./helpers/input-loader");
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
  input = expandGalaxy(input);
  const galaxies = [];
  for (const x in input) {
    for (const y in input[x]) {
      if (input[x][y] === "#") {
        galaxies.push([+x, +y]);
      }
    }
  }

  return computeDistances(galaxies);
};

const solve2 = (input) => {
  const expansionRate = 1000000;

  const galaxies = [];
  for (const x in input) {
    for (const y in input[x]) {
      if (input[x][y] === "#") {
        galaxies.push([+x, +y]);
      }
    }
  }

  const { emptyHorizontals, emptyVerticals } = findEmpties(input);

  for (let i = emptyHorizontals.length - 1; i >= 0; i--) {
    const x = emptyHorizontals[i];
    for (const galaxy of galaxies) {
      if (galaxy[0] > x) {
        galaxy[0] += expansionRate - 1;
      }
    }
  }

  for (let i = emptyVerticals.length - 1; i >= 0; i--) {
    const y = emptyVerticals[i];
    for (const galaxy of galaxies) {
      if (galaxy[1] > y) {
        galaxy[1] += expansionRate - 1;
      }
    }
  }

  return computeDistances(galaxies);
};

const computeDistances = (galaxies) => {
  let distances = 0;
  for (let i = 0; i < galaxies.length; i++) {
    const [x1, y1] = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const [x2, y2] = galaxies[j];
      distances += Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
  }
  return distances;
};

const expandGalaxy = (input) => {
  const { emptyHorizontals, emptyVerticals } = findEmpties(input);

  input = input.map((n) => n.map((x) => x));

  for (let i = emptyHorizontals.length - 1; i >= 0; i--) {
    const emptyLine = [...new Array(input[0].length)].map(() => ".");
    input.splice(emptyHorizontals[i], 0, emptyLine);
  }

  for (let i = emptyVerticals.length - 1; i >= 0; i--) {
    const y = emptyVerticals[i];
    for (const line of input) {
      line.splice(y, 0, ".");
    }
  }

  return input;
};

const findEmpties = (input) => {
  const emptyHorizontals = input
    .map((line, index) => [index, line.filter((n) => n === "#").length])
    .filter(([_, n]) => n === 0)
    .map(([index]) => index);
  const emptyVerticals = [];
  for (let y = 0; y < input[0].length; y++) {
    let isEmpty = true;
    for (let x = 0; x < input.length; x++) {
      if (input[x][y] === "#") {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) {
      emptyVerticals.push(y);
    }
  }
  return { emptyHorizontals, emptyVerticals };
};

const printUniverse = (input) =>
  console.log(input.map((n) => n.join("")).join("\n"));

main();
