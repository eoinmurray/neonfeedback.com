'use client'
import React from "react";
import { MAX_HISTORY_LENGTH, useTrainerState } from "../lib/trainer";
import * as Plot from '@observablehq/plot'
import PlotComponent from '../../../components/plot-component'

interface Props {
  width: number;
  height: number;
}

function movingAverage(data: number[], windowSize: number) {
  const result = new Array(data.length).fill(0);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    if (i >= windowSize) {
      sum -= data[i - windowSize];
    }
    result[i] = sum / Math.min(i + 1, windowSize);
  }
  return result;
}

export default function InputSample({
  width,
  height,
}: Props) {
  const { sharedState } = useTrainerState()

  return (
    <div>
      <PlotComponent 
        title="Reconstruction Accuracy" 
        height={height}
        width={width}
        marks={[
          Plot.lineY(movingAverage(sharedState.reconstructionAccuracy, 10))
        ]}
        y={{
          domain: [0, 1],
        }}
      />
      <PlotComponent 
        title="Energy"
        height={height}
        width={width}
        // y={{ 
        //   domain: [-4, 1]
        // }}
        marks={[
          Plot.lineY(sharedState.rawEnergyHistory)
        ]}
      />
    </div>
  );
};
