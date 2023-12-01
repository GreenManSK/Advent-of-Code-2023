const { getInput } = require("./helpers/input-loader");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  console.log("2:", solve2(input));
};

const prepareInput = (content) => content.split("\n").map((n) => n.trim());

const solve1 = (input) =>
  input
    .map((n) => n.split("").filter((d) => !isNaN(+d)))
    .map((digits) => {
      if (digits.length) return `${digits[0]}${digits[digits.length - 1]}`;
      return 0;
    })
    .map((n) => +n)
    .reduce((a, b) => a + b, 0);

const solve2 = (input) => solve1(input.map((line) => filterDigits(line)));

const digits = [
  ["zero", 0],
  ["one", 1],
  ["two", 2],
  ["three", 3],
  ["four", 4],
  ["five", 5],
  ["six", 6],
  ["seven", 7],
  ["eight", 8],
  ["nine", 9],
];

const filterDigits = (line) => {
  const result = [];
  for (let i = 0; i < line.length; i++) {
    if (!isNaN(+line.charAt(i))) {
      result.push(line.charAt(i));
    } else {
      const substr = line.substr(i);
      for ([name, number] of digits) {
        if (substr.startsWith(name)) {
          result.push(number);
          break;
        }
      }
    }
  }
  return result.join("");
};

main();
