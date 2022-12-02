import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

enum points {
  A = 1,
  X = 1,
  B = 2,
  Y = 2,
  C = 3,
  Z = 3,
}

enum evaluate {
  "X-C" = 6,
  "Y-A" = 6,
  "Z-B" = 6,
  "X-A" = 3,
  "Y-B" = 3,
  "Z-C" = 3,
  "X-B" = 0,
  "Y-C" = 0,
  "Z-A" = 0,
}

const getScore = (values: string): number => {
  const [elf, player] = values.split(" ");
  return points[player] + evaluate[`${player}-${elf}`];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .map((strategy) => getScore(strategy))
    .reduce((sum, current) => sum + current, 0);
};

const evaluatePlay: { [key: string]: { [key: string]: string } } = {
  X: { A: "C", B: "A", C: "B" },
  Y: { A: "A", B: "B", C: "C" },
  Z: { A: "B", B: "C", C: "A" },
};

enum pointsByResult {
  X = 0,
  Y = 3,
  Z = 6,
}

const getScoreByResult = (values: string): number => {
  const [elf, result] = values.split(" ");

  return points[evaluatePlay[result][elf]] + pointsByResult[result];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .map((strategy) => getScoreByResult(strategy))
    .reduce((sum, current) => sum + current, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
A Y
B X
C Z
        `,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
A Y
B X
C Z        
        `,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
