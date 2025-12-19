
export const config = {
  width: 100,
  height: 100,
  numBoids: 500,
  numPredators: 3,
  perceptionRadius: 4,
  predatorPerceptionRadius: 8,
  predatorHuntRadius: 3,
  maxSpeed: 0.2,
  predatorMaxSpeed: 0.3,
  maxForce: 0.4,
  predatorMaxForce: 0.4,
  minSeparation: 2,
  predatorMinSeparation: 2,
  attractionStrength: 0.2,
  fleeRadius: 3.5,
  fleeStrength: 5,
  hotzones: [
    { x: 0, y: 50, sigma_x: 2, sigma_y: 200, strength: -0.1 },
    { x: 75, y: 75, sigma_x: 10, sigma_y: 10, strength: 1 },
    { x: 25, y: 25, sigma_x: 10, sigma_y: 10, strength: 1 },
  ]
};
