'use client'
import React, { useMemo } from "react";
import { useTrainerState } from "../lib/trainer";

interface Props {
  width: number;
  height: number;
  weightsScale?: number;
  neuronRadius?: number;
  annotations?: boolean;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

const NetworkGraph: React.FC<Props> = ({
  width,
  height,
  weightsScale = 20,
  neuronRadius = 20,
  annotations = false
}) => {
  const { sharedState } = useTrainerState()

  const numVisible = sharedState.numVisible
  const numHidden = sharedState.numHidden
  const edges = sharedState.edges
  const visibleActivations = sharedState.visibleActivations
  const hiddenActivations = sharedState.hiddenActivations

  const layoutNeurons = () => {
    // const spacingV = height / (numVisible + 1);
    // const spacingH = height / (numHidden + 1);

    // const visible = Array.from({ length: numVisible }, (_, i) => ({
    //   id: `v${i}`,
    //   x: 50,
    //   y: spacingV * (i + 1),
    //   group: "visible" as const,
    // }));

    // const hidden = Array.from({ length: numHidden }, (_, j) => ({
    //   id: `h${j}`,
    //   x: 350,
    //   y: spacingH * (j + 1),
    //   group: "hidden" as const,
    // }));
    const topOffset = 40; // <-- space for "Clamped"

    const spacingV = (height - topOffset) / (numVisible + 1);
    const spacingH = (height - topOffset) / (numHidden + 1);

    const visible = Array.from({ length: numVisible }, (_, i) => ({
      id: `v${i}`,
      x: 50,
      y: topOffset + spacingV * (i + 1),
      group: "visible" as const,
    }));

    const hidden = Array.from({ length: numHidden }, (_, j) => ({
      id: `h${j}`,
      x: 350,
      y: topOffset + spacingH * (j + 1),
      group: "hidden" as const,
    }));


    return [...visible, ...hidden];
  };

  const neurons = layoutNeurons();

  const getActivationColor = (group: "visible" | "hidden", index: number) => {
    const act = group === "visible" ? visibleActivations[index] : hiddenActivations[index];
    const clamped = Math.min(1, Math.max(0, act));
    const base = group === "visible" ? 200 : 50;
    const brightness = Math.round(base + (255 - base) * clamped);
    return `rgb(${brightness}, ${brightness}, ${brightness})`;
  };

  const neuronMap = useMemo(() => new Map(neurons.map(n => [n.id, n])), [neurons]);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        width={width} 
        height={height}
      >  
        {(annotations && sharedState.isPaused && sharedState.gibbsStep === 0) && (() => {
          const padding = neuronRadius + 10;
          const minY = Math.min(...neurons.map(n => n.y)) - padding;
          const maxY = Math.max(...neurons.map(n => n.y)) + padding;
          const minX = Math.min(...neurons.map(n => n.x)) - padding;
          const maxX = Math.max(...neurons.map(n => n.x)) + padding;
          return (
            <rect
              x={minX}
              y={minY}
              width={maxX - minX}
              height={maxY - minY}
              stroke="black"
              strokeWidth={2}
              fill="none"
              rx={10}
            />
          );
        })()}
        
        {(annotations && sharedState.isPaused && (sharedState.gibbsStep === 1 || sharedState.gibbsStep === 3) ) && (() => {
          const visibleNeurons = neurons.filter(n => n.group === 'visible');
          const padding = neuronRadius + 10;
          const minY = Math.min(...visibleNeurons.map(n => n.y)) - padding;
          const maxY = Math.max(...visibleNeurons.map(n => n.y)) + padding;
          const minX = Math.min(...visibleNeurons.map(n => n.x)) - padding;
          const maxX = Math.max(...visibleNeurons.map(n => n.x)) + padding;
          return (
            <rect
              x={minX}
              y={minY}
              width={maxX - minX}
              height={maxY - minY}
              stroke="black"
              strokeWidth={2}
              fill="none"
              rx={10}
            />
          );
        })()}

        {/* Border around hidden neurons if gibbsStep === 1 */}
        {(annotations && sharedState.isPaused && (sharedState.gibbsStep === 2 || sharedState.gibbsStep === 4)) && (() => {
          const hiddenNeurons = neurons.filter(n => n.group === 'hidden');
          const padding = neuronRadius + 10;
          const minY = Math.min(...hiddenNeurons.map(n => n.y)) - padding;
          const maxY = Math.max(...hiddenNeurons.map(n => n.y)) + padding;
          const minX = Math.min(...hiddenNeurons.map(n => n.x)) - padding;
          const maxX = Math.max(...hiddenNeurons.map(n => n.x)) + padding;
          return (
            <rect
              x={minX}
              y={minY}
              width={maxX - minX}
              height={maxY - minY}
              stroke="black"
              strokeWidth={2}
              fill="none"
              rx={10}
            />
          );
        })()}

        {annotations && sharedState.gibbsStep === 1 && (() => {
          const visibleNeurons = neurons.filter(n => n.group === 'visible');
          const centerX = visibleNeurons.reduce((sum, n) => sum + n.x, 0) / visibleNeurons.length;
          const minY = Math.min(...visibleNeurons.map(n => n.y));
          return (
            <text
              x={centerX}
              y={minY - neuronRadius - 20}
              fontSize="16"
              fill="#000"
              textAnchor="middle"
            >
              Clamped
            </text>
          );
        })()}

        {/* Draw edges */}
        {edges.map((e: Edge, i: number) => {
          const src = neuronMap.get(e.source);
          const tgt = neuronMap.get(e.target);
          const strength = Math.abs(e.weight);
          return (
            <line
              key={i}
              x1={src!.x}
              y1={src!.y}
              x2={tgt!.x}
              y2={tgt!.y}
              stroke={e.weight > 0 ? "#5fd65c" : "#e85e46"}
              strokeWidth={Math.min(5, strength * weightsScale)}
              opacity={0.5}
            />
          );
        })}

        {/* Draw neurons */}
        {neurons.map((n, i: number) => {
          const index = parseInt(n.id.slice(1));
          return (
            <g key={i}>
              <circle
                cx={n.x}
                cy={n.y}
                r={neuronRadius}
                fill={getActivationColor(n.group, index)}
                stroke="#000"
                strokeWidth={1}
              />
              <text x={n.x} y={n.y + 4} fontSize="12" fill="#000" textAnchor="middle">
                {n.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default React.memo(NetworkGraph);
