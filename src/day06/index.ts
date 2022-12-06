import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let index = 4; index < input.length; index++) {
    if (new Set(Array.from(input.substring(index - 4, index))).size === 4)
      return index;
  }

  return 0;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let index = 14; index < input.length; index++) {
    if (new Set(Array.from(input.substring(index - 14, index))).size === 14)
      return index;
  }

  return 0;
};

run({
  part1: {
    tests: [
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
