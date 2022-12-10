import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((i) => i.split(" "));

const getTailVisited = (input: string[][], ropeLength: number) => {
  const moves: { [key: string]: number } = { U: 1, D: -1, R: 1, L: -1 };
  let rope = new Array(ropeLength).fill().map((m) => [0, 0]);
  const visited = new Set();

  const getMove = (distX: number) => {
    return distX >= 1 ? 1 : distX <= -1 ? -1 : 0;
  };

  input.forEach((move) => {
    const [dir, dist] = move;
    for (let i = 0; i < Number(dist); i++) {
      switch (dir) {
        case "R":
        case "L":
          rope[0][0] += moves[dir];
          break;
        case "U":
        case "D":
          rope[0][1] += moves[dir];
          break;
        default:
          break;
      }
      for (var j = 1; j <= rope.length - 1; j++) {
        const [distX, distY] = distance(rope[j - 1], rope[j]);
        if (distX >= 2 || distX <= -2 || distY >= 2 || distY <= -2) {
          rope[j][0] += getMove(distX);
          rope[j][1] += getMove(distY);
        }
      }
      const tail = rope.at(-1);
      visited.add(`${tail[0]},${tail[1]}`);
    }
  });
  return visited;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return getTailVisited(input, 2).size;
};

const distance = (head: number[], tail: number[]) => {
  return [head[0] - tail[0], head[1] - tail[1]];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return getTailVisited(input, 10).size;
};

const testInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
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
        input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
