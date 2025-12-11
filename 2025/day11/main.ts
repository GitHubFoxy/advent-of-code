import { full as example } from './full.ts';


function parseInput(input: string): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  const lines = input.trim().split('\n');
  for (const line of lines) {
    const [name, outputs] = line.split(': ');
    const destinations = outputs.split(' ');
    graph.set(name, destinations);
  }
  return graph;
}

function countPaths(graph: Map<string, string[]>, start: string, end: string): number {
  const visited = new Set<string>();
  
  function dfs(node: string): number {
    if (node === end) {
      return 1;
    }
    if (visited.has(node)) {
      return 0;
    }
    
    visited.add(node);
    let total = 0;
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      total += dfs(neighbor);
    }
    visited.delete(node);
    return total;
  }
  
  return dfs(start);
}

function countPathsWithRequired(graph: Map<string, string[]>, start: string, end: string, required: string[]): number {
  const requiredIndex = new Map<string, number>();
  required.forEach((r, i) => requiredIndex.set(r, i));
  const memo = new Map<string, number>();
  
  function dfs(node: string, mask: number): number {
    if (node === end) {
      const allVisited = mask === ((1 << required.length) - 1);
      return allVisited ? 1 : 0;
    }
    
    const key = `${node}|${mask}`;
    if (memo.has(key)) {
      return memo.get(key)!;
    }
    
    let total = 0;
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      let newMask = mask;
      if (requiredIndex.has(neighbor)) {
        const bit = 1 << requiredIndex.get(neighbor)!;
        newMask |= bit;
      }
      total += dfs(neighbor, newMask);
    }
    
    memo.set(key, total);
    return total;
  }
  
  return dfs(start, 0);
}

function solvePart1(input: string): number {
  const graph = parseInput(input);
  return countPaths(graph, 'you', 'out');
}

function solvePart2(input: string): number {
  const graph = parseInput(input);
  return countPathsWithRequired(graph, 'svr', 'out', ['dac', 'fft']);
}

const result1 = solvePart1(example);
console.log(`Part 1 example result: ${result1}`);

const result2 = solvePart2(example);
console.log(`Part 2 example result: ${result2}`);
