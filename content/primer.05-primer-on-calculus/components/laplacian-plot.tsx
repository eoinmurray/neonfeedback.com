'use client'
import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

export default function LaplacianPlot() {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define the scalar field f(x, y)
    function scalarField(x: any, y: any) {
      return Math.sin(x) + Math.cos(y);
    }

    // Define the Laplacian of f(x, y)
    function laplacian(x: any, y: any) {
      // Laplacian = -(sin(x) + cos(y))
      return -(Math.sin(x) + Math.cos(y));
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
          laplacian: laplacian(x, y)
        });
      }
    }

    const plot = Plot.plot({
      inset: 10,
      aspectRatio: 1,
      width: 300,
      height: 300,
      // color: { label: "Laplacian", scheme: "RdBu", legend: true },
      // x: { domain: [-gridSize - 1, gridSize + 1] },
      // y: { domain: [-gridSize - 1, gridSize + 1] },
      marks: [
        Plot.cell(points, {
          x: "x",
          y: "y",
          fill: "laplacian"
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
