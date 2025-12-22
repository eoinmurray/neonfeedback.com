'use client'

import React, { createContext, useContext, ReactNode, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Model } from "./model";

const Context = createContext<any>(null);

function computeAccuracy(original: number[], reconstructed: number[]): number {
  let correct = 0;
  for (let i = 0; i < original.length; i++) {
    const bin = reconstructed[i] > 0.5 ? 1 : 0;
    if (bin === original[i]) correct++;
  }
  return correct / original.length;
}

export const basePatterns = [
  [1,1,1,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,0],
  [1,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,1],
];

export const dataset = Array.from({ length: 100 }, () => {
  const base = basePatterns[Math.floor(Math.random() * basePatterns.length)];
  return base.map(v => Math.random() < 0.1 ? 1 - v : v); // 10% noise
});

// Consider reducing MAX_HISTORY_LENGTH if 50000 is too much for browser memory/performance
// For typical visualization, 500-2000 is often sufficient.
export const MAX_HISTORY_LENGTH = 5000; // Reduced for better performance
const METRICS_UPDATE_INTERVAL = 100; // Calculate full metrics every N epochs in speed mode

interface SharedStateType {
  numVisible: number;
  numHidden: number;
  edges: any[];
  visibleActivations: number[];
  hiddenActivations: number[];
  currentSample: number[];
  dataset: number[][];
  reconstructionAccuracy: number[];
  energyHistory: number[];
  rawEnergyHistory: number[];
  epoch: number;
  maxEpochs: number;
  learningRate: number;
  isPaused: boolean;
  frameTimeout: number;
  metricsUpdateInterval: number; // Interval for updating detailed metrics

  gibbsStep: number;
  v0_for_cd: number[];
  h0_for_cd: number[];
  v1_for_cd: number[];
  h1_for_cd: number[];
}

