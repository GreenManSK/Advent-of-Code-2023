const { getInput } = require("./helpers/input-loader");
const mr = require("multi-integer-range");

// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  console.log("2:", await solve2(input));
};

const prepareInput = (content) => {
  content = content.split("\n").map((line) => parseLine(line));
  const seeds = content[0]
    .replace("seeds: ", "")
    .split(" ")
    .map((n) => +n);
  const maps = [];

  for (let i = 2; i < content.length; i++) {
    const map = { name: content[i].replace(" map:", ""), ranges: [] };

    for (i = i + 1; i < content.length && content[i] !== ""; i++) {
      map.ranges.push(content[i].split(" ").map((n) => +n));
    }

    maps.push(map);
  }

  return { seeds, maps };
};

const parseLine = (line) => {
  return line.trim();
};

const solve1 = ({ seeds, maps }) => {
  const locations = [];
  for (const seed of seeds) {
    locations.push(mapSeed(seed, maps));
  }
  return Math.min(...locations);
};

const solve2 = async ({ seeds, maps }) => {
  const seedRanges = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push(mr.parse(`${seeds[i]}-${seeds[i] + seeds[i + 1] - 1}`));
  }
  maps = maps.map((map) => {
    map.ranges = map.ranges.map(([d, s, l]) => [
      d,
      mr.parse(`${s}-${s + l - 1}`),
      l,
    ]);
    return map;
  });

  let currentRanges = seedRanges;
  for (const map of maps) {
    const newRanges = [];
    for (const range of currentRanges) {
      mapRange(range, map).forEach((n) => newRanges.push(n));
    }
    currentRanges = newRanges;
  }

  return Math.min(...currentRanges.flat().flat());
};

const mapSeed = (seed, maps) => {
  let current = seed;

  for (const map of maps) {
    const range = map.ranges.find(
      ([_, source, len]) => source <= current && current <= source + len
    );
    if (range) {
      const [dest, source] = range;
      current = dest + (current - source);
    }
  }

  return current;
};

const mapRange = (seedRange, { ranges: mapRanges }) => {
  const mappedRanges = [];
  for (const [dest, mapRange, len] of mapRanges) {
    const intersection = mr.intersect(seedRange, mapRange);
    if (intersection.length > 0) {
      seedRange = mr.subtract(seedRange, intersection);
      const source = mapRange[0][0];
      mappedRanges.push(
        intersection.map(([s, e]) => [dest + s - source, dest + e - source])
      );
    }
  }

  if (seedRange.length > 0) mappedRanges.push(seedRange);

  return mappedRanges;
};

main();
