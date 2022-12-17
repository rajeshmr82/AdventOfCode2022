import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((l) => l.split(" -> ").map((l) => l.split(",").map(Number)));

const placeRocks = (lines: number[][][], rocks: Set<unknown>) => {
  let maxY = 0,
    maxX = 0,
    minX = Infinity;
  lines.forEach((line) => {
    for (let i = 0; i < line.length - 1; i++) {
      const [x1, y1] = line[i];
      const [x2, y2] = line[i + 1];

      const startX = Math.min(x1, x2);
      const startY = Math.min(y1, y2);
      const endX = Math.max(x1, x2);
      const endY = Math.max(y1, y2);
      maxY = Math.max(maxY, endY);
      maxX = Math.max(maxX, endX);
      minX = Math.min(minX, startX);
      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          rocks.add([x, y].toString());
        }
      }
    }
  });
  return { maxY, minX, maxX };
};

const dropSand = (maxY: number, rocks: Set<unknown>, hasFloor = false) => {
  let x = 500,
    y = 0;

  let sand = 0;
  while (true) {
    if (rocks.has([x, y].toString())) {
      x = 500;
      y = 0;
    }
    if (y > maxY && !hasFloor) {
      break;
    }

    if (!rocks.has([x, y + 1].toString()) && y < maxY + 1) {
      y++;
      continue;
    }
    if (!rocks.has([x - 1, y + 1].toString()) && y < maxY + 1) {
      x--;
      y++;
      continue;
    }

    if (!rocks.has([x + 1, y + 1].toString()) && y < maxY + 1) {
      x++;
      y++;
      continue;
    }

    sand++;
    rocks.add([x, y].toString());

    if (x == 500 && y == 0) break;
  }
  return sand;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const rocks = new Set();
  let { maxY } = placeRocks(lines, rocks);
  let sand = dropSand(maxY, rocks);

  return sand;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const rocks = new Set();
  let { maxY, minX, maxX } = placeRocks(lines, rocks);
  let sand = dropSand(maxY, rocks, true);
  return sand;
};

const testInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 93,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