export const Trainer = ({ children }: { children: ReactNode }) => {
  const [sharedState, setSharedState] = useState<SharedStateType>({
    numVisible: 10,
    numHidden: 10,
    edges: [],
    visibleActivations: Array(10).fill(0),
    hiddenActivations: Array(10).fill(0),
    currentSample: [],
    dataset: dataset,
    reconstructionAccuracy: [],
    energyHistory: [],
    rawEnergyHistory: [],
    epoch: 0,
    maxEpochs: 100000, // Increased max epochs for longer runs
    learningRate: 0.1,
    isPaused: true,
    frameTimeout: 0, // Very fast timeout for speed mode (e.g., 1-10ms)
                      // Visual updates will be throttled by METRICS_UPDATE_INTERVAL
    metricsUpdateInterval: METRICS_UPDATE_INTERVAL,
    gibbsStep: 0,
    v0_for_cd: [],
    h0_for_cd: [],
    v1_for_cd: [],
    h1_for_cd: [],
  });

  const sharedStateRef = useRef(sharedState);
  useEffect(() => {
    sharedStateRef.current = sharedState;
  }, [sharedState]);
  
  const rbmRef = useRef(new Model(sharedState.numVisible, sharedState.numHidden, sharedState.learningRate));
  useEffect(() => {
    rbmRef.current = new Model(sharedState.numVisible, sharedState.numHidden, sharedState.learningRate);
    setSharedState(prev => ({
      ...prev,
      visibleActivations: Array(prev.numVisible).fill(0),
      hiddenActivations: Array(prev.numHidden).fill(0),
      edges: Array.from({ length: prev.numVisible }, (_, i) =>
        Array.from({ length: prev.numHidden }, (_, j) => ({
          source: `v${i}`,
          target: `h${j}`,
          weight: 0.1*(Math.random() * 2 - 1), // Random weight between -1 and 1
        }))
      ).flat(),
      epoch: 0,
      reconstructionAccuracy: [],
      energyHistory: [],
      rawEnergyHistory: [],
    }));
  }, [sharedState.numVisible, sharedState.numHidden, sharedState.learningRate]);

  const batchSize = 10; // For energy calculation

  const runOneTick = useCallback(async (isSpeedMode = false) => {
    const rbm = rbmRef.current;
    const currentActualState = sharedStateRef.current;

    if (currentActualState.epoch >= currentActualState.maxEpochs) return;

    if (isSpeedMode) {
        const v0 = currentActualState.dataset[Math.floor(Math.random() * currentActualState.dataset.length)];
        const h0 = rbm.sampleHidden(v0);
        const v1 = rbm.sampleVisible(h0);
        const h1 = rbm.sampleHidden(v1);

        rbm.contrastiveDivergenceInner(v0, h0, v1, h1); // Core training step

        // Prepare payload for state update
        // Some parts are always updated, metrics are conditional
        let calculatedMetrics: Partial<SharedStateType & { latestAccuracy?: number, latestFreeEnergy?: number, latestRawEnergy?: number }> = {};
        
        const epochBeingCompleted = currentActualState.epoch;
        if (epochBeingCompleted % currentActualState.metricsUpdateInterval === 0) {
            const reconstructed = rbm.reconstruct(v0);
            calculatedMetrics.latestAccuracy = computeAccuracy(v0, reconstructed);

            const newEdges_calc: { source: string; target: string; weight: number; }[] = [];
            for (let i = 0; i < rbm.numVisible; i++) {
                for (let j = 0; j < rbm.numHidden; j++) {
                    newEdges_calc.push({
                        source: `v${i}`, target: `h${j}`, weight: rbm.weights[i][j],
                    });
                }
            }
            calculatedMetrics.edges = newEdges_calc;
            
            const samplesForEnergy = Array.from({ length: batchSize }, () =>
                currentActualState.dataset[Math.floor(Math.random() * currentActualState.dataset.length)]
            );
            let totalFreeEnergy = 0;
            let totalEnergy = 0;
            for (const v_sample of samplesForEnergy) {
                totalFreeEnergy += rbm.freeEnergy(v_sample);
                const h_sample = rbm.sampleHidden(v_sample);
                totalEnergy += rbm.energy(v_sample, h_sample);
            }
            calculatedMetrics.latestFreeEnergy = totalFreeEnergy / batchSize;
            calculatedMetrics.latestRawEnergy = totalEnergy / batchSize;
        }

        setSharedState(prev => {
            const baseUpdate: Partial<SharedStateType> = {
                visibleActivations: v1,
                hiddenActivations: h1,
                currentSample: v0,
                v0_for_cd: v0, h0_for_cd: h0, v1_for_cd: v1, h1_for_cd: h1,
                epoch: prev.epoch + 1,
                gibbsStep: 0, // Always 0 in speed mode after a full cycle
            };

            // Conditionally add metrics to the state update
            if (prev.epoch % prev.metricsUpdateInterval === 0) {
                if (calculatedMetrics.edges) baseUpdate.edges = calculatedMetrics.edges;
                if (calculatedMetrics.latestAccuracy !== undefined) {
                    baseUpdate.reconstructionAccuracy = [...prev.reconstructionAccuracy, calculatedMetrics.latestAccuracy].slice(-MAX_HISTORY_LENGTH);
                }
                if (calculatedMetrics.latestFreeEnergy !== undefined) {
                    baseUpdate.energyHistory = [...prev.energyHistory, calculatedMetrics.latestFreeEnergy].slice(-MAX_HISTORY_LENGTH);
                }
                if (calculatedMetrics.latestRawEnergy !== undefined) {
                    baseUpdate.rawEnergyHistory = [...prev.rawEnergyHistory, calculatedMetrics.latestRawEnergy].slice(-MAX_HISTORY_LENGTH);
                }
            }
            
            return { ...prev, ...baseUpdate };
        });

    } else { // VISUALIZATION MODE (step-by-step)
        const { gibbsStep, dataset: currentDataset, v0_for_cd, h0_for_cd, v1_for_cd, h1_for_cd, numHidden } = currentActualState;

        if (gibbsStep === 0) {
            const v0_step = currentDataset[Math.floor(Math.random() * currentDataset.length)];
            setSharedState(prev => ({ 
              ...prev,
              visibleActivations: v0_step,
              hiddenActivations: prev.h1_for_cd.length > 0 ? prev.h1_for_cd : Array(numHidden).fill(0),
              v0_for_cd: v0_step,
              currentSample: v0_step,
              gibbsStep: 1,
            }));
        } else if (gibbsStep === 1) {
            if (!v0_for_cd || v0_for_cd.length === 0) { setSharedState(prev => ({ ...prev, gibbsStep: 0 })); return; }
            const h0_step = rbm.sampleHidden(v0_for_cd);
            setSharedState(prev => ({ ...prev, hiddenActivations: h0_step, h0_for_cd: h0_step, gibbsStep: 2, }));
        } else if (gibbsStep === 2) {
            if (!h0_for_cd || h0_for_cd.length === 0) { setSharedState(prev => ({ ...prev, gibbsStep: 0 })); return; }
            const v1_step = rbm.sampleVisible(h0_for_cd);
            setSharedState(prev => ({ ...prev, visibleActivations: v1_step, v1_for_cd: v1_step, gibbsStep: 3, }));
        } else if (gibbsStep === 3) {
            if (!v1_for_cd || v1_for_cd.length === 0) { setSharedState(prev => ({ ...prev, gibbsStep: 0 })); return; }
            const h1_step = rbm.sampleHidden(v1_for_cd);
            setSharedState(prev => ({ ...prev, hiddenActivations: h1_step, h1_for_cd: h1_step, gibbsStep: 4, }));
        } else if (gibbsStep === 4) {
            if (!v0_for_cd || !h0_for_cd || !v1_for_cd || !h1_for_cd || [v0_for_cd,h0_for_cd,v1_for_cd,h1_for_cd].some(arr => arr.length ===0)) {
                setSharedState(prev => ({ ...prev, gibbsStep: 0 })); return;
            }
            rbm.contrastiveDivergenceInner(v0_for_cd, h0_for_cd, v1_for_cd, h1_for_cd);
            const reconstructed = rbm.reconstruct(v0_for_cd);
            const acc = computeAccuracy(v0_for_cd, reconstructed);
            const newEdges: any[] = [];
            for (let i = 0; i < rbm.numVisible; i++) for (let j = 0; j < rbm.numHidden; j++) newEdges.push({ source: `v${i}`, target: `h${j}`, weight: rbm.weights[i][j] });
            let totalFreeEnergy = 0, totalEnergy = 0;
            const samplesForEnergy = Array.from({ length: batchSize }, () => currentDataset[Math.floor(Math.random() * currentDataset.length)]);
            for (const v_sample of samplesForEnergy) { totalFreeEnergy += rbm.freeEnergy(v_sample); const h_sample = rbm.sampleHidden(v_sample); totalEnergy += rbm.energy(v_sample, h_sample); }
            
            setSharedState(prev => ({ ...prev, edges: newEdges, reconstructionAccuracy: [...prev.reconstructionAccuracy, acc].slice(-MAX_HISTORY_LENGTH), energyHistory: [...prev.energyHistory, totalFreeEnergy / batchSize].slice(-MAX_HISTORY_LENGTH), rawEnergyHistory: [...prev.rawEnergyHistory, totalEnergy / batchSize].slice(-MAX_HISTORY_LENGTH), epoch: prev.epoch + 1, gibbsStep: 0, }));
        }
    }
  }, [rbmRef, batchSize]); // Dependencies: rbmRef (stable), batchSize (constant)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const animate = () => {
      const currentState = sharedStateRef.current;
      if (currentState.isPaused || currentState.epoch >= currentState.maxEpochs) {
        return;
      }
      runOneTick(true); // SPEED MODE
      timeoutId = setTimeout(() => { requestAnimationFrame(animate); }, currentState.frameTimeout); 
    };
    const firstCallState = sharedStateRef.current;
    if (!firstCallState.isPaused && firstCallState.epoch < firstCallState.maxEpochs) {
      timeoutId = setTimeout(() => { requestAnimationFrame(animate); }, firstCallState.frameTimeout); 
    }
    return () => { clearTimeout(timeoutId); };
  }, [sharedState.isPaused, sharedState.maxEpochs, sharedState.frameTimeout, runOneTick]);

  const start = useCallback(() => {
    const currentParams = sharedStateRef.current; // Use current params for new model
    rbmRef.current = new Model(currentParams.numVisible, currentParams.numHidden, currentParams.learningRate);
    setSharedState(s => ({ 
        ...s, 
        isPaused: false, epoch: 0, gibbsStep: 0, 
        reconstructionAccuracy: [], energyHistory: [], rawEnergyHistory: [],
        visibleActivations: Array(s.numVisible).fill(0), hiddenActivations: Array(s.numHidden).fill(0),
        v0_for_cd: [], h0_for_cd: [], v1_for_cd: [], h1_for_cd: [], currentSample: [],
        edges: [] // Initialize edges for the new model if needed, or clear
    }));
  }, []);

  const stop = useCallback(() => {
    setSharedState(prev => ({
        ...prev, isPaused: true, epoch: 0, 
        currentSample: [], visibleActivations: Array(prev.numVisible).fill(0), hiddenActivations: Array(prev.numHidden).fill(0),
        reconstructionAccuracy: [], energyHistory: [], rawEnergyHistory: [],
        gibbsStep: 0, v0_for_cd: [], h0_for_cd: [], v1_for_cd: [], h1_for_cd: [],
        // Consider whether to clear edges or keep last state on stop
        // edges: [],
    }));
  }, []);

  const pause = useCallback(() => setSharedState(s => ({ ...s, isPaused: true })), []);
  const unpause = useCallback(() => setSharedState(s => ({ ...s, isPaused: false, gibbsStep: 0 })) , []);

  const manualStep = useCallback(() => {
      if (sharedStateRef.current.epoch < sharedStateRef.current.maxEpochs) {
        runOneTick(false); // VISUALIZATION MODE STEP
      }
  }, [runOneTick]);

  const contextValue = useMemo(() => ({
    sharedState, setSharedState, start, stop, pause, unpause, manualStep,
  }), [sharedState, start, stop, pause, unpause, manualStep]);

  return (<Context.Provider value={contextValue}>{children}</Context.Provider>);
};

export const useTrainerState = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useTrainerState must be used within a <Trainer>");
  return context;
};