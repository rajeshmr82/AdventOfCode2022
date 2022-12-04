import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const contained = input.filter((pair) => {
    const [elf1S1, elf1S2, elf2S1, elf2S2] =
      pair
        .match(/(\d+)-(\d+),(\d+)-(\d+)/)
        ?.slice(1, 5)
        .map(Number) || [];
    return (
      (elf1S1 <= elf2S1 && elf1S2 >= elf2S2) ||
      (elf2S1 <= elf1S1 && elf2S2 >= elf1S2)
    );
  });

  return contained.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const overlap = input.filter((pair) => {
    const [elf1S1, elf1S2, elf2S1, elf2S2] = pair
      .match(/(\d+)-(\d+),(\d+)-(\d+)/)
      ?.slice(1, 5)
      .map(Number);
    return elf1S1 <= elf2S2 && elf2S1 <= elf1S2;
  });

  return overlap.length;
};

run({
  part1: {
    tests: [
      {
        input: `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8        
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8           `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
