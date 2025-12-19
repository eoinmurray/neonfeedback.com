"use client";
import NetworkGraph from "./network-graph";
import StateGraphsInput from "./state-graphs-input";
import Controls from "./controls";
import { useTrainerState } from "../lib/trainer";

export default function Simulator() {
  const { sharedState } = useTrainerState();

  return (
    <div
      id="trainer"
      className="flex flex-col md:flex-row gap-4 md:gap-16 justify-center items-center"
    >
      <div className="max-w-[400px] min-w-[400px] flex flex-col gap-4 justify-center">
        <div className="text-4xl font-semibold">
          Lets simulate one step at a time
        </div>

        <div className="text-zinc-500">
          A Restricted Boltzmann Machine (RBM) is trained using a process called
          Contrastive Divergence. The steps are as follows:
        </div>

        <div className="font-mono min-h-[50px] flex flex-col items-center justify-center">
          <div>
            <ol>
              <li className={sharedState.gibbsStep === 1 ? "bg-green-200" : ""}>
                <span className="font-bold">Step 1:</span>
                <span className="text-gray-500">
                  {" "}
                  Clamping visible units to data
                </span>
              </li>
              <li className={sharedState.gibbsStep === 2 ? "bg-green-200" : ""}>
                <span className="font-bold">Step 2:</span>
                <span className="text-gray-500"> Sampling hidden units</span>
              </li>
              <li className={sharedState.gibbsStep === 3 ? "bg-green-200" : ""}>
                <span className="font-bold">Step 3:</span>
                <span className="text-gray-500"> Sampling visible units</span>
              </li>
              <li className={sharedState.gibbsStep === 4 ? "bg-green-200" : ""}>
                <span className="font-bold">Step 4:</span>
                <span className="text-gray-500"> Sampling hidden units</span>
              </li>
              <li className={sharedState.gibbsStep === 0 ? "bg-green-200" : ""}>
                <span className="font-bold">Step 5:</span>
                <span className="text-gray-500"> Updating weights</span>
              </li>
            </ol>
          </div>
        </div>
        <Controls playDisabled={true} />
        <div className="text-zinc-500">
          A more formal description of the steps above are given in the{" "}
          <a href="#appendix" className="underline">
            Appendix
          </a>
          .
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div>
          <StateGraphsInput width={200} height={100} />
        </div>

        <NetworkGraph
          annotations={true}
          width={400}
          height={400}
          weightsScale={20}
          neuronRadius={15}
        />
      </div>
    </div>
  );
}
