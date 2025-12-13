import {example, full} from "./input"

function parseInput(input: string) {
  const lines = input.split('\n');
  const shapes = [];
  const regions = [];
  let i = 0;
  // skip leading empty lines
  while (i < lines.length && lines[i].trim() === '') i++;
  // parse shapes
  while (i < lines.length && /^\d+:/.test(lines[i])) {
    const idx = parseInt(lines[i].slice(0, -1));
    i++;
    const shapeLines = [];
    while (i < lines.length && (lines[i].includes('#') || lines[i].includes('.'))) {
      shapeLines.push(lines[i]);
      i++;
    }
    // convert to boolean grid
    const grid = shapeLines.map(line => line.split('').map(ch => ch === '#'));
    shapes[idx] = grid;
    // skip empty line after shape
    while (i < lines.length && lines[i].trim() === '') i++;
  }
  // parse regions
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '') {
      i++;
      continue;
    }
    const [dim, ...counts] = line.split(/\s+/);
    const [width, length] = dim.slice(0, -1).split('x').map(Number);
    const quantities = counts.map(Number);
    regions.push({ width, length, quantities });
    i++;
  }
  return { shapes, regions };
}

function rotate90(grid: boolean[][]): boolean[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const rotated = Array.from({ length: cols }, () => Array(rows).fill(false));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = grid[r][c];
    }
  }
  return rotated;
}

function reflect(grid: boolean[][]): boolean[][] {
  // vertical flip (mirror over vertical axis)
  return grid.map(row => [...row].reverse());
}

function canonical(grid: boolean[][]): string {
  return grid.map(row => row.map(c => c ? '#' : '.').join('')).join('\n');
}

function generateOrientations(grid: boolean[][]): boolean[][][] {
  const orientations = new Map<string, boolean[][]>();
  function add(g: boolean[][]) {
    const key = canonical(g);
    if (!orientations.has(key)) orientations.set(key, g);
  }
  let current = grid;
  for (let i = 0; i < 4; i++) {
    add(current);
    add(reflect(current));
    current = rotate90(current);
  }
  return Array.from(orientations.values());
}

function solveRegion(width: number, length: number, quantities: number[], shapeOrientations: boolean[][][], shapeSizes: number[]): boolean {
  // shapeOrientations[i] is array of orientation grids for shape i
  // Build pieces list: shape indices
  const pieces: number[] = [];
  let totalCells = 0;
  for (let i = 0; i < quantities.length; i++) {
    for (let j = 0; j < quantities[i]; j++) {
      pieces.push(i);
      totalCells += shapeSizes[i];
    }
  }
  // quick prune: total occupied cells cannot exceed region cells
  if (totalCells > width * length) return false;
  
  // sort pieces by size descending
  pieces.sort((a, b) => shapeSizes[b] - shapeSizes[a]);
  
  const occupied = Array.from({ length: length }, () => Array(width).fill(false));
  
  function backtrack(idx: number): boolean {
    if (idx === pieces.length) return true;
    const shapeIdx = pieces[idx];
    const orientations = shapeOrientations[shapeIdx];
    // try each orientation
    for (const grid of orientations) {
      const h = grid.length;
      const w = grid[0].length;
      // iterate over all possible top-left positions
      for (let r = 0; r <= length - h; r++) {
        for (let c = 0; c <= width - w; c++) {
          // check if fits
          let fits = true;
          for (let dr = 0; dr < h; dr++) {
            for (let dc = 0; dc < w; dc++) {
              if (grid[dr][dc] && occupied[r + dr][c + dc]) {
                fits = false;
                break;
              }
            }
            if (!fits) break;
          }
          if (!fits) continue;
          // place
          for (let dr = 0; dr < h; dr++) {
            for (let dc = 0; dc < w; dc++) {
              if (grid[dr][dc]) occupied[r + dr][c + dc] = true;
            }
          }
          if (backtrack(idx + 1)) return true;
          // remove
          for (let dr = 0; dr < h; dr++) {
            for (let dc = 0; dc < w; dc++) {
              if (grid[dr][dc]) occupied[r + dr][c + dc] = false;
            }
          }
        }
      }
    }
    return false;
  }
  
  return backtrack(0);
}

// Main
console.log('=== Example ===');
const { shapes: exampleShapes, regions: exampleRegions } = parseInput(example);
const exampleShapeOrientations = exampleShapes.map(shape => generateOrientations(shape));
const exampleShapeSizes = exampleShapeOrientations.map(orientations => {
  // number of '#' cells in any orientation (same for all)
  const grid = orientations[0];
  return grid.flat().filter(c => c).length;
});

let exampleCount = 0;
for (const region of exampleRegions) {
  const fits = solveRegion(region.width, region.length, region.quantities, exampleShapeOrientations, exampleShapeSizes);
  console.log(`Region ${region.width}x${region.length} ${region.quantities} fits: ${fits}`);
  if (fits) exampleCount++;
}
console.log('Total regions that fit (example):', exampleCount);

console.log('\n=== Full input ===');
const { shapes: fullShapes, regions: fullRegions } = parseInput(full);
const fullShapeOrientations = fullShapes.map(shape => generateOrientations(shape));
const fullShapeSizes = fullShapeOrientations.map(orientations => {
  const grid = orientations[0];
  return grid.flat().filter(c => c).length;
});

let fullCount = 0;
const start = Date.now();
for (let i = 0; i < fullRegions.length; i++) {
  const region = fullRegions[i];
  const fits = solveRegion(region.width, region.length, region.quantities, fullShapeOrientations, fullShapeSizes);
  if (fits) fullCount++;
  if (i % 10 === 0) console.log(`Processed ${i+1}/${fullRegions.length}, fits ${fullCount} so far`);
}
const end = Date.now();
console.log(`Total regions that fit (full): ${fullCount}`);
console.log(`Time elapsed: ${(end - start) / 1000} seconds`);