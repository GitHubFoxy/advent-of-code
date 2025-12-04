import { example, full } from './input';

function countTotalRemovable(gridStr: string): number {
  let grid: string[][] = gridStr.split('\n')
    .filter(row => row.length > 0)
    .map(row => row.split(''));
  const H = grid.length;
  const W = grid[0].length;
  let total = 0;
  while (true) {
    const toRemove: [number, number][] = [];
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
        if (neighbors < 4) {
          toRemove.push([i, j]);
        }
      }
    }
    if (toRemove.length === 0) break;
    for (const [i, j] of toRemove) {
      grid[i][j] = '.';
    }
    total += toRemove.length;
  }
  return total;
}

console.log('Example part2:', countTotalRemovable(example));
console.log('Full part2:', countTotalRemovable(full));