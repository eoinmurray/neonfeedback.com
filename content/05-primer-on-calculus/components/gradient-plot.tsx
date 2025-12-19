'use client'
import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

export default function GradientVectorPlot() {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define the function f(x, y)
    function f(x: any, y: any) {
      return x ** 2 + y ** 2;
    }

    // Define the gradient ∇f(x, y)
    function gradF(x: any, y: any) {
      return [2 * x, 2 * y];
    }

    // Generate a grid of sample points
    const points = [];
    const gridSize = 10;
    const spacing = 2;

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        const [dx, dy] = gradF(x, y);
        points.push({
          x: x,
          y: y,
          u: dx,
          v: dy
        });
      }
    }

    const plot = Plot.plot({
      inset: 10,
      aspectRatio: 1,
      width: 300,
      height: 300,
      // x: { domain: [-gridSize - 1, gridSize + 1] },
      // y: { domain: [-gridSize - 1, gridSize + 1] },
      marks: [
        Plot.vector(points, {
          x: "x",
          y: "y",
          rotate: ({ u, v }) => Math.atan2(u, v) * 180 / Math.PI,
          length: ({ u, v }) => Math.hypot(u, v), // scale down length
          stroke: ({ u, v }) => Math.hypot(u, v)
        })
      ]
    });

    if (plotRef.current) {
      plotRef.current.append(plot);
    }

    return () => plot.remove();
  }, []);

  return <div ref={plotRef}></div>;
}
