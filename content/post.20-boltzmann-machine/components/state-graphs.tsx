'use client'
import React from "react";
import { useTrainerState } from "../lib/trainer";
import * as Plot from '@observablehq/plot'
import PlotComponent from '../../../components/plot-component'

interface Props {
  width: number;
  height: number;
}

export default function InputSample({
  width,
  height,
}: Props) {
  const { sharedState } = useTrainerState()

  return (
    <div>
      <PlotComponent
        title="Input Sample"
        height={height / 2}
        width={width}
        x={{ axis: null }}
        y={{ axis: null }}
        marks={[
          Plot.rectY(sharedState.currentSample)
        ]}
      />
      <PlotComponent 
        title="Reconstruction"
        height={height / 2}
        width={width}
        x={{ axis: null }}
        y={{ axis: null }}
        marks={[
          Plot.rectY(sharedState.visibleActivations)
        ]}
      />
    </div>
  );
};
