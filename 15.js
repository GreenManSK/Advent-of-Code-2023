const { getInput } = require("./helpers/input-loader");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  console.log("2:", solve2(input));
};

const prepareInput = (content) =>
  content
    .split("\n")
    .map((line) => parseLine(line))
    .flat();

const parseLine = (line) => {
  return line.trim().split(",");
};

const solve1 = (input) => {
  return input.map(getHash).reduce((a, b) => a + b, 0);
};

const solve2 = (input) => {
  const boxes = [...new Array(256)].map(() => []);
  for (const inst of input) {
    if (inst.indexOf("=") !== -1) {
      const [label, focus] = inst.split("=");
      const hash = getHash(label);
      addToBox(boxes[hash], label, focus);
    } else {
      const [label] = inst.split("-");
      const hash = getHash(label);
      boxes[hash] = boxes[hash].filter(([l]) => l !== label);
    }
  }
  return boxes
    .map((box, index) => computePower(box, index + 1))
    .reduce((a, b) => a + b, 0);
};

const computePower = (box, boxIndex) => {
  return box
    .map(([_, focus], index) => focus * boxIndex * (index + 1))
    .reduce((a, b) => a + b, 0);
};

const getHash = (string) => {
  let hash = 0;
  for (let i of string) {
    hash += i.charCodeAt(0);
    hash *= 17;
    hash %= 256;
  }
  return hash;
};

const addToBox = (box, label, focus) => {
  const existing = box.find(([l]) => l === label);
  if (existing) {
    existing[1] = +focus;
  } else {
    box.push([label, +focus]);
  }
};

main();
