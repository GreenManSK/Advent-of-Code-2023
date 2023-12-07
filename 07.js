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
  const [hand, bid] = line.trim().split(" ");
  return {
    hand: hand.split(""),
    bid: +bid,
  };
};

const HandType = {
  FiveOfKind: 6,
  FourOfKind: 5,
  FullHouse: 4,
  ThreeOfKind: 3,
  TwoPair: 2,
  OnePair: 1,
  HighCard: 0,
};

const solve1 = (input) => {
  return solve(input, getKind1, getCardRank1);
};

const solve2 = (input) => {
  return solve(input, getKind2, getCardRank2);
};

const solve = (input, getKind, getCardRank) => {
  return input
    .sort((a, b) => compareHands(a, b, getKind, getCardRank))
    .map(({ bid }, index) => bid * (index + 1))
    .reduce((a, b) => a + b, 0);
};

const getKind1 = (hand) => {
  const counts = new Map();
  hand.forEach((card) => counts.set(card, (counts.get(card) ?? 0) + 1));
  if (counts.size === 1) {
    return HandType.FiveOfKind;
  }
  const countsOrdered = [...counts.values()].sort().reverse();
  if (countsOrdered[0] === 4) {
    return HandType.FourOfKind;
  }
  if (countsOrdered[0] === 3 && countsOrdered[1] == 2) {
    return HandType.FullHouse;
  }
  if (countsOrdered[0] === 3) {
    return HandType.ThreeOfKind;
  }
  if (countsOrdered[0] === 2 && countsOrdered[1] == 2) {
    return HandType.TwoPair;
  }
  if (countsOrdered[0] === 2) {
    return HandType.OnePair;
  }
  return HandType.HighCard;
};

const getKind2 = (hand) => {
  return Math.max(
    ...["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2"].map(
      (replacement) => {
        const newHand = hand.map((h) => (h === "J" ? replacement : h));
        return getKind1(newHand);
      }
    )
  );
};

const getCardRank1 = (card) =>
  ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]
    .reverse()
    .indexOf(card);

const getCardRank2 = (card) =>
  ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"]
    .reverse()
    .indexOf(card);

const compareHands = (
  { hand: handA },
  { hand: handB },
  getKind,
  getCardRank
) => {
  const kindA = getKind(handA);
  const kindB = getKind(handB);
  if (kindA === kindB) {
    for (let i = 0; i < handA.length; i++) {
      const rankA = getCardRank(handA[i]);
      const rankB = getCardRank(handB[i]);
      if (rankA > rankB) {
        return 1;
      } else if (rankA < rankB) {
        return -1;
      }
    }
    return 0;
  }
  return kindA > kindB ? 1 : -1;
};

main();
