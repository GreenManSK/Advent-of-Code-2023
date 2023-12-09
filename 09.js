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
  return line
    .trim()
    .split(" ")
    .map((n) => +n);
};

const solve1 = (input) => {
  return input.map(extrapolateNext1).reduce((a, b) => a + b, 0);
};

const solve2 = (input) => {
  return input.map(extrapolateNext2).reduce((a, b) => a + b, 0);
};

const extrapolateNext1 = (sequence) => {
  const sequences = [sequence];
  while (sequences[sequences.length - 1].some((n) => n !== 0)) {
    const newSequence = [];
    const currentSequence = sequences[sequences.length - 1];

    for (let i = 1; i < currentSequence.length; i++) {
      newSequence.push(currentSequence[i] - currentSequence[i - 1]);
    }

    sequences.push(newSequence);
  }

  let next = 0;
  for (let i = sequences.length - 2; i >= 0; i--) {
    const currentSequence = sequences[i];
    next = next + currentSequence[currentSequence.length - 1];
  }

  return next;
};

const extrapolateNext2 = (sequence) => {
  const sequences = [sequence];
  while (sequences[sequences.length - 1].some((n) => n !== 0)) {
    const newSequence = [];
    const currentSequence = sequences[sequences.length - 1];

    for (let i = 1; i < currentSequence.length; i++) {
      newSequence.push(currentSequence[i] - currentSequence[i - 1]);
    }

    sequences.push(newSequence);
  }

  let next = 0;
  for (let i = sequences.length - 2; i >= 0; i--) {
    const currentSequence = sequences[i];
    next = currentSequence[0] - next;
  }

  return next;
};

main();
