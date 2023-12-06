const { getInput } = require("./helpers/input-loader");
// global.useTest = true;

const main = async () => {
  const input = await getInput();
  const input1 = prepareInput1(input);
  const input2 = prepareInput2(input);
  console.log("1:", solve(input1));
  console.log("2:", solve([{ duration: input2[0], record: input2[1] }]));
};

const prepareInput1 = (content) => {
  const lines = content.split("\n").map((line) => parseLine(line));
  const races = [];
  for (const index in lines[0]) {
    races.push({
      duration: lines[0][index],
      record: lines[1][index],
    });
  }
  return races;
};

const parseLine = (line) => {
  return line
    .replace(/\w+:\s+/, "")
    .replaceAll(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((n) => +n);
};

const prepareInput2 = (content) => {
  return content.split("\n").map((line) => +parseLine(line).join(""));
};

const solve = (input) => {
  return input.map(getWaysToBeat).reduce((a, b) => a * b);
};

const getWaysToBeat = ({ duration, record }) => {
  let wins = 0;
  for (let chargeTime = 0; chargeTime <= duration; chargeTime++) {
    if (computeDistance(chargeTime, duration) > record) wins++;
  }

  return wins;
};

const computeDistance = (chargeTime, duration) =>
  chargeTime * (duration - chargeTime);

main();
