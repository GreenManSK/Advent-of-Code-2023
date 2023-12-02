const fs = require("fs");

// const dayNumber = process.argv[2] ?? new Date().getDate();
const dayNumber = 6;
const dayName = String(dayNumber).padStart(2, "0");
const solutionPath = `${dayName}.js`;

if (fs.existsSync(solutionPath)) {
  return;
}

fs.copyFile(
  "helpers/solution_template.js",
  solutionPath,
  (err) => err && console.log(err)
);
fs.openSync(`inputs/${dayName}.txt`, "w");
fs.openSync(`inputs/test/${dayName}.txt`, "w");
