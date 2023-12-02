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
  const [game, cubes] = line.split(": ");
  const id = +game.replace("Game ", "");
  return {
    id,
    cubes: cubes.split(";").map((set) =>
      set
        .trim()
        .split(", ")
        .map((n) => {
          const [number, color] = n.split(" ");
          return { number: +number, color: color.trim() };
        })
    ),
  };
};

const solve1 = (input) => {
  const isValid = ({ cubes }) => {
    const limits = new Map([
      ["red", 12],
      ["green", 13],
      ["blue", 14],
    ]);
    for (const { number, color } of cubes.flat()) {
      if (number > limits.get(color)) return false;
    }
    return true;
  };
  return input
    .filter(isValid)
    .map((n) => n.id)
    .reduce((a, b) => a + b, 0);
};

const solve2 = (input) => {
  const getPower = ({ cubes }) => {
    const mins = new Map([
      ["red", 0],
      ["blue", 0],
      ["green", 0],
    ]);
    for (const set of cubes) {
      for (const { number, color } of set) {
        mins.set(color, Math.max(mins.get(color), number));
      }
    }
    return [...mins.values()].reduce((a, b) => a * b, 1);
  };
  return input.map(getPower).reduce((a, b) => a + b, 0);
};

main();
