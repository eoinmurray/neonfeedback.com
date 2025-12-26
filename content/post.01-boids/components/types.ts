export interface Hotzone {
  x: number;
  y: number;
  sigma_x: number;
  sigma_y: number;
  strength: number;
}

export interface Config {
  width: number;
  height: number;
  hotzones: Hotzone[];
  numBoids: number;
  numPredators: number;
  maxSpeed: number;
  perceptionRadius: number;
  minSeparation: number;
  maxForce: number;
  fleeRadius: number;
  fleeStrength: number;
  attractionStrength?: number;
  predatorMaxSpeed: number;
  predatorPerceptionRadius: number;
  predatorMaxForce: number;
  predatorHuntRadius: number;
  predatorMinSeparation: number;
}

export interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface CaughtFish {
  time: number;
  count: number;
  cumulative: number;
}

export interface SimulationState {
  boidState: Boid[];
  predatorState: Boid[];
  hotzoneMap: Float32Array;
  tidyHotzoneMap: Array<{ x: number; y: number; value: number }>;
  tickCount: number;
  caughtFishData: CaughtFish[];
}
