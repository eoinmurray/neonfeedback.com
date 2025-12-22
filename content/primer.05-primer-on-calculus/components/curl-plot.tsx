'use client'
import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

export default function CurlPlot() {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define the vector field F(x, y)
    function vectorField(x: any, y: any) {
      return [-y * y, x * x];
    }

    // Define the curl of F(x, y)
    function curl(x: any, y: any) {
      // curl = d/dx(x^2) - d/dy(-y^2) = 2x + 2y
      return 2 * x + 2 * y;
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
          curl: curl(x, y)
        });
      }
    }

    const plot = Plot.plot({
      inset: 10,
      aspectRatio: 1,
      width: 300,
      height: 300,
      // color: { label: "Curl", scheme: "RdBu", legend: true },
      // x: { domain: [-gridSize - 1, gridSize + 1] },
      // y: { domain: [-gridSize - 1, gridSize + 1] },
      marks: [
        Plot.cell(points, {
          x: "x",
          y: "y",
          fill: "curl"
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
