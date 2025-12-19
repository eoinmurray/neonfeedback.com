import * as Plot from "@observablehq/plot";
import type { Boid } from './types';

export interface MakePlotOptions {
  chartWidth: number;
  chartHeight: number;
  width: number;
  height: number;
  tidyHotzoneMap: Array<{ x: number; y: number; value: number }>;
  boidState: Boid[];
  predatorState: Boid[];
}

export const makePlot = ({
  chartWidth,
  chartHeight,
  width,
  height,
  tidyHotzoneMap,
  boidState,
  predatorState
}: MakePlotOptions): Plot.Plot => {
  return Plot.plot({
    width: chartWidth,
    height: chartHeight,
    document,
    padding: 0,
    marks: [
      Plot.raster(tidyHotzoneMap, {
        width: chartWidth / 10,
        height: chartHeight / 10,
        x: "x",
        y: "y",
        fill: "value"
      }),
      Plot.vector(boidState, {
        x: "x",
        y: "y",
        rotate: (b: Boid) => (Math.atan2(b.vx, b.vy) * 180) / Math.PI,
        length: (b: Boid) => Math.hypot(b.vx, b.vy),
        stroke: "white",
        strokeWidth: 2
      }),
      Plot.vector(predatorState, {
        x: "x",
        y: "y",
        rotate: (b: Boid) => (Math.atan2(b.vx, b.vy) * 180) / Math.PI,
        length: (b: Boid) => Math.hypot(b.vx, b.vy),
        stroke: "red",
        strokeWidth: 5
      })
    ],
    x: { domain: [0, width], nice: false },
    y: { domain: [0, height], nice: false }
  });
};
