import { example, full } from './input.ts';

function countAccessible(gridStr: string): number {
  const grid = gridStr.split('\n').filter(row => row.length > 0);
  const H = grid.length;
  if (H === 0) return 0;
  const W = grid[0].length;
  let count = 0;
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      if (grid[i][j] !== '@') continue;
      let neighbors = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di, nj = j + dj;
          if (ni >= 0 && ni < H && nj >= 0 && nj < W && grid[ni][nj] === '@') neighbors++;
        }
      }
      if (neighbors < 4) count++;
    }
  }
  return count;
}

console.log('Example:', countAccessible(example));
console.log('Full:', countAccessible(full));
