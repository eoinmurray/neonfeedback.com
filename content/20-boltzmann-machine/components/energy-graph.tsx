'use client'
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import Network from './network';
import { Dices } from "lucide-react";

interface Props {
  width: number;
  height: number;
  weightsScale?: number;
  neuronRadius?: number;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

const NetworkGraph: React.FC<Props> = ({
  width,
  height,
  weightsScale = 20,
  neuronRadius = 20
}) => {
  const numVisible = 10;
  const numHidden = 10;

  const [edges, setEdges] = useState<Edge[]>([]);
  const [visibleActivations, setVisibleActivations] = useState<number[]>([]);
  const [hiddenActivations, setHiddenActivations] = useState<number[]>([]);
  const [visibleBiases, setVisibleBiases] = useState<number[]>([]);
  const [hiddenBiases, setHiddenBiases] = useState<number[]>([]);

  const randomizeState = () => {
    const newVisibleActivations = Array.from({ length: numVisible }, () => Math.random() < 0.5 ? 1 : 0);
    const newHiddenActivations = Array.from({ length: numHidden }, () => Math.random() < 0.5 ? 1 : 0);

    const newEdges: Edge[] = [];
    for (let i = 0; i < numVisible; i++) {
      for (let j = 0; j < numHidden; j++) {
        newEdges.push({
          source: `v${i}`,
          target: `h${j}`,
          weight: Math.random() * 2 - 1, // weights in [-1, 1]
        });
      }
    }

    const newVisibleBiases = Array.from({ length: numVisible }, () => Math.random() * 2 - 1);
    const newHiddenBiases = Array.from({ length: numHidden }, () => Math.random() * 2 - 1);

    setVisibleActivations(newVisibleActivations);
    setHiddenActivations(newHiddenActivations);
    setEdges(newEdges);
    setVisibleBiases(newVisibleBiases);
    setHiddenBiases(newHiddenBiases);
  };

  useEffect(() => {
    randomizeState();
  }, []);

  const networkEnergy = useMemo(() => {
    let energy = 0;

    for (const edge of edges) {
      const i = parseInt(edge.source.slice(1));
      const j = parseInt(edge.target.slice(1));
      energy -= visibleActivations[i] * edge.weight * hiddenActivations[j];
    }

    for (let i = 0; i < numVisible; i++) {
      energy -= visibleBiases[i] * visibleActivations[i];
    }

    for (let j = 0; j < numHidden; j++) {
      energy -= hiddenBiases[j] * hiddenActivations[j];
    }

    return energy;
  }, [visibleActivations, hiddenActivations, edges, visibleBiases, hiddenBiases]);

  return (
    <div>
      <Network
        width={width}
        height={height}
        weightsScale={weightsScale}
        neuronRadius={neuronRadius}
        numVisible={numVisible}
        numHidden={numHidden}
        edges={edges}
        visibleActivations={visibleActivations}
        hiddenActivations={hiddenActivations}
      />
      <div className="flex flex-col gap-4 items-center justify-center mt-4">
        <div className="font-mono">Network Energy: {networkEnergy.toFixed(2)}</div>
        <Button 
          onClick={randomizeState}
        >
          <Dices className="mr-2 h-4 w-4" />
          Randomise state
        </Button>
      </div>
    </div>
  );
};

export default React.memo(NetworkGraph);
