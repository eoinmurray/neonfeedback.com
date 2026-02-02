import type { Boid } from "./types.js";

export function buildSpatialGrid(
  entities: Boid[],
  width: number,
  height: number,
  cellSize: number
) {
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const grid: number[][][] = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => [])
  );
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    const col = Math.min(cols - 1, Math.max(0, Math.floor(e.x / cellSize)));
    const row = Math.min(rows - 1, Math.max(0, Math.floor(e.y / cellSize)));
    grid[col][row].push(i);
  }
  return { grid, cellSize, cols, rows };
}

