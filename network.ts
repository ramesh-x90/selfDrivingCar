import { lerp } from "./utility";

class Network {
  private inputNeuronCount: number;
  private outputNeuronCount: number;
  layers: Layer[] = [];
  constructor(
    inputCount: number,
    hiddenLayersNeuronCount: number,
    outPutLayerNeuronCount: number,
    layersCount: number
  ) {
    this.inputNeuronCount = inputCount;
    this.outputNeuronCount = outPutLayerNeuronCount;
    this.layers[0] = new Layer(inputCount, hiddenLayersNeuronCount);

    for (let i = 1; i < layersCount - 1; i++) {
      this.layers[i] = new Layer(
        hiddenLayersNeuronCount,
        hiddenLayersNeuronCount
      );
    }

    this.layers[layersCount - 1] = new Layer(
      hiddenLayersNeuronCount,
      outPutLayerNeuronCount
    );
  }

  forward(inputs: number[]): number[] {
    let outPuts: number[] = [];

    this.layers.forEach((layer, index) => {
      if (index == 0) {
        outPuts = layer.forward(inputs);
      } else {
        outPuts = layer.forward(outPuts);
      }
    });

    return outPuts;
  }
}

class Layer {
  _inputCount: number;
  _outPutCount: number;
  inPuts: number[] = [];
  outPuts: number[] = [];
  biases: number[] = []; //size = _outPutCount
  weights: number[][] = []; /* ( outputs , inputs ) */

  constructor(inputCount: number, outPutCount: number) {
    this._inputCount = inputCount;
    this._outPutCount = outPutCount;

    this.weights = new Array(outPutCount);
  }

  initWeights() {
    for (let i = 0; i < this._outPutCount; i++) {
      this.weights[i] = new Array(this._inputCount);
      for (let j = 0; j < this._inputCount; j++) {
        this.weights[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  initBiases() {
    for (let outputs = 0; outputs < this._outPutCount; outputs++) {
      this.biases[outputs] = Math.random() * 2 - 1;
    }
  }

  mutate(amount: number) {
    for (let i = 0; i < this._outPutCount; i++) {
      this.biases[i] = lerp(this.biases[i], Math.random() * 2 - 1, amount);
      for (let j = 0; j < this._inputCount; j++) {
        this.weights[i][j] = lerp(
          this.weights[i][j],
          Math.random() * 2 - 1,
          amount
        );
      }
    }
  }

  forward(inputs: number[]): number[] {
    this.inPuts = inputs;
    for (let i = 0; i < this._outPutCount; i++) {
      let result = 0;
      for (let j = 0; j < this._inputCount; j++) {
        result += inputs[j] * this.weights[i][j];
      }

      if (result > this.biases[i]) {
        this.outPuts[i] = 1;
      } else {
        this.outPuts[i] = 0;
      }
    }

    return this.outPuts;
  }
}

export { Network };
