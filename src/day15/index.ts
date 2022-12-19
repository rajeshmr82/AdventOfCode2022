import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => (line.match(/(-?\d+)/g) ?? []).map(Number))
    .map(([Sx, Sy, Bx, By]) => ({
      Sx,
      Sy,
      Bx,
      By,
      distance: Math.abs(Sx - Bx) + Math.abs(Sy - By),
    }));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const y = 10;
  const possible = new Set();
  let result = 0;
  input.forEach((pos) => {
    const { Sx, Sy, Bx, By, distance } = pos;
    if (Sy === y) possible.add(Sx);
    if (By === y) possible.add(Bx);

    for (let x = Sx - distance; x <= Sx + distance; x++) {
      if (!possible.has(x) && Math.abs(Sx - x) + Math.abs(Sy - y) <= distance) {
        possible.add(x);
        result++;
      }
    }
  });
  return result;
};

const part2 = (rawInput: string) => {
  const sensorData = parseInput(rawInput);
  const MAX = 4000000;

  const possible = (x: number, y: number) =>
    sensorData.every(
      ({ Sx, Sy, distance }) => Math.abs(Sx - x) + Math.abs(Sy - y) > distance,
    );

  for (const { Sx, Sy, distance } of sensorData) {
    for (let dx = 0; dx < distance + 2; dx++) {
      const dy = distance + 1 - dx;
      for (const [xo, yo] of [
        [-1, 1],
        [1, -1],
        [-1, -1],
        [1, 1],
      ]) {
        const x = Sx + dx * xo;
        const y = Sy + dy * yo;

        if (!(x >= 0 && x <= MAX && y > 0 && y <= MAX)) continue;
        if (possible(x, y)) return x * 4000000 + y;
      }
    }
  }
};

const testInput = `
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
