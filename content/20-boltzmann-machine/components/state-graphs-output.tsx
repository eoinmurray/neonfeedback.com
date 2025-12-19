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
    <PlotComponent 
      title="Output"
      height={height / 2}
      width={width}
      x={{ axis: null }}
      y={{ axis: null }}
      marks={[
        Plot.frame(),
        Plot.rectY(sharedState.visibleActivations)
      ]}
    />
  );
};
