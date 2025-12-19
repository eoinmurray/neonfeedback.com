'use client'
import React, { useEffect, useMemo, useState } from "react";
import Network from './network';

interface Props {
  width: number;
  height: number;
  weightsScale?: number;
  neuronRadius?: number;
  layout?: "horizontal" | "circular";
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

const NetworkGraph: React.FC<Props> = ({
  width,
  height,
  layout = "circular",
  neuronRadius = 20,
  weightsScale = 2,
}) => {
  const numVisible = 10;
  const numHidden = 10;

  const [edges, setEdges] = useState<Edge[]>([]);
  const [visibleActivations, setVisibleActivations] = useState<number[]>([]);
  const [hiddenActivations, setHiddenActivations] = useState<number[]>([]);

  const randomizeState = () => {
    const newVisibleActivations = Array.from({ length: numVisible }, () => Math.random() < 0.5 ? 1 : 0);
    const newHiddenActivations = Array.from({ length: numHidden }, () => Math.random() < 0.5 ? 1 : 0);

    const newEdges: Edge[] = [];
    for (let i = 0; i < numVisible; i++) {
      for (let j = 0; j < numHidden; j++) {
        newEdges.push({
          source: `v${i}`,
          target: `h${j}`,
          weight: Math.random() * 2 - 1,
        });
      }
    }

    if (layout === "circular") {
      for (let i = 0; i < numVisible; i++) {
        for (let j = i + 1; j < numVisible; j++) {
          newEdges.push({
            source: `v${i}`,
            target: `v${j}`,
            weight: Math.random() * 2 - 1,
          });
        }
      }

      for (let i = 0; i < numHidden; i++) {
        for (let j = i + 1; j < numHidden; j++) {
          newEdges.push({
            source: `h${i}`,
            target: `h${j}`,
            weight: Math.random() * 2 - 1,
          });
        }
      }
    }

    setVisibleActivations(newVisibleActivations);
    setHiddenActivations(newHiddenActivations);
    setEdges(newEdges);
  };

  useEffect(() => {
    randomizeState();
  }, []);

  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null)
  
    const layoutNeurons = (): any[] => {
      if (layout === "horizontal") {
        // Original left-right layout
        const spacingV = height / (numVisible + 1)
        const spacingH = height / (numHidden + 1)
  
        const visible = Array.from({ length: numVisible }, (_, i) => ({
          id: `v${i}`,
          x: 50,
          y: spacingV * (i + 1),
          group: "visible" as const,
        }))
  
        const hidden = Array.from({ length: numHidden }, (_, j) => ({
          id: `h${j}`,
          x: 350,
          y: spacingH * (j + 1),
          group: "hidden" as const,
        }))
  
        return [...visible, ...hidden]
      } else {
        // Circular layout
        const centerX = width / 2
        const centerY = height / 2
        const radius = Math.min(width, height) * 0.4 // Use 40% of the smaller dimension
  
        // Place visible neurons on the left semi-circle
        const visible = Array.from({ length: numVisible }, (_, i) => {
          const angle = Math.PI / 2 + (Math.PI * i) / (numVisible - 1)
          return {
            id: `v${i}`,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            group: "visible" as const,
          }
        })
  
        // Place hidden neurons on the right semi-circle
        const hidden = Array.from({ length: numHidden }, (_, j) => {
          const angle = -Math.PI / 2 + (Math.PI * j) / (numHidden - 1)
          return {
            id: `h${j}`,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            group: "hidden" as const,
          }
        })
  
        return [...visible, ...hidden]
      }
    }
  
    const neurons = layoutNeurons()
  
    const getActivationColor = (group: "visible" | "hidden", index: number) => {
      if (group === "visible") {
        return `rgb(255, 255, 255)`
      }
      return `rgb(200, 200, 200)`
    }
  
    const neuronMap = useMemo(() => new Map(neurons.map((n) => [n.id, n])), [neurons])
  
    return (
      <svg width={width} height={height}>
        {edges.map((e: Edge, i: number) => {
          const src = neuronMap.get(e.source)
          const tgt = neuronMap.get(e.target)
  
          if (!src || !tgt) return null
  
          const isHighlighted = hoveredNeuron === e.source || hoveredNeuron === e.target
          const strength = Math.abs(e.weight)
  
          return (
            <line
              key={i}
              x1={src.x}
              y1={src.y}
              x2={tgt.x}
              y2={tgt.y}
              stroke={e.weight > 0 ? "#5fd65c" : "#e85e46"}
              strokeWidth={Math.min(5, strength * weightsScale) * (isHighlighted ? 2 : 1)}
              opacity={hoveredNeuron ? (isHighlighted ? 0.9 : 0.1) : 0.5}
              strokeDasharray={isHighlighted ? "none" : "none"}
            />
          )
        })}
  
        {neurons.map((n, i: number) => {
          const index = Number.parseInt(n.id.slice(1))
          return (
            <g key={i}>
              <circle
                cx={n.x}
                cy={n.y}
                r={neuronRadius}
                fill={getActivationColor(n.group, index)}
                stroke={hoveredNeuron === n.id ? "#ff9900" : "#000"}
                strokeWidth={hoveredNeuron === n.id ? 2 : 1}
                onMouseEnter={() => setHoveredNeuron(n.id)}
                onMouseLeave={() => setHoveredNeuron(null)}
                style={{ cursor: "pointer" }}
              />
              <text 
                x={n.x} 
                y={n.y + 4} 
                fontSize="8" 
                fill="#000" 
                textAnchor="middle"
                onMouseEnter={() => setHoveredNeuron(n.id)}
                onMouseLeave={() => setHoveredNeuron(null)}
              >
                {n.id}
              </text>
            </g>
          )
        })}
      </svg>
    )
};

export default React.memo(NetworkGraph);
