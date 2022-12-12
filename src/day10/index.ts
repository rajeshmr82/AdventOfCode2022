import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

class CPU {
  private register: number;
  private cycle: number;
  private signals = new Map();
  private screen: string = "";
  constructor() {
    this.register = 1;
    this.cycle = 0;
  }

  process(input: string[]) {
    const recordSignal = () => {
      const pos = (this.cycle % 40) - 1;
      this.screen += Math.abs(pos - this.register) <= 1 ? "*" : " ";

      if (this.cycle === 20 || (this.cycle - 20) % 40 === 0)
        this.signals.set(this.cycle, this.register);
    };

    input.forEach((line) => {
      const [instr, param] = line.split(" ");

      switch (instr) {
        case "noop":
          this.cycle++;
          recordSignal();
          break;
        case "addx":
          for (let i = 0; i < 2; i++) {
            this.cycle++;
            recordSignal();
          }
          this.register += Number(param);

          break;
        default:
          break;
      }
    });
  }

  getSignals() {
    let result = 0;
    this.signals.forEach((value: number, key: number) => {
      result += value * key;
    });

    return result;
  }

  printSignal() {
    console.log(this.screen.match(/.{1,40}/g));
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const system = new CPU();
  system.process(input);

  return system.getSignals();
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const system = new CPU();
  system.process(input);
  system.printSignal();
  return;
};

const testInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
