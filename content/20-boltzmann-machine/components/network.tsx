"use client"
import React, { useMemo, useState } from "react"

interface Props {
  width: number
  height: number
  weightsScale?: number
  neuronRadius?: number
  numVisible: number
  numHidden: number
  edges: Edge[]
  visibleActivations: number[]
  hiddenActivations: number[]
  layout?: "horizontal" | "circular" // New prop for layout type
}

interface Edge {
  source: string
  target: string
  weight: number
}

interface Neuron {
  id: string
  x: number
  y: number
  group: "visible" | "hidden"
}

const NetworkGraph: React.FC<Props> = ({
  width,
  height,
  weightsScale = 20,
  neuronRadius = 20,
  numVisible = 10,
  numHidden = 10,
  edges,
  visibleActivations,
  hiddenActivations,
  layout = "horizontal", // Default to horizontal layout
}) => {
  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null)

  const layoutNeurons = (): Neuron[] => {
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

  const getActivation = (group: "visible" | "hidden", index: number) => {
    const act = group === "visible" ? visibleActivations[index] : hiddenActivations[index]
    return act
  }

  const getActivationColor = (group: "visible" | "hidden", index: number) => {
    const act = getActivation(group, index)
    const clamped = Math.min(1, Math.max(0, act))
    const base = group === "visible" ? 50 : 50
    const brightness = Math.round(base + (255 - base) * clamped)
    return `rgb(${brightness}, ${brightness}, ${brightness})`
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
              {getActivation(n.group, index)?.toFixed(2)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default React.memo(NetworkGraph)
