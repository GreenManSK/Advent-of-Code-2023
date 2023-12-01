const path = require("path");
const { readFile } = require("fs/promises");

const getInput = () => {
  const currentFilePath = process.argv[1];
  const currentDay = path.basename(currentFilePath).replace(/\..*?$/, "");
  return readFile(
    `inputs/${global.useTest ? "test/" : ""}${currentDay}.txt`,
    "utf8"
  );
};

module.exports = { getInput };
