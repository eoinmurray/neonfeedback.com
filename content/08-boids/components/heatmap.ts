import { type Hotzone } from './types.js';

export function generateHeatmap(width: number, height: number, gaussians: Hotzone[]): Float32Array {
  const map = new Float32Array(width * height);
  const gaussParams = gaussians.map(g => {
    const invSigmaX2 = 1 / (2 * g.sigma_x * g.sigma_x);
    const invSigmaY2 = 1 / (2 * g.sigma_y * g.sigma_y);
    return { ...g, invSigmaX2, invSigmaY2 };
  });

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let sumValue = 0;
      for (let i = 0; i < gaussParams.length; i++) {
        const { x: hx, y: hy, strength, invSigmaX2, invSigmaY2 } = gaussParams[i];
        const dx = x - hx;
        const dy = y - hy;
        sumValue += strength * Math.exp(-(dx * dx * invSigmaX2 + dy * dy * invSigmaY2));
      }
      map[y * width + x] = sumValue;
    }
  }

  const total = map.reduce((sum, val) => sum + val, 0);
  if (total > 0) {
    const invTotal = 1 / total;
    for (let i = 0; i < map.length; i++) {
      map[i] *= invTotal;
    }
  }
  return map;
}
