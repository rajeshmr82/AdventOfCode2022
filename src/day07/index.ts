import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const ROOT = "/";
const MOVE_OUT = "..";

const createFolderContents = (input: string[]) => {
  const fileSystem: { [key: string]: number } = {};
  let currentPath: string[] = [];

  const processCommand = (line: string) => {
    const [type, command, param] = line.split(" ");
    if (command === "cd") {
      if (param === ROOT) {
        currentPath = [ROOT];
        fileSystem[ROOT] = 0;
      } else if (param === MOVE_OUT) {
        currentPath.pop();
      } else {
        currentPath.push(param);
        fileSystem[param] = 0;
      }
    } else if (/\d/.test(type)) {
      currentPath.forEach((folder) => {
        fileSystem[folder] += parseInt(type);
      });
    }
  };

  input.forEach((line: string) => {
    processCommand(line);
  });

  return fileSystem;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const fileSystem = createFolderContents(input);

  return Object.values(fileSystem)
    .filter((size) => size <= 100000)
    .reduce((acc, size) => acc + size, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const fileSystem = createFolderContents(input);
  const totalSize = fileSystem[ROOT];

  const unUsed = 70000000 - totalSize;
  const delta = 30000000 - unUsed;
  const result = Object.values(fileSystem)
    .filter((size) => size >= delta)
    .sort((a, b) => a - b);

  return result[0];
};

const testInput = `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});
