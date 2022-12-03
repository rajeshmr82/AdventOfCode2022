import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const commonItem = (sacks: string[]) => {
  const items: string[][] = sacks.map((sack) => [...new Set([...sack])]);

  return items
    .shift()
    .filter((v) => {
      return items.every((a) => {
        return a.indexOf(v) !== -1;
      });
    })
    .map((badge) => priority.indexOf(badge) + 1);
};

const priority = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .map((items) => {
      const [compartment1, compartment2] = items.match(
        new RegExp(".{1," + items.length / 2 + "}", "g"),
      );

      return commonItem([compartment1, compartment2]);
    })
    .flat()
    .reduce((acc, curr) => acc + curr, 0);
};

const elvesToGroups = (sacks: string[], groupSize: number) => {
  const groups = [];
  while (sacks.length > 0) {
    const chunk = sacks.splice(0, groupSize);
    groups.push(chunk);
  }
  return groups;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const groups = elvesToGroups(input, 3);

  return groups
    .map((elves) => commonItem(elves))
    .flat()
    .reduce((acc, curr) => acc + curr, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw        
        `,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw          
        `,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
