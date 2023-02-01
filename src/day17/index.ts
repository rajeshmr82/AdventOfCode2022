import run from "aocrunner";
import { dir } from "console";

const parseInput = (rawInput: string) => rawInput;
const rocks = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
];

class CaveSystem {
  width: number;
  pattern: string;
  rockIndex: number;
  patternIndex: number;
  caveArea: boolean[][];
  currentRock: number[][] | null;
  peak: number;

  constructor(width: number, pattern: string) {
    this.width = width;
    this.pattern = pattern;
    this.rockIndex = 0;
    this.patternIndex = 0;
    this.caveArea = [];
    this.currentRock = null;
    this.peak = -1;
  }

  generateRock() {
    const rock = rocks[this.rockIndex++ % rocks.length];
    let peak = this.getPeak();
    if (peak !== -1) {
      peak--;
    }

    const rockHeight = Math.max(...rock.map(([, y]) => y)) + 1;
    const rockY = rockHeight + peak + 3;
    const insertRows = rockY - this.caveArea.length + 1;

    for (let i = 0; i < insertRows; i++) {
      this.caveArea.push(Array(this.width).fill(false));
    }

    this.currentRock = rock.map(([x, y]) => [x + 2, rockY - y]);
  }

  moveRock(dx: number, dy: number) {
    if (this.currentRock == null) return;

    this.currentRock.forEach((point) => {
      point[0] += dx;
      point[1] += dy;
    });
  }

  dropNRocks(rockCount: number) {
    let rocksAtRest = 0;
    while (rocksAtRest++ < rockCount) {
      this.dropRock();
    }
  }

  dropRock() {
    this.generateRock();

    let atRest = false;
    while (!atRest) {
      const direction =
        this.pattern[this.patternIndex++ % this.pattern.length] === "<"
          ? -1
          : 1;

      if (
        this.currentRock?.every(
          ([x, y]) =>
            x + direction >= 0 &&
            x + direction < this.width &&
            this.caveArea[y][x + direction] !== undefined &&
            !this.caveArea[y][x + direction],
        )
      ) {
        this.moveRock(direction, 0);
      }

      if (
        this.currentRock?.every(
          ([x, y]) => y - 1 > -1 && !this.caveArea[y - 1][x],
        )
      ) {
        this.moveRock(0, -1);
      } else {
        atRest = true;
      }
    }

    this.currentRock?.forEach(([x, y]) => (this.caveArea[y][x] = true));
    this.peak = Math.max(
      this.peak,
      Math.max(...(this.currentRock?.map(([, y]) => y) || [])),
    );
  }

  getPeak() {
    return this.peak + 1;
  }

  dropUntilPattern(maxCount: number) {
    const map = new Map<string, { rocks: number; height: number }>();
    for (let rockCount = 0; rockCount < maxCount; rockCount++) {
      let key = `${this.rockIndex % rocks.length},${
        this.patternIndex % this.pattern.length
      }`;
      this.dropRock();
      const state = { rocks: rockCount, height: this.getPeak() };
      if (rockCount > this.pattern.length * rocks.length && map.has(key)) {
        let rocksInCycle = state.rocks - map.get(key)?.rocks;
        let heightOfCycle = state.height - map.get(key)?.height;
        const cycles = Math.floor((maxCount - rockCount) / rocksInCycle);

        return {
          rocks: rockCount + rocksInCycle * cycles,
          height: heightOfCycle * cycles,
        };
      }

      map.set(key, state);
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const cave = new CaveSystem(7, input);
  cave.dropNRocks(2022);
  return cave.getPeak();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const cave = new CaveSystem(7, input);
  const ROCK_COUNT = 1000000000000;
  const pattern = cave.dropUntilPattern(ROCK_COUNT);

  cave.dropNRocks(ROCK_COUNT - pattern?.rocks);

  return pattern?.height + cave.getPeak() - 1;
};

const testInput = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 3068,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1514285714288,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
