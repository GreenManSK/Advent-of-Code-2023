const { getInput } = require("./helpers/input-loader");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  console.log("2:", solve2(input));
};

const prepareInput = (content) => {
  const lines = content.split("\n").map((line) => parseLine(line));
  const patterns = [[]];

  for (const line of lines) {
    if (line.length > 0) {
      patterns[patterns.length - 1].push(line);
    } else {
      patterns.push([]);
    }
  }

  return patterns;
};

const parseLine = (line) => {
  return line.trim().split("");
};

const solve1 = (input) => {
  return input.map(findReflectionNumber).reduce((a, b) => a + b, 0);
};

const solve2 = (input) => {
  return input.map(findSmudgedReflectionNumber).reduce((a, b) => a + b, 0);
};

const findSmudgedReflectionNumber = (pattern) => {
  const baseReflection = findReflectionNumber(pattern);

  for (const x in pattern) {
    for (const y in pattern[x]) {
      pattern[x][y] = pattern[x][y] === "#" ? "." : "#";

      const reflection = findReflectionNumber(pattern, baseReflection);
      if (reflection !== -1) {
        return reflection;
      }
      pattern[x][y] = pattern[x][y] === "#" ? "." : "#";
    }
  }
  return -1;
};

const printPattern = (pattern) => pattern.map((n) => n.join("")).join("\n");

const findReflectionNumber = (pattern, ignoreValue = -1) => {
  // horizont
  for (let i = 0; i < pattern.length - 1; i++) {
    let isReflection = true;
    for (let d = 0; pattern[i - d] && pattern[i + d + 1]; d++) {
      const x1 = i - d;
      const x2 = i + d + 1;
      for (let y = 0; y < pattern[x1].length; y++) {
        if (pattern[x1][y] !== pattern[x2][y]) {
          isReflection = false;
          break;
        }
      }
      if (!isReflection) break;
    }
    const reflection = 100 * (i + 1);
    if (isReflection && ignoreValue != reflection) {
      return 100 * (i + 1);
    }
  }

  // vertical
  for (let i = 0; i < pattern[0].length - 1; i++) {
    let isReflection = true;
    for (let d = 0; pattern[0][i - d] && pattern[0][i + d + 1]; d++) {
      const y1 = i - d;
      const y2 = i + d + 1;
      for (let x = 0; x < pattern.length; x++) {
        if (pattern[x][y1] !== pattern[x][y2]) {
          isReflection = false;
          break;
        }
      }
      if (!isReflection) break;
    }
    const reflection = i + 1;
    if (isReflection && ignoreValue != reflection) {
      return i + 1;
    }
  }

  return -1;
};

main();
