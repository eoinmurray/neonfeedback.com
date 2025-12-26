// Simulation.ts
import { generateHeatmap } from "./heatmap";
import type { Config, Boid, Vector, SimulationState } from "./types";
import { buildSpatialGrid } from "./spatial-grid";

export class Simulation {
  config: Config;
  state: SimulationState;
  private _removeBoids: Uint8Array;
  private _neighbors: Int32Array;
  private _maxEntities: number;

  constructor(config: Config) {
    this.config = config;
    const hotzoneMap = generateHeatmap(config.width, config.height, config.hotzones);
    const tidyHotzoneMap: Array<{ x: number; y: number; value: number }> = [];

    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        tidyHotzoneMap.push({
          x,
          y,
          value: hotzoneMap[y * config.width + x],
        });
      }
    }

    this._maxEntities = Math.max(config.numBoids, config.numPredators);
    this._removeBoids = new Uint8Array(this._maxEntities);
    this._neighbors = new Int32Array(this._maxEntities);

    this.state = {
      boidState: this.initializeBoidState(),
      predatorState: this.initializePredatorState(),
      hotzoneMap,
      tidyHotzoneMap,
      tickCount: 0,
      caughtFishData: [],
    };
  }

  // dt is the fixed timestep in seconds
  update(dt: number): void {
    this.state.tickCount++;
    this.updateBoids(dt);
    this.updatePredators(dt);
  }

  private getNeighbors(
    index: number,
    entities: Boid[],
    gridInfo: {
      grid: number[][][];
      cellSize: number;
      cols: number;
      rows: number;
    },
    searchRadius: number
  ): Int32Array | [] {
    let count = 0;
    const { grid, cellSize, cols, rows } = gridInfo;
    const e = entities[index];
    const col = Math.floor(e.x / cellSize);
    const row = Math.floor(e.y / cellSize);

    for (let c = col - 1; c <= col + 1; c++) {
      for (let r = row - 1; r <= row + 1; r++) {
        if (c >= 0 && c < cols && r >= 0 && r < rows) {
          const cellIndices = grid[c][r];
          for (let k = 0; k < cellIndices.length; k++) {
            const idx = cellIndices[k];
            if (idx !== index) {
              const dx = entities[idx].x - e.x;
              const dy = entities[idx].y - e.y;
              if (dx * dx + dy * dy < searchRadius * searchRadius) {
                this._neighbors[count++] = idx;
              }
            }
          }
        }
      }
    }
    return count > 0 ? this._neighbors.subarray(0, count) : [];
  }

  private initializeBoidState(): Boid[] {
    const { numBoids, width, height, maxSpeed } = this.config;
    const boids = new Array<Boid>(numBoids);
    for (let i = 0; i < numBoids; i++) {
      boids[i] = {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() * 2 - 1) * maxSpeed,
        vy: (Math.random() * 2 - 1) * maxSpeed,
      };
    }
    return boids;
  }

  private initializePredatorState(): Boid[] {
    const { numPredators, predatorMaxSpeed } = this.config;
    const preds = new Array<Boid>(numPredators);
    for (let i = 0; i < numPredators; i++) {
      preds[i] = {
        x: 0,
        y: Math.random() * 10,
        vx: (Math.random() * 2 - 1) * predatorMaxSpeed,
        vy: (Math.random() * 2 - 1) * predatorMaxSpeed,
      };
    }
    return preds;
  }

  private limit(vector: Vector, max: number): void {
    const magnitude = Math.hypot(vector.x, vector.y);
    if (magnitude > max) {
      const ratio = max / magnitude;
      vector.x *= ratio;
      vector.y *= ratio;
    }
  }

  private updateBoids(dt: number): void {
    const { boidState, predatorState } = this.state;
    const {
      width,
      height,
      perceptionRadius,
      minSeparation,
      maxForce,
      maxSpeed,
      fleeRadius,
      fleeStrength,
      hotzones,
      attractionStrength = 1,
    } = this.config;

    const cellSize = Math.max(perceptionRadius, fleeRadius);
    const boidGrid = buildSpatialGrid(boidState, width, height, cellSize);

    for (let i = 0; i < boidState.length; i++) {
      const boid = boidState[i];
      let alignment = { x: 0, y: 0 };
      let cohesion = { x: 0, y: 0 };
      let separation = { x: 0, y: 0 };
      let attraction = { x: 0, y: 0 };
      const fleeVec = { x: 0, y: 0 };
      let total = 0;

      const neighbors = this.getNeighbors(i, boidState, boidGrid, perceptionRadius);
      for (let n = 0; n < neighbors.length; n++) {
        const j = neighbors[n];
        const other = boidState[j];
        const dx = boid.x - other.x;
        const dy = boid.y - other.y;
        const distSq = dx * dx + dy * dy;

        // Alignment + cohesion
        alignment.x += other.vx;
        alignment.y += other.vy;
        cohesion.x += other.x;
        cohesion.y += other.y;
        total++;

        // Separation
        if (distSq < minSeparation * minSeparation) {
          const dist = Math.sqrt(distSq) || 0.001;
          separation.x += dx / dist;
          separation.y += dy / dist;
        }
      }

      if (total > 0) {
        alignment.x /= total;
        alignment.y /= total;
        this.limit(alignment, maxForce);

        cohesion.x = (cohesion.x / total - boid.x) / 100;
        cohesion.y = (cohesion.y / total - boid.y) / 100;
        this.limit(cohesion, maxForce);

        separation.x /= total;
        separation.y /= total;
        this.limit(separation, maxForce);
      }

      // Flee from predators
      for (let p = 0; p < predatorState.length; p++) {
        const predator = predatorState[p];
        const dx = boid.x - predator.x;
        const dy = boid.y - predator.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < fleeRadius * fleeRadius) {
          const invDist = 1 / (Math.sqrt(distSq) || 0.001);
          fleeVec.x += dx * invDist;
          fleeVec.y += dy * invDist;
        }
      }
      const fleeMag = Math.hypot(fleeVec.x, fleeVec.y);
      if (fleeMag > 0) {
        fleeVec.x = (fleeVec.x / fleeMag) * fleeStrength;
        fleeVec.y = (fleeVec.y / fleeMag) * fleeStrength;
      }

      // Attraction from hotzones
      for (let h = 0; h < hotzones.length; h++) {
        const { x: hx, y: hy, sigma_x, sigma_y, strength } = hotzones[h];
        const invSigmaX2 = 1 / (sigma_x * sigma_x);
        const invSigmaY2 = 1 / (sigma_y * sigma_y);
        const dx = boid.x - hx;
        const dy = boid.y - hy;
        const exponent = -(dx * dx * invSigmaX2 / 2 + dy * dy * invSigmaY2 / 2);
        const gaussianValue = strength * Math.exp(exponent);
        attraction.x += gaussianValue * (-dx * invSigmaX2);
        attraction.y += gaussianValue * (-dy * invSigmaY2);
      }
      attraction.x *= attractionStrength;
      attraction.y *= attractionStrength;
      this.limit(attraction, maxForce);

      // Apply forces (scaled by dt)
      boid.vx += (alignment.x + cohesion.x + separation.x + attraction.x + fleeVec.x) * dt;
      boid.vy += (alignment.y + cohesion.y + separation.y + attraction.y + fleeVec.y) * dt;

      // Limit speed
      const speed = Math.hypot(boid.vx, boid.vy);
      if (speed > maxSpeed) {
        const ratio = maxSpeed / speed;
        boid.vx *= ratio;
        boid.vy *= ratio;
      }

      // Move
      boid.x += boid.vx * dt;
      boid.y += boid.vy * dt;

      // Wrap
      if (boid.x < 0) boid.x += width;
      if (boid.x > width) boid.x -= width;
      if (boid.y < 0) boid.y += height;
      if (boid.y > height) boid.y -= height;
    }
  }

  private updatePredators(dt: number): void {
    const { predatorState, boidState, tickCount, caughtFishData } = this.state;
    const {
      predatorPerceptionRadius,
      predatorMaxForce,
      predatorMaxSpeed,
      width,
      height,
      predatorHuntRadius,
      predatorMinSeparation,
    } = this.config;

    this._removeBoids.fill(0);
    const predatorGrid = buildSpatialGrid(predatorState, width, height, predatorPerceptionRadius);

    for (let p = 0; p < predatorState.length; p++) {
      const predator = predatorState[p];
      let pursuit = { x: 0, y: 0 };
      let separation = { x: 0, y: 0 };
      let totalPursuit = 0;
      let totalSeparation = 0;

      const neighbors = this.getNeighbors(p, predatorState, predatorGrid, predatorPerceptionRadius);
      for (let n = 0; n < neighbors.length; n++) {
        const otherIndex = neighbors[n];
        const other = predatorState[otherIndex];
        const dx = predator.x - other.x;
        const dy = predator.y - other.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < predatorMinSeparation * predatorMinSeparation) {
          const dist = Math.sqrt(distSq) || 0.001;
          separation.x += dx / dist;
          separation.y += dy / dist;
          totalSeparation++;
        }
      }

      // Check boids
      for (let b = 0; b < boidState.length; b++) {
        const boid = boidState[b];
        const dx = boid.x - predator.x;
        const dy = boid.y - predator.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < predatorPerceptionRadius * predatorPerceptionRadius) {
          pursuit.x += dx;
          pursuit.y += dy;
          totalPursuit++;
        }
        if (distSq < predatorHuntRadius * predatorHuntRadius) {
          this._removeBoids[b] = 1;
        }
      }

      if (totalPursuit > 0) {
        pursuit.x /= totalPursuit;
        pursuit.y /= totalPursuit;
        this.limit(pursuit, predatorMaxForce);
      }
      if (totalSeparation > 0) {
        separation.x /= totalSeparation;
        separation.y /= totalSeparation;
        this.limit(separation, predatorMaxForce);
      }

      // Apply forces (scaled by dt)
      predator.vx += (pursuit.x + separation.x) * dt;
      predator.vy += (pursuit.y + separation.y) * dt;

      // Limit speed
      const speed = Math.hypot(predator.vx, predator.vy);
      if (speed > predatorMaxSpeed) {
        const ratio = predatorMaxSpeed / speed;
        predator.vx *= ratio;
        predator.vy *= ratio;
      }

      // Move
      predator.x += predator.vx * dt;
      predator.y += predator.vy * dt;

      // Wrap
      if (predator.x < 0) predator.x += width;
      if (predator.x > width) predator.x -= width;
      if (predator.y < 0) predator.y += height;
      if (predator.y > height) predator.y -= height;
    }

    // Remove boids in-place
    let caughtCount = 0;
    const newBoids: Boid[] = [];
    for (let i = 0; i < boidState.length; i++) {
      if (this._removeBoids[i] === 1) {
        caughtCount++;
      } else {
        newBoids.push(boidState[i]);
      }
    }

    if (caughtCount > 0) {
      const lastCumulative = caughtFishData.length
        ? caughtFishData[caughtFishData.length - 1].cumulative
        : 0;
      caughtFishData.push({
        time: tickCount,
        count: caughtCount,
        cumulative: lastCumulative + caughtCount,
      });
      this.state.boidState = newBoids;
    }
  }
}
