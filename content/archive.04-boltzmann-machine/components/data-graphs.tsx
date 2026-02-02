"use client"
import { dataset } from "../lib/trainer"
import * as Plot from "@observablehq/plot"
import PlotComponent from "../../../components/plot-component"

export default function DataGraphs() {
  const drawPlot = (sample: number[], index: number) => {
    return (
      <PlotComponent
        key={index}
        marks={[
          Plot.frame(),
          Plot.rectY(sample),
        ]}
        width={200}
        height={20}
        grid={true}
        x={{ axis: null }}
        y={{ axis: null }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="text-2xl font-mono">
        Here is our training data.
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
        {dataset.slice(0,10).map(drawPlot)}
        </div>
        <div className="flex flex-col gap-4">
          {dataset.slice(10,20).map(drawPlot)}
        </div>
      </div>
      <div className="text-2xl font-mono">
        We want the network to learn how to make similar samples to these.
      </div>
    </div>
  )
}
