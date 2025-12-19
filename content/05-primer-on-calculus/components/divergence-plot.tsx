'use client'
import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

export default function DivergencePlot() {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define the vector field F(x, y)
    function vectorField(x: any, y: any) {
      // Example: a more interesting field
      return [x * x, -y * y];
    }

    // Define the divergence of F(x, y)
    function divergence(x: any, y: any) {
      // div F = d/dx(x^2) + d/dy(-y^2) = 2x - 2y
      return 2 * x - 2 * y;
    }

    // Generate a grid of sample points
    const points = [];
    const gridSize = 10;
    const spacing = 1;

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        points.push({
          x: x,
          y: y,
          divergence: divergence(x, y)
        });
      }
    }

    console.log(points);

    const plot = Plot.plot({
      inset: 10,
      aspectRatio: 1,
      width: 300,
      height: 300,
      // color: { label: "Divergence", scheme: "RdBu", legend: true },
      // x: { domain: [-gridSize - 1, gridSize + 1] },
      // y: { domain: [-gridSize - 1, gridSize + 1] },
      marks: [
        Plot.cell(points, {
          x: "x",
          y: "y",
          fill: "divergence"
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