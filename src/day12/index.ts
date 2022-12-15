import run from "aocrunner";
import { log } from "console";

const parseInput = (rawInput: string) => {
  return rawInput
    .split("\n")
    .map((l) => l.split("").map((c) => c.charCodeAt(0)));
};

const searchValue = (array: number[][], searchValue: number) => {
  return array.reduce((acc, current, index) => {
    if (acc) return acc;
    const innerIndex = current.findIndex((val) => val === searchValue);
    return innerIndex !== -1 ? [innerIndex, index] : null;
  }, null);
};

const searchAll = (array: number[][], searchValue: number) => {
  let indices: [number, number][] = [];

  array.forEach((row, i) => {
    let j = row.findIndex((value) => value === searchValue);
    if (j !== -1) {
      indices.push([j, i]);
      while (j !== -1) {
        const rest = row.slice(j + 1);
        const k = rest.findIndex((value) => value === searchValue);
        if (k !== -1) {
          indices.push([j + k + 1, i]);
          j += k + 1;
        } else {
          break;
        }
      }
    }
  });

  return indices;
};

const solve = (
  heightmap: number[][],
  start: [number, number],
  end: [number, number],
) => {
  const w = heightmap[0].length;
  const h = heightmap.length;
  const queue = [start];
  const distances = new Map();
  const visited = new Set();
  distances.set(start.toString(), 0);
  while (queue.length > 0) {
    const current = queue.shift() || [0, 0];

    if (visited.has(current.toString())) continue;

    visited.add(current.toString());
    const distance = distances.get(current.toString());
    if (current.toString() == end.toString()) return distance;
    const [x, y] = current;

    for (const [x2, y2] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]) {
      if (x2 >= 0 && x2 < w && y2 >= 0 && y2 < h) {
        if (heightmap[y2][x2] <= heightmap[y][x] + 1) {
          distances.set([x2, y2].toString(), distance + 1);
          queue.push([x2, y2]);
        }
      }
    }
  }

  return -1;
};

const part1 = (rawInput: string) => {
  const heightmap = parseInput(rawInput);
  const start = searchValue(heightmap, 83);
  const end = searchValue(heightmap, 69);
  heightmap[start[1]][start[0]] = 97;
  heightmap[end[1]][end[0]] = 122;

  const dist = solve(
    heightmap,
    start as [number, number],
    end as [number, number],
  );

  return dist;
};

const part2 = (rawInput: string) => {
  const heightmap = parseInput(rawInput);
  const start = searchValue(heightmap, 83);
  const end = searchValue(heightmap, 69);
  heightmap[start[1]][start[0]] = 97;
  heightmap[end[1]][end[0]] = 122;
  const mins = searchAll(heightmap, 97);
  const distances = mins.map((s) =>
    solve(heightmap, s as [number, number], end as [number, number]),
  );
  return distances
    .filter((d) => d > -1)
    .reduce((acc, value) => Math.min(acc, value), Infinity);
};

const testInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 29,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
