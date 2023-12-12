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
  const [groups, counts] = line.trim().split(" ");
  return {
    groups: groups.split(""),
    counts: counts.split(",").map((n) => +n),
  };
};

const solve1 = (input) => {
  const cache = new Map();
  return input
    .map(({ groups, counts }) => countArrangements(0, groups, counts, cache))
    .reduce((a, b) => a + b, 0);
};

const solve2 = (input) => {
  const newInput = input.map(({ groups, counts }) => {
    let newGroups = [];
    let newCounts = [];

    for (let i = 0; i < 5; i++) {
      newGroups = [...newGroups, ...groups];
      if (i !== 4) {
        newGroups.push("?");
      }
      newCounts = [...newCounts, ...counts];
    }

    return { groups: newGroups, counts: newCounts };
  });
  const cache = new Map();

  return newInput
    .map(({ groups, counts }) => countArrangements(0, groups, counts, cache))
    .reduce((a, b) => a + b, 0);
};

const countArrangements = (index, group, counts, cache) => {
  if (index === group.length) {
    const result = getCountKey(getCounts(group)) == getCountKey(counts) ? 1 : 0;
    return result;
  }

  if (group[index] !== "?") {
    if (group[index] === ".") {
      const prev = [],
        next = [];
      for (let i = 0; i < group.length; i++) {
        if (i <= index) {
          prev.push(group[i]);
        } else {
          next.push(group[i]);
        }
      }
      const prevCounts = getCounts(prev);
      const nextCounts = [...counts];
      for (let i = 0; i < prevCounts.length; i++) {
        nextCounts[i] = nextCounts[i] - prevCounts[i];
        if (nextCounts[i] !== 0) return 0;
      }

      while (nextCounts[0] === 0) {
        nextCounts.shift();
      }

      const key = getKey(next, nextCounts);
      if (!cache.has(key)) {
        cache.set(key, countArrangements(0, next, nextCounts, cache));
        // cache.set(key, countArrangements(index + 1, group, counts, cache));
      }

      return cache.get(key);
    } else {
      return countArrangements(index + 1, group, counts, cache);
    }
  }
  let result = 0;

  group[index] = "#";
  if (canBeValid(index, group, counts))
    result += countArrangements(index + 1, group, counts, cache);

  group[index] = ".";
  if (canBeValid(index, group, counts))
    result += countArrangements(index, group, counts, cache);

  group[index] = "?";

  return result;
};

const canBeValid = (index, group, counts) => {
  const subCounts = getCounts(group, index);
  for (let i = 0; i < subCounts.length; i++) {
    if (counts[i] !== subCounts[i]) {
      if (i === subCounts.length - 1) {
        return subCounts[i] < counts[i];
      }
      return false;
    }
  }
  return true;
};

const getCounts = (group, upToIndex = -1) => {
  const counts = [0];
  upToIndex = upToIndex === -1 ? group.length - 1 : upToIndex;

  for (const index in group) {
    if (+index > upToIndex) {
      break;
    }
    const char = group[index];
    if (char === ".") {
      if (counts[counts.length - 1]) {
        counts.push(0);
      }
    } else if (char === "#") {
      counts[counts.length - 1] = (counts[counts.length - 1] ?? 0) + 1;
    }
  }

  if (!counts[counts.length - 1]) counts.pop();

  return counts;
};

// const countArrangements = (index, groups, counts, cache) => {
//   const key = getKey(groups, counts);
//   // console.log(index, key);
//   if (cache.has(key)) {
//     return cache.get(key);
//   }
//   const [currentCount, ...restCounts] = counts;
//   if (currentCount === 0) {
//     return countArrangements(index, groups, restCounts, cache);
//   }
//   if (index >= groups.length) {
//     return counts.length === 0 ? 1 : 0;
//   }

//   const currentChar = groups[index];
//   if (counts.length === 0) {
//     return groups.filter((char, i) => i >= index && char === "#").length === 0
//       ? 1
//       : 0;
//   }

//   let result = 0;
//   if (currentChar === ".") {
//     result = countArrangements(index + 1, groups, counts, cache);
//   } else if (currentChar === "#") {
//     result = computeNextAfterDamaged(
//       index,
//       groups,
//       currentCount,
//       restCounts,
//       cache
//     );
//   } else {
//     groups[index] = "#";
//     result += computeNextAfterDamaged(
//       index,
//       [...groups],
//       currentCount,
//       restCounts,
//       cache
//     );
//     groups[index] = ".";
//     result += countArrangements(
//       index + 1,
//       [...groups],
//       [currentCount, ...restCounts],
//       cache
//     );
//   }

//   cache.set(key, result);
//   return result;
// };

// const computeNextAfterDamaged = (
//   index,
//   groups,
//   currentCount,
//   restCounts,
//   cache
// ) => {
//   const nextChar = groups[index + 1];
//   if (currentCount - 1 === 0 && (nextChar !== "." || nextChar !== undefined)) {
//     if (nextChar === "#") {
//       return 0;
//     } else {
//       groups[index + 1] = ".";
//       return countArrangements(index + 1, groups, restCounts, cache);
//     }
//   } else {
//     currentCount -= 1;
//     while (currentCount > 0) {
//       const nextChar = groups[index + 1];
//       if (nextChar === ".") {
//         return 0;
//       }
//       groups[index + 1] = "#";
//       index += 1;
//       currentCount -= 1;
//     }
//     if (groups[index + 1] === "#") {
//       return 0;
//     } else if (groups[index + 1] === "?") {
//       groups[index + 1] = ".";
//     }
//     return countArrangements(
//       index + 1,
//       groups,
//       [currentCount, ...restCounts],
//       cache
//     );
//   }
// };

const getKey = (groups, counts) => `${groups.join("")} ${getCountKey(counts)}`;

const getCountKey = (counts) => counts.join(",");

main();
