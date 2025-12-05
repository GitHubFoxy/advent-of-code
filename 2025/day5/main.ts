import { input, test } from "./input";

interface IngredientRange {
  start: number;
  end: number;
}

function parseInputData(data: string): { ranges: IngredientRange[], availableIds: number[] } {
  const lines = data.trim().split('\n');
  
  // Find the separator line (empty line)
  let separatorIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      separatorIndex = i;
      break;
    }
  }
  
  if (separatorIndex === -1) {
    throw new Error('No separator line found in input data');
  }
  
  // Parse ranges (lines before separator)
  const ranges: IngredientRange[] = [];
  for (let i = 0; i < separatorIndex; i++) {
    const line = lines[i].trim();
    if (line) {
      const [startStr, endStr] = line.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      ranges.push({ start, end });
    }
  }
  
  // Parse available IDs (lines after separator)
  const availableIds: number[] = [];
  for (let i = separatorIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const id = parseInt(line, 10);
      availableIds.push(id);
    }
  }
  
  return { ranges, availableIds };
}

function isIdFresh(id: number, ranges: IngredientRange[]): boolean {
  // An ID is fresh if it falls into ANY range
  for (const range of ranges) {
    if (id >= range.start && id <= range.end) {
      return true;
    }
  }
  return false;
}

function countFreshIngredients(inputData: string): number {
  const { ranges, availableIds } = parseInputData(inputData);
  
  let freshCount = 0;
  for (const id of availableIds) {
    if (isIdFresh(id, ranges)) {
      freshCount++;
    }
  }
  
  return freshCount;
}

 // Part 2 helpers: merge ranges and count total coverage
function mergeRanges(ranges: IngredientRange[]): IngredientRange[] {
  if (ranges.length === 0) {
    return [];
  }

  const sorted = [...ranges].sort((a, b) => a.start - b.start);

  const mergedRanges: IngredientRange[] = [];
  let currentRange = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const range = sorted[i];

    // If ranges overlap or are adjacent, merge them
    if (range.start <= currentRange.end + 1) {
      currentRange.end = Math.max(currentRange.end, range.end);
    } else {
      // No overlap, push current range and start new one
      mergedRanges.push(currentRange);
      currentRange = { ...range };
    }
  }

  // Push the last range
  mergedRanges.push(currentRange);

  return mergedRanges;
}

function countIdsInRanges(ranges: IngredientRange[]): number {
  let total = 0;
  for (const range of ranges) {
    total += range.end - range.start + 1;
  }
  return total;
}

// Part 2: Calculate total coverage of all fresh ranges
function part2(): number {
  const { ranges } = parseInputData(input);
  const mergedRanges = mergeRanges(ranges);
  return countIdsInRanges(mergedRanges);
}

// Test with the example from the problem description
console.log('=== PART 1 ===');
console.log('Testing with example data:');
console.log('Example ranges: 3-5, 10-14, 16-20, 12-18');
console.log('Example IDs: 1, 5, 8, 11, 17, 32');
console.log('Expected fresh count: 3 (IDs 5, 11, 17)');

const exampleResult = countFreshIngredients(test);
console.log('Actual result:', exampleResult);
console.log('Test', exampleResult === 3 ? 'PASSED' : 'FAILED');
console.log();

// Now solve the actual puzzle
console.log('Solving the actual puzzle...');
const fullResult = countFreshIngredients(input);
console.log('Total fresh ingredient IDs:', fullResult);
console.log();

console.log('=== PART 2 ===');
console.log('Testing part 2 with example data:');
console.log('Example ranges: 3-5, 10-14, 16-20, 12-18');
console.log('Expected total fresh IDs: 14 (3,4,5,10,11,12,13,14,15,16,17,18,19,20)');

// Test part 2 with example
const examplePart2Ranges = `3-5
10-14
16-20
12-18`;
const examplePart2Result = (() => {
  const ranges: IngredientRange[] = examplePart2Ranges
    .trim()
    .split('\n')
    .map(line => {
      const [start, end] = line.split('-').map(Number);
      return { start, end };
    });

  const mergedRanges = mergeRanges(ranges);
  return countIdsInRanges(mergedRanges);
})();

console.log('Actual result:', examplePart2Result);
console.log('Test', examplePart2Result === 14 ? 'PASSED' : 'FAILED');
console.log();

// Solve the actual Part 2 puzzle
console.log('Solving the actual Part 2 puzzle...');
const part2Result = part2();
console.log('Total fresh ingredient ID coverage:', part2Result);