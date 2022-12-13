import run from "aocrunner";
import { log } from "console";

interface Monkey {
  id: number;
  items: number[];
  operation: Function;
  divisor: number;
  throwIfTrue: number;
  throwIfFalse: number;
  inspected: number;
}

class Monkey {
  id: number;
  items: number[];
  divisor: number = 1;
  trueIndex: number;
  falseIndex: number;
  operation: Function | void;
  inspected: number;
  modulo: number;
  constructor(
    id: number,
    items: number[],
    operation: Function,
    divisor: number,
    trueIndex: number,
    falseIndex: number,
    modulo: number,
  ) {
    this.id = id;
    this.items = items;
    this.operation = operation;
    this.divisor = divisor;
    this.trueIndex = trueIndex;
    this.falseIndex = falseIndex;
    this.inspected = 0;
    this.modulo = modulo;
  }
  test(worryLevel: number) {
    return worryLevel % this.divisor === 0 ? this.trueIndex : this.falseIndex;
  }

  inspectItem(mul: number) {
    this.inspected++;
    const worryLevel =
      Math.floor(this.operation(this.items.shift()) / this.modulo) % mul;

    return { monkey: this.test(worryLevel), worryLevel };
  }
}

const parseInput = (rawInput: string, modulo: number = 3) =>
  rawInput.split("\n\n").map((line) => {
    const [id, items, op, test, trueIndex, falseIndex] = line.split("\n");

    return new Monkey(
      Number((id.match(/(\d+)/g) ?? [])[0]),
      (items.match(/(\d+)/g) ?? []).map(Number),
      (old: number) => eval(op.slice(19).replace(/old/g, String(old))),
      Number((test.match(/(\d+)/g) ?? [])[0]),
      Number((trueIndex.match(/(\d+)/g) ?? [])[0]),
      Number((falseIndex.match(/(\d+)/g) ?? [])[0]),
      modulo,
    );
  });

const rounds = (n: number, monkeys: Monkey[]) => {
  const mul = monkeys.reduce((acc, item) => acc * item.divisor, 1);
  while (n-- > 0) {
    monkeys.forEach((m) => {
      while (m.items.length > 0) {
        const { monkey, worryLevel } = m.inspectItem(mul);
        monkeys[monkey].items.push(worryLevel);
      }
    });
  }
};

const part1 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);
  rounds(20, monkeys);

  return monkeys
    .map((monkey) => monkey.inspected)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((a, b) => a * b);
};

const part2 = (rawInput: string) => {
  const monkeys = parseInput(rawInput, 1);
  rounds(10000, monkeys);
  return monkeys
    .map((monkey) => monkey.inspected)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((a, b) => a * b);
};

const testInput = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  onlyTests: true,
});
