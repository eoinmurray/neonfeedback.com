"use client";
import SimulationControls from './simulation-controls';
import { Simulation } from './boids';
import { config } from './config';
import { makePlot } from './plot'
import { useEffect, useRef, useState } from 'react';

type SimulationParameters = {
  numBoids: number,
  numPredators: number,
}

const inputs = [
  {
    type: "slider" as const,
    id: "numBoids",
    label: "Number of Boids",
    defaultValue: 500,
    min: 0,
    max: 1000,
    step: 1,
  },
  {
    type: "slider" as const,
    id: "numPredators",
    label: "Number of Predators",
    defaultValue: 3,
    min: 0,
    max: 5,
    step: 1,
  },
];

const defaultSimulationParameters: SimulationParameters = {
  numBoids: 500,
  numPredators: 3,
};

export default function Visualization() {
  const [simulationParameters, setSimulationParameters] = useState<SimulationParameters>({
    numBoids: defaultSimulationParameters.numBoids,
    numPredators: defaultSimulationParameters.numPredators,
  });

  const plotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const simRef = useRef<Simulation | null>(null);
  
  useEffect(() => {
    // Initialize simulation
    simRef.current = new Simulation({
      ...config,
      numBoids: simulationParameters.numBoids,
      numPredators: simulationParameters.numPredators,
    });

    const { width, height } = config;

    let timestamp = 0;

    const animate = () => {
      if (simRef.current && plotRef.current) {
        simRef.current.update(1.0);
        const newPlot = makePlot({
          chartWidth: 600,
          chartHeight: 400,
          width,
          height,
          ...simRef.current.state,
        });

        plotRef.current.innerHTML = "";
        plotRef.current.appendChild(newPlot as unknown as Node);
        timestamp++;
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [config, simulationParameters.numBoids, simulationParameters.numPredators]);

  return (
    <div className="p-4">
      <div ref={plotRef} />
           <SimulationControls
             inputs={inputs}
             onChange={(values) => {
               setSimulationParameters(values as unknown as SimulationParameters);
             }}
          />     </div>
  );
}