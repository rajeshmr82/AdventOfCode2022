import run from "aocrunner";

const parseInput = (rawInput: string) =>
  new Map(
    rawInput
      .split("\n")
      .map(
        (line) =>
          line.match(
            /Valve ([A-Z]{2}) has flow rate=(\d+); tunnel(s)? lead(s)? to valve(s)? (.*)/,
          ) ?? [],
      )
      .map((groups) => {
        return [
          groups[1],
          {
            flowRate: Number(groups[2]),
            neighbors: groups[6].split(",").map((n) => n.trim()),
          },
        ];
      }),
  );

const getDistance = (
  graph: Map<string, { flowRate: number; neighbors: string[] }>,
  start: string,
  dest: string,
) => {
  let queue = [];
  let visited = [start];

  if (start == dest) return [start];
  queue.push([start]);

  while (queue.length > 0) {
    let path = queue.shift();
    if (path == undefined) continue;
    let current: string = path[path.length - 1];
    for (let neighbor of graph.get(current).neighbors) {
      if (visited.includes(neighbor)) continue;

      if (neighbor == dest) return path.concat([neighbor]);
      visited.push(neighbor);
      queue.push(path.concat([neighbor]));
    }
  }

  return [];
};

const findNextBestValve = (
  graph: Map<string, any>,
  distances: Map<string, Map<string, number>>,
  current: string,
  timeLeft: number,
  valvesThatOpen: string[],
) => {
  let value = 0;

  for (let valve of valvesThatOpen) {
    let time = timeLeft - distances.get(current).get(valve) - 1;
    if (time <= 0) continue;
    let pressure = time * graph.get(valve).flowRate;
    let nextBest = findNextBestValve(
      graph,
      distances,
      valve,
      time,
      valvesThatOpen.filter((v) => v !== valve),
    );
    pressure += nextBest;

    if (pressure > value) {
      value = pressure;
    }
  }

  return value;
};

const getDistanceMap = (
  valves: Map<string, { flowRate: number; neighbors: string[] }>,
) => {
  let distances = new Map();
  valves.forEach((start, skey) => {
    valves.forEach((dest, dkey) => {
      if (!distances.has(skey)) distances.set(skey, new Map());
      distances.get(skey).set(dkey, getDistance(valves, skey, dkey).length - 1);
    });
  });
  return distances;
};

const part1 = (rawInput: string) => {
  const valves = parseInput(rawInput) || new Map();

  let distances = getDistanceMap(valves);

  const valvesThatOpen = Array.from(valves)
    .filter(([key, value]) => value.flowRate > 0)
    .map((v) => v[0]);

  return findNextBestValve(valves, distances, "AA", 30, valvesThatOpen);
};

const findAllPaths = (
  valves: Map<string, { flowRate: number; neighbors: string[] }>,
  distances: Map<string, any>,
  currValve: string,
  timeLeft: number,
  unOpened: any[],
  opened = new Map(),
) => {
  const result = Array.from(opened.keys()).reduce(
    (acc, key) => {
      const keys = [...acc.key.split(","), key]
        .sort()
        .join(",")
        .replace(/^,/, "");
      return {
        key: keys,
        value: acc.value + opened.get(key) * valves.get(key).flowRate,
      };
    },
    { key: "", value: 0 },
  );
  let allPaths = [result];

  unOpened.forEach((valve) => {
    let time = timeLeft - distances.get(currValve).get(valve) - 1;
    if (time < 1) return;

    const currentOpened = new Map(opened);
    currentOpened.set(valve, time);

    const currUnOpened = unOpened.filter((v) => v !== valve);

    const newPaths = findAllPaths(
      valves,
      distances,
      valve,
      time,
      currUnOpened,
      currentOpened,
    );

    allPaths.push(...newPaths);
  });

  return allPaths;
};

const part2 = (rawInput: string) => {
  const valves = parseInput(rawInput) || new Map();

  let distances = getDistanceMap(valves);
  const valvesThatOpen = Array.from(valves)
    .filter(([key, value]) => value.flowRate > 0)
    .map((v) => v[0]);

  const allPaths = findAllPaths(valves, distances, "AA", 26, valvesThatOpen);
  const optimalPaths = allPaths.reduce((acc, path) => {
    acc[path.key] = acc[path.key] || { ...path };

    if (acc[path.key].value < path.value) {
      acc[path.key] = { ...path };
    }

    return acc;
  }, {});

  const highest = Object.keys(optimalPaths).reduce((acc, elf) => {
    const elfPath = elf.split(",");
    Object.keys(optimalPaths).forEach((elephant) => {
      const elephantPath = elephant.split(",");
      const allValves = new Set([...elfPath, ...elephantPath]);
      if (allValves.size === elfPath.length + elephantPath.length) {
        acc = Math.max(
          optimalPaths[elf].value + optimalPaths[elephant].value,
          acc,
        );
      }
    });
    return acc;
  }, -Infinity);

  return highest;
};

const testInput = `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  onlyTests: true,
});
