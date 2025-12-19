
export class Model {
  numVisible: number;
  numHidden: number;
  weights: number[][];
  visibleBias: number[];
  hiddenBias: number[];
  learningRate: number;

  constructor(numVisible: number, numHidden: number, learningRate = 0.1) {
    this.numVisible = numVisible;
    this.numHidden = numHidden;
    this.learningRate = learningRate;

    this.weights = Array.from({ length: numVisible }, () =>
      Array.from({ length: numHidden }, () => Math.random() * 0.1 - 0.05)
    );

    this.visibleBias = Array(numVisible).fill(0);
    this.hiddenBias = Array(numHidden).fill(0);
  }

  sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  sampleBernoulli(prob: number): number {
    return Math.random() < prob ? 1 : 0;
  }

  activate(input: number[], weights: number[][], bias: number[]): number[] {
    const result = weights[0].map((_, j) =>
      this.sigmoid(input.reduce((sum, v_i, i) => sum + v_i * weights[i][j], bias[j]))
    );
    return result;
  }

  sampleHidden(v: number[]): number[] {
    const probs = this.activate(v, this.weights, this.hiddenBias);
    return probs.map(this.sampleBernoulli);
  }

  sampleVisible(h: number[]): number[] {
    const transposed = this.weights[0].map((_, i) => this.weights.map(row => row[i]));
    const probs = this.activate(h, transposed, this.visibleBias);
    return probs.map(this.sampleBernoulli);
  }

  contrastiveDivergence(v0: number[]) {
    const h0 = this.sampleHidden(v0);
    const v1 = this.sampleVisible(h0);
    const h1 = this.sampleHidden(v1);

    this.contrastiveDivergenceInner(v0, h0, v1, h1);
  }

  contrastiveDivergenceInner(v0: number[], h0: number[], v1: number[], h1: number[]) {
    for (let i = 0; i < this.numVisible; i++) {
      for (let j = 0; j < this.numHidden; j++) {
        this.weights[i][j] += this.learningRate * (v0[i] * h0[j] - v1[i] * h1[j]);
      }
    }

    for (let i = 0; i < this.numVisible; i++) {
      this.visibleBias[i] += this.learningRate * (v0[i] - v1[i]);
    }

    for (let j = 0; j < this.numHidden; j++) {
      this.hiddenBias[j] += this.learningRate * (h0[j] - h1[j]);
    }
  }

  train(data: number[][], epochs: number = 1000) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (const sample of data) {
        this.contrastiveDivergence(sample);
      }
    }
  }

  transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  reconstruct(v: number[]): number[] {
    const hProb = this.activate(v, this.weights, this.hiddenBias);
    // no sampling here
    return this.activate(hProb, this.transpose(this.weights), this.visibleBias);
  }

  freeEnergy(v: number[]): number {
    const dot = (a: number[], b: number[]) => a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  
    const vbiasTerm = dot(this.visibleBias, v);
  
    let hiddenTerm = 0;
    for (let j = 0; j < this.numHidden; j++) {
      let wx = 0;
      for (let i = 0; i < this.numVisible; i++) {
        wx += this.weights[i][j] * v[i];
      }
      hiddenTerm += Math.log(1 + Math.exp(this.hiddenBias[j] + wx));
    }
  
    return -vbiasTerm - hiddenTerm;
  }

   energy(v: number[], h: number[]): number {
    let energy = 0;
  
    for (let i = 0; i < this.numVisible; i++) {
      energy -= v[i] * this.visibleBias[i];
    }
  
    for (let j = 0; j < this.numHidden; j++) {
      energy -= h[j] * this.hiddenBias[j];
    }
  
    for (let i = 0; i < this.numVisible; i++) {
      for (let j = 0; j < this.numHidden; j++) {
        energy -= v[i] * this.weights[i][j] * h[j];
      }
    }
  
    return energy;
  }
}