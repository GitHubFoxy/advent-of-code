import { full, example } from "./input";

function part1(raw: string): bigint {
  const lines = raw.trimEnd().split("\n");
  if (lines.length === 0) return 0n;

  const height = lines.length;
  const width = Math.max(...lines.map((l) => l.length));
  const grid = lines.map((l) => l.padEnd(width, " "));

  let total = 0n;

  let col = 0;
  const isBlankColumn = (c: number): boolean => {
    for (let r = 0; r < height; r++) {
      if (grid[r][c] !== " ") return false;
    }
    return true;
  };

  while (col < width) {
    if (isBlankColumn(col)) {
      col++;
      continue;
    }

    const startCol = col;
    while (col < width && !isBlankColumn(col)) {
      col++;
    }
    const endCol = col - 1;

    const opRow = height - 1;
    let op: "+" | "*" | null = null;
    for (let c = startCol; c <= endCol; c++) {
      const ch = grid[opRow][c];
      if (ch === "+" || ch === "*") {
        op = ch;
        break;
      }
    }
    if (!op) continue;

    const numbers: bigint[] = [];
    for (let r = 0; r < opRow; r++) {
      const slice = grid[r].slice(startCol, endCol + 1);
      const digits = slice.replace(/[^0-9]/g, "");
      if (digits.length === 0) continue;
      numbers.push(BigInt(digits));
    }

    if (numbers.length === 0) continue;

    let value: bigint;
    if (op === "+") {
      value = 0n;
      for (const n of numbers) value += n;
    } else {
      value = 1n;
      for (const n of numbers) value *= n;
    }

    total += value;
  }

  return total;
}

function part2(raw: string): bigint {
  const lines = raw.trimEnd().split("\n");
  if (lines.length === 0) return 0n;

  const height = lines.length;
  const width = Math.max(...lines.map((l) => l.length));
  const grid = lines.map((l) => l.padEnd(width, " "));

  let total = 0n;

  let col = 0;
  const isBlankColumn = (c: number): boolean => {
    for (let r = 0; r < height; r++) {
      if (grid[r][c] !== " ") return false;
    }
    return true;
  };

  while (col < width) {
    if (isBlankColumn(col)) {
      col++;
      continue;
    }

    const startCol = col;
    while (col < width && !isBlankColumn(col)) {
      col++;
    }
    const endCol = col - 1;

    const opRow = height - 1;
    let op: "+" | "*" | null = null;
    for (let c = startCol; c <= endCol; c++) {
      const ch = grid[opRow][c];
      if (ch === "+" || ch === "*") {
        op = ch;
        break;
      }
    }
    if (!op) continue;

    const numbers: bigint[] = [];
    for (let c = endCol; c >= startCol; c--) {
      let digits = "";
      for (let r = 0; r < opRow; r++) {
        const ch = grid[r][c];
        if (ch >= "0" && ch <= "9") {
          digits += ch;
        }
      }
      if (digits.length === 0) continue;
      numbers.push(BigInt(digits));
    }

    if (numbers.length === 0) continue;

    let value: bigint;
    if (op === "+") {
      value = 0n;
      for (const n of numbers) value += n;
    } else {
      value = 1n;
      for (const n of numbers) value *= n;
    }

    total += value;
  }

  return total;
}

function main() {
  const example1 = part1(example);
  console.log("Example part1:", example1.toString());

  const example2 = part2(example);
  console.log("Example part2:", example2.toString());

  const full1 = part1(full);
  console.log("Part 1:", full1.toString());

  const full2 = part2(full);
  console.log("Part 2:", full2.toString());
}

if ((import.meta as any).main) {
  main();
}
