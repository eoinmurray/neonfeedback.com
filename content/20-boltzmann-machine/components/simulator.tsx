import React from 'react'
import NetworkGraph from './network-graph'
import StateGraphsInput from './state-graphs-input'
import StateGraphsOutput from './state-graphs-output'
import EnergyLossGraphs from './energy-loss-graphs'
import WeightsGraph from './weights-graphs'
import Controls from './controls'

export default function Simulator() {
  return (
    <div id="trainer" className="flex flex-col md:flex-row justify-center items-center">
      <div className="max-w-[400px] min-w-[400px] flex flex-col gap-4 justify-center items-center">
        <div className="text-2xl font-semibold">Simulator</div>

        <div className="text-zinc-500">
          Press the "Run Simulation" button to start training the RBM. If you let 
          the simulation run for a while, you will see the weights of the RBM
          converge to a stable state. The energy loss will also decrease over time.
        </div>
        <div className="text-zinc-500">
          <strong>You can compare the input and output states of the RBM by pausing the simulation</strong>.
        </div>
        <div className="text-zinc-500">
          In the beginning, the input and output states will be dissimilar. As the simulation progresses,
          the input and output states will become more similar.
        </div>

        <Controls 
          runOneStepDisabled={true}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <div className="flex flex-col gap-4 justify-center items-center">
          <StateGraphsInput
            width={200}
            height={100}
          />
          <NetworkGraph
            width={400}
            height={400}
            weightsScale={2}
            neuronRadius={15}
          />
          <StateGraphsOutput
            width={200}
            height={100}
          />
        </div>
  
        <div>
          <EnergyLossGraphs 
            width={200}
            height={100}  
          />

          <WeightsGraph 
            width={200}
            height={100}
          />
        </div>
      </div>     
    </div>
  )
}