import { full as input } from "./input";

// Parse input into list of points
const points = input
  .trim()
  .split(/\n+/)
  .map((line) => {
    const [x, y, z] = line.split(",").map((n) => Number(n.trim()));
    return { x, y, z };
  });

if (points.length < 2) {
  console.log(0);
  process.exit(0);
}

interface Edge {
  d: number; // squared distance
  i: number;
  j: number;
}

class DSU {
  parent: number[];
  size: number[];
  components: number;
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
    this.components = n;
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a: number, b: number): boolean {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    this.components--;
    return true;
  }
}

// Generate every edge once, then sort ascending by distance
function buildSortedEdges(): Edge[] {
  const edges: Edge[] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const { x: xi, y: yi, z: zi } = points[i];
    for (let j = i + 1; j < n; j++) {
      const { x: xj, y: yj, z: zj } = points[j];
      const dx = xi - xj;
      const dy = yi - yj;
      const dz = zi - zj;
      const dist2 = dx * dx + dy * dy + dz * dz;
      edges.push({ d: dist2, i, j });
    }
  }
  edges.sort((a, b) => a.d - b.d);
  return edges;
}

const edges = buildSortedEdges();

function part1(): number {
  const K = 1000;
  const dsu = new DSU(points.length);
  for (let idx = 0; idx < edges.length && idx < K; idx++) {
    const { i, j } = edges[idx];
    dsu.union(i, j);
  }

  const compSizes: Record<number, number> = {};
  for (let i = 0; i < points.length; i++) {
    const r = dsu.find(i);
    compSizes[r] = (compSizes[r] ?? 0) + 1;
  }

  const topThree = Object.values(compSizes)
    .sort((a, b) => b - a)
    .slice(0, 3);
  while (topThree.length < 3) topThree.push(1);

  return topThree.reduce((acc, v) => acc * v, 1);
}

function part2(): number {
  const dsu = new DSU(points.length);
  let lastEdge: Edge | null = null;
  for (const e of edges) {
    if (dsu.union(e.i, e.j)) {
      lastEdge = e;
      if (dsu.components === 1) break;
    }
  }
  if (!lastEdge) return 0;
  const { i, j } = lastEdge;
  return points[i].x * points[j].x;
}

console.log(part1());
console.log(part2());
