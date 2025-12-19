"use client"
import { useTrainerState } from "../lib/trainer"
import { Button } from "../../../components/ui/button"
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

export default function Controls({
  playDisabled = false,
  runOneStepDisabled = false,
}: {
  playDisabled?: boolean
  runOneStepDisabled?: boolean
} = {}) {
  const { sharedState, setSharedState, start, stop, pause, unpause, manualStep } = useTrainerState()

  const { isPaused, epoch, maxEpochs } = sharedState

  const isUnstarted = epoch === 0
  const isRunning = !isPaused && epoch < maxEpochs
  const isFinished = epoch >= maxEpochs

  return (
    <div className="flex flex-col gap-6 justify-center items-center  rounded py-4 px-8">
      <div className="flex flex-row gap-2">
        <TooltipProvider>
          {!playDisabled && 
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={stop} size="lg">
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset</p>
              </TooltipContent>
            </Tooltip>
          }

          {!playDisabled && isUnstarted && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={start} 
                  size="lg"
                >
                  <Play /> Run Simulation
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start training</p>
              </TooltipContent>
            </Tooltip>
          )}

          {isRunning && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={pause} size="lg">
                  <Pause /> Pause
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pause training</p>
              </TooltipContent>
            </Tooltip>
          )}

          {!playDisabled && isPaused && !isUnstarted && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={unpause} size="lg">
                  <Play /> Run Simulation
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start/Resume training</p>
              </TooltipContent>
            </Tooltip>
          )}

          {!runOneStepDisabled && 
            <Button onClick={() => manualStep()} size="lg" disabled={isRunning}>
              <SkipForward /> Run one step 
            </Button>
          }
        </TooltipProvider>
      </div>

      {!playDisabled && 
        <div className="text-sm font-mono flex flex-row gap-2">
          <div className="font-semibold">Iteration:</div>
          <div className="min-w-[45px">{sharedState.epoch}</div> / <div>{sharedState.maxEpochs}</div>
        </div>
      }
    </div>
  )
}
