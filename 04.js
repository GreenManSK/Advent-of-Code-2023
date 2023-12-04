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
  const [card, numbers] = line.split(": ");
  const [my, winning] = numbers.split(" | ");

  return {
    id: +card.replace("Card ", ""),
    myNumbers: my
      .trim()
      .replaceAll(/\s+/g, " ")
      .split(" ")
      .map((n) => +n),
    winningNumbers: winning
      .trim()
      .replaceAll(/\s+/g, " ")
      .split(" ")
      .map((n) => +n),
  };
};

const solve1 = (input) => {
  return input.map(computePoints).reduce((a, b) => a + b, 0);
};

const solve2 = (input) => {
  const winningsMap = computeWinningMap(input);
  const counts = [...Array(input.length)].map((n) => 1);
  for (const { id } of input) {
    const currentCount = counts[id - 1];
    for (const winId of winningsMap[id]) {
      counts[winId - 1] += currentCount;
    }
  }
  return counts.reduce((a, b) => a + b, 0);
};

const computePoints = ({ myNumbers, winningNumbers }) => {
  const winningSet = new Set(winningNumbers);
  let points = 0;
  for (const number of myNumbers) {
    if (winningSet.has(number)) {
      if (points === 0) {
        points = 1;
      } else {
        points *= 2;
      }
    }
  }
  return points;
};

const computeWinningMap = (input) => {
  const winningCounts = [];
  for (const { id, myNumbers, winningNumbers } of input) {
    const winningSet = new Set(winningNumbers);
    const wins = myNumbers.filter((n) => winningSet.has(n)).length;
    winningCounts[id] = [...Array(wins).keys()].map((n) => n + id + 1);
  }
  return winningCounts;
};

main();
