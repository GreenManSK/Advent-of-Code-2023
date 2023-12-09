const { getInput } = require("./helpers/input-loader");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  //   console.log("2:", solve2(input));
};

const prepareInput = (content) =>
  content.split("\n").map((line) => parseLine(line));

const parseLine = (line) => {
  return line.trim();
};

const solve1 = (input) => {
  return input;
};

const solve2 = (input) => {
  return input;
};

main();
