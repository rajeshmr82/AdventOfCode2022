import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n\n").map((l) => l.split("\n").map((p) => JSON.parse(p)));

const compare = (left: any, right: any): number => {
  if (left === undefined) return -1;
  if (right === undefined) return 1;
  if (left === right) return 0;
  if (typeof left === "number" && typeof right === "number")
    return left - right;
  if (typeof left === "number" && Array.isArray(right))
    return compare([left], right);
  if (typeof right === "number" && Array.isArray(left))
    return compare(left, [right]);

  const len = Math.max(left.length, right.length);
  let i = 0;
  while (i < len) {
    const result = compare(left[i], right[i]);
    if (result !== 0) {
      return result;
    }
    i++;
  }

  return 0;
};
const part1 = (rawInput: string) => {
  const pairs = parseInput(rawInput);
  return pairs.reduce((acc, [left, right], index) => {
    return compare(left, right) <= 0 ? acc + index + 1 : acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const pairs = parseInput(rawInput);

  const ordered = pairs
    .concat([[[2]], [[6]]])
    .flat()
    .sort(compare);

  return (
    (ordered.findIndex((p) => JSON.stringify(p) === JSON.stringify([2])) + 1) *
    (ordered.findIndex((p) => JSON.stringify(p) === JSON.stringify([6])) + 1)
  );
};

const testInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 140,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
