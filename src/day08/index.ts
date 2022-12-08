import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""));

const findVisiblePoints = (input: string[][]): Set<string> => {
  let visible: Set<string> = new Set();

  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 1; j < input[i].length - 1; j++) {
      let current = Number(input[i][j]);
      // check if element is larger than largest in the same row towards left or right edge
      let left = Math.max(...input[i].slice(0, j));
      let right = Math.max(...input[i].slice(j + 1));
      if (current > left || current > right) {
        visible.add(`${i},${j}`);
      } else {
        // check if element is larger than largest in the same column towards top or bottom edge
        const column = input.map((x) => x[j]);
        let top = Math.max(...column.slice(0, i));
        let bottom = Math.max(...column.slice(i + 1));
        if (current > top || current > bottom) {
          visible.add(`${i},${j}`);
        }
      }
    }
  }
  return visible;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const edges = (input[0].length + (input.length - 2)) * 2;
  const visible = findVisiblePoints(input);

  return edges + visible.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const visible: Set<string> = findVisiblePoints(input);
  const scenicScore = Array.from(visible).map((p) => {
    const [x, y] = p.split(",").map(Number);
    const value = input[x][y];

    const left = [...input[x].slice(0, y)].reverse();
    const right = [...input[x].slice(y + 1)];
    const column = input.map((a) => a[y]);
    const top = [...column.slice(0, x)].reverse();
    const bottom = [...column.slice(x + 1)];
    const leftScore = left.findIndex((number) => number >= value);
    const rightScore = right.findIndex((number) => number >= value);
    const topScore = top.findIndex((number) => number >= value);
    const bottomScore = bottom.findIndex((number) => number >= value);
    const score =
      (leftScore === -1 ? left.length : leftScore + 1) *
      (rightScore === -1 ? right.length : rightScore + 1) *
      (topScore === -1 ? top.length : topScore + 1) *
      (bottomScore === -1 ? bottom.length : bottomScore + 1);
    return score;
  });

  return Math.max(...scenicScore);
};

const testInput = `
30373
25512
65332
33549
35390
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 8,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
