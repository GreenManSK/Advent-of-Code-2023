const { getInput } = require("./helpers/input-loader");
const { Grid } = require("./helpers/grid");
// global.useTest = true;

const main = async () => {
  const input = await getInput().then(prepareInput);
  console.log("1:", solve1(input));
  //   console.log("2:", solve2(input));
};

const prepareInput = (content) =>
  content.split("\n").map((line) => parseLine(line));

const parseLine = (line) => {
  return line
    .trim()
    .split("")
    .map((n) => +n);
};

const Directions = {
  left: [0, -1],
  right: [0, 1],
  up: [-1, 0],
  down: [1, 0],
};
const defaultStraight = 2;

const solve1 = (grid) => {
  const graph = buildGraph(grid);

  const starts = graph.filter(
    (point) =>
      point.x === 0 &&
      point.y === 0 &&
      point.straight === 3 &&
      [Directions.right, Directions.down].indexOf(point.direction) !== -1
  );

  const ends = graph
    .map((point, index) => ({
      index,
      isEnd: isEnd([point.x, point.y], grid),
    }))
    .filter(({ isEnd }) => isEnd)
    .map(({ index }) => index);

  let minHeat = Infinity;
  for (const start of starts) {
    const distances = dijkstra(graph, start);
    for (const end of ends) {
      minHeat = Math.min(minHeat, distances[end]);
    }
  }
  return minHeat;
};

const solve2 = (grid) => {
  return grid;
};

const dirs = [
  Directions.left,
  Directions.right,
  Directions.up,
  Directions.down,
];
const buildGraph = (grid) => {
  const nodeMap = new Map();
  const graph = new Set();

  const points = [
    getPoint(0, 0, Directions.right, 3, nodeMap, grid),
    getPoint(0, 0, Directions.down, 3, nodeMap, grid),
  ];

  while (points.length) {
    const point = points.shift();
    graph.add(point);
    const nexts = getNext(
      point.x,
      point.y,
      point.direction,
      point.straight,
      grid
    );
    for (const next of nexts) {
      const nextPoint = getPoint(
        next[0],
        next[1],
        next[2],
        next[3],
        nodeMap,
        grid
      );
      point.edges.push({
        dest: nextPoint,
        weight: nextPoint.heat,
      });
      if (!graph.has(nextPoint) && points.indexOf(nextPoint) === -1)
        points.push(nextPoint);
    }
  }

  return [...graph.values()];
};

const getPoint = (x, y, direction, straight, nodeMap, grid) => {
  const key = getKey(x, y, direction, straight);
  if (!nodeMap.has(key)) {
    const point = { x, y, straight, direction, edges: [], heat: grid[x][y] };
    nodeMap.set(key, point);
  }
  return nodeMap.get(key);
};

const isEnd = ([x, y], grid) => {
  return x === grid.length - 1 && y === grid[0].length - 1;
};

const getNext = (x, y, direction, straight, grid) => {
  const next = [];
  if (straight > 0) {
    next.push([x + direction[0], y + direction[1], direction, straight - 1]);
  }
  let newDirections = [];
  if (direction === Directions.left || direction === Directions.right) {
    newDirections = [Directions.up, Directions.down];
  } else {
    newDirections = [Directions.left, Directions.right];
  }
  newDirections.forEach((dir) =>
    next.push([x + dir[0], y + dir[1], dir, defaultStraight])
  );
  return next.filter((point) => Grid.isInGrid(grid, point));
};

const getKey = (x, y, [dx, dy], straight) =>
  `${x}_${y}_${dx}_${dy}_${straight}`;

function dijkstra(graph, source) {
  const V = graph.length;
  const indeces = new Map();
  for (const index in graph) {
    indeces.set(graph[index], index);
  }
  let distance = [];
  let visited = [];

  for (let i = 0; i < V; i++) {
    distance.push(Infinity);
    visited.push(false);
  }

  const startIndex = indeces.get(source);
  distance[startIndex] = 0;

  for (let i = 0; i < V - 1; i++) {
    const u = getMinDistanceVertex(distance, visited);
    visited[u] = true;

    for (const edge of graph[u].edges) {
      const v = indeces.get(edge.dest);
      const weight = edge.weight;
      if (
        !visited[v] &&
        distance[u] !== Infinity &&
        distance[u] + weight < distance[v]
      ) {
        distance[v] = distance[u] + weight;
      }
    }
  }

  // If you want to calculate distance from source to
  // a particular target, you can return
  // distance[target]
  return distance;
}

function getMinDistanceVertex(distance, visited) {
  let minDistance = Infinity;
  let minIndex = -1;

  for (let i = 0; i < distance.length; i++) {
    if (!visited[i] && distance[i] <= minDistance) {
      minDistance = distance[i];
      minIndex = i;
    }
  }

  return minIndex;
}

main();
