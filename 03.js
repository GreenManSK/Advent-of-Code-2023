const { getInput } = require("./helpers/input-loader");
const { Grid } = require("./helpers/grid");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  console.log("2:", solve2(input));
};

const prepareInput = (content) =>
  content.split("\n").map((line) => parseLine(line.trim()));

const parseLine = (line) => {
  return line.split("");
};

const solve1 = (input) => {
  const numbers = findNumbers(input);
  let sum = 0;

  for (const number of numbers) {
    if (number.some((n) => isNextToSymbol(input, n))) {
      sum += getNumber(input, number);
    }
  }

  return sum;
};

const solve2 = (input) => {
  const gears = findGears(input);
  const numbers = findNumbers(input);

  let sum = 0;
  for (const gear of gears) {
    const numberNeighs = new Set();
    Grid.forEachNeigh(input, gear, ({ x, y, value }) => {
      if (!isNaN(value)) {
        numberNeighs.add(findParentNumber(numbers, [x, y]));
      }
    });
    if (numberNeighs.size === 2) {
      sum += [...numberNeighs.values()]
        .map((n) => getNumber(input, n))
        .reduce((a, b) => a * b, 1);
    }
  }
  return sum;
};

const findNumbers = (input) => {
  const numbers = [];
  let currentNumber = [];

  Grid.forEach(input, ({ value, x, y }) => {
    if (isNaN(+value)) {
      if (currentNumber.length) {
        numbers.push(currentNumber);
        currentNumber = [];
      }
    } else {
      currentNumber.push([x, y]);
    }
  });

  if (currentNumber.length) numbers.push(currentNumber);
  return numbers;
};

const findGears = (input) => {
  const gears = [];
  for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[x].length; y++) {
      if (input[x][y] === "*") gears.push([x, y]);
    }
  }
  return gears;
};

const isNextToSymbol = (input, coords) => {
  let result = false;
  Grid.forEachNeigh(input, coords, ({ value }) => {
    if (value !== undefined && value !== "." && isNaN(+value)) {
      result = true;
      return true;
    }
  });
  return result;
};

const getNumber = (input, coords) => {
  return +coords.map(([x, y]) => input[x][y]).reduce((a, b) => a + b, "");
};

const findParentNumber = (numbers, coord) => {
  for (const number of numbers) {
    if (number.findIndex(([x, y]) => x == coord[0] && y === coord[1]) !== -1) {
      return number;
    }
  }
};

main();
