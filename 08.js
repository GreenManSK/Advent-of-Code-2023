const { getInput } = require("./helpers/input-loader");
const { GreenMath } = require("./helpers/math");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  console.log("2:", solve2(input));
};

const prepareInput = (content) => {
  const lines = content.split("\n").map((line) => parseLine(line));
  const network = new Map(
    lines.slice(2).map((line) => {
      const nodes = line
        .replaceAll(/(?: = \(|\)|, )/g, " ")
        .trim()
        .split(" ");
      return [nodes[0], [nodes[1], nodes[2]]];
    })
  );

  return {
    lr: lines[0].split(""),
    network,
  };
};

const parseLine = (line) => {
  return line.trim();
};

const solve1 = ({ lr, network }) => {
  let steps = 0;
  let current = "AAA";
  while (current !== "ZZZ") {
    const nextStep = lr[steps % lr.length];
    if (!network.get(current)) return undefined;
    current = network.get(current)[nextStep === "L" ? 0 : 1];
    steps++;
  }
  return steps;
};

const solve2 = ({ lr, network }) => {
  let currents = [...network.keys()].filter((n) => n.endsWith("A"));
  const starts = [...currents];
  const fromStart = new Map();

  let steps = 0;
  while (fromStart.size !== currents.length) {
    const nextStep = lr[steps % lr.length];
    currents = currents.map((current, index) => {
      const newCurrent = network.get(current)[nextStep === "L" ? 0 : 1];
      if (newCurrent.endsWith("Z") && !fromStart.get(starts[index])) {
        fromStart.set(starts[index], [newCurrent, steps]);
      }
      return newCurrent;
    });
    steps++;
  }

  const returnPeriods = new Map();
  let periodSteps = 0;
  while (
    returnPeriods.size !== currents.length ||
    [...returnPeriods.values()].some((n) => n.length < 2)
  ) {
    const nextStep = lr[steps % lr.length];
    currents = currents.map((current, index) => {
      const newCurrent = network.get(current)[nextStep === "L" ? 0 : 1];
      if (newCurrent.endsWith("Z")) {
        const currentPeriods = returnPeriods.get(starts[index]) ?? [];
        returnPeriods.set(starts[index], [...currentPeriods, periodSteps]);
      }
      return newCurrent;
    });
    periodSteps++;
    steps++;
  }

  return [...returnPeriods.values()]
    .map((n) => n[1] - n[0])
    .reduce((a, b) => GreenMath.lcm(a, b), 1);
};

const allAtTheEnd = (currents) => currents.every((n) => n.endsWith("Z"));

main();
