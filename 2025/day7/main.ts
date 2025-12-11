import { full as data, example } from "./input";

function countSplits(grid: string[]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  
  let startRow = -1;
  let startCol = -1;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 'S') {
        startRow = r;
        startCol = c;
        break;
      }
    }
    if (startRow !== -1) break;
  }
  
  if (startRow === -1) return 0;
  
  let splits = 0;
  const visited = new Set<string>();
  const queue: [number, number][] = [[startRow, startCol]];
  
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    
    if (visited.has(key)) continue;
    visited.add(key);
    
    if (grid[r][c] === '^') {
      splits++;
      
      if (c > 0) {
        queue.push([r, c - 1]);
      }
      if (c < cols - 1) {
        queue.push([r, c + 1]);
      }
    } else {
      const nextRow = r + 1;
      if (nextRow < rows) {
        queue.push([nextRow, c]);
      }
    }
  }
  
  return splits;
}

function part2(grid: string[]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  let startRow = -1;
  let startCol = -1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 'S') {
        startRow = r;
        startCol = c;
        break;
      }
    }
    if (startRow !== -1) break;
  }

  if (startRow === -1) return 0;

  const memo: number[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(-1)
  );

  function countTimelines(r: number, c: number): number {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      return 1;
    }

    if (memo[r][c] !== -1) return memo[r][c];

    const cell = grid[r][c];
    let total = 0;

    if (cell === '^') {
      let hasMove = false;

      if (c > 0) {
        total += countTimelines(r, c - 1);
        hasMove = true;
      }
      if (c < cols - 1) {
        total += countTimelines(r, c + 1);
        hasMove = true;
      }

      if (!hasMove) {
        total = 1;
      }
    } else {
      const nextRow = r + 1;
      if (nextRow < rows) {
        total = countTimelines(nextRow, c);
      } else {
        total = 1;
      }
    }

    memo[r][c] = total;
    return total;
  }

  return countTimelines(startRow, startCol);
}

const grid = data.trim().split('\n');

// Part 1
// const result = countSplits(grid);
// console.log(result);

// Part 2
const result2 = part2(grid);
console.log(result2);
