import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const parseDrawing = (stackLine: string, drawing: string[]) => {
  const stacks: { [key: string]: string[] } = {};

  stackLine.match(/(\d+)/g)?.forEach((stack) => (stacks[Number(stack)] = []));

  const regex = /\d+/g;
  let match;
  let stackIndices: { [key: string]: number } = {};
  while ((match = regex.exec(stackLine))) {
    stackIndices[match[0]] = match.index;
  }

  for (let index = drawing.length - 1; index >= 0; index--) {
    Object.keys(stackIndices).forEach((key) => {
      if (drawing[index].charAt(stackIndices[key]) != " ") {
        stacks[key].push(drawing[index].charAt(stackIndices[key]));
      }
    });
  }

  return stacks;
};

const prepareInput = (input: string[]) => {
  const blankLineIndex = input.indexOf("");

  const drawing = input.slice(0, blankLineIndex - 1);
  const instructions = input.slice(blankLineIndex + 1);

  let stacks = parseDrawing(input[blankLineIndex - 1], drawing);
  return { instructions, stacks };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let { instructions, stacks } = prepareInput(input);

  for (const element of instructions) {
    const instructionValues = element.match(/\d+/g) || [];
    const [numItems, sourceStack, destStack] = instructionValues.map(Number);

    const source = stacks[sourceStack];
    let destination = stacks[destStack];

    stacks[destStack] = [
      ...destination,
      ...source.splice(source.length - numItems, numItems).reverse(),
    ];
  }

  return getTopStack(stacks);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let { instructions, stacks } = prepareInput(input);

  for (const element of instructions) {
    const instructionValues = element.match(/\d+/g) || [];
    const [numItems, sourceStack, destStack] = instructionValues.map(Number);

    const source = stacks[sourceStack];
    let destination = stacks[destStack];

    stacks[destStack] = [
      ...destination,
      ...source.splice(source.length - numItems, numItems),
    ];
  }

  return getTopStack(stacks);
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2    `,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2    `,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
function getTopStack(stacks: { [key: string]: string[] }) {
  let result = "";
  Object.keys(stacks).forEach((key, index) => {
    result += stacks[key].pop();
  });
  return result;
}
