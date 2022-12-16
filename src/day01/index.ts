import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let calories = tabulate(input);

  return calories.reduce((a, b) => Math.max(a, b), -Infinity);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let calories = tabulate(input);
  calories.sort((a, b) => a - b);
  return calories.slice(-3).reduce((a, b) => a + b);
};

run({
  part1: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
function tabulate(input: string[]) {
  let calories = [];
  let elfIndex = 0;
  calories.push(0);
  for (const element of input) {
    if (element.length == 0) {
      elfIndex++;
      calories.push(0);
    } else {
      calories[elfIndex] += Number(element);
    }
  }
  return calories;
}
