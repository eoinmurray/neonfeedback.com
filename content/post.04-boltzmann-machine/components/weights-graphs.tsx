'use client'
import React from "react";
import { useTrainerState } from "../lib/trainer";
import * as Plot from '@observablehq/plot'
import PlotComponent from '../../../components/plot-component'

interface Props {
  width: number;
  height: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

export default function WeightsGraph({
  width,
  height,
}: Props) {
  const { sharedState } = useTrainerState()
  const allWeights = sharedState.edges.map((e: Edge) => e.weight)

  return (
    <PlotComponent
      title="Weights"
      height={height}
      width={width}
      marks={[
        Plot.rectY(allWeights, Plot.binX({y: "count", thresholds: 50})),
      ]}
      y={{
        domain: [0, 10],
        axis: null
      }}
    />
  );
};
