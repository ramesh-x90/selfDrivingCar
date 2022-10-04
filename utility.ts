import { Network } from "./network";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type coord = { x: number; y: number };

type segment = {
  start: coord;
  end: coord;
};

type Intersection = {
  x: number;
  y: number;
  offset: number;
};

function getIntersection(seg1: segment, seg2: segment): Intersection | null {
  const A = seg1.start;
  const B = seg1.end;
  const C = seg2.start;
  const D = seg2.end;

  const tTop = (D.x - C.x) * (A.y - C.y) - (A.x - C.x) * (D.y - C.y);
  const tBottom = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);

  const uTop = (C.y - A.y) * (B.x - A.x) - (C.x - A.x) * (B.y - A.y);
  const uBottom = -tBottom;

  if (tBottom != 0) {
    const t = tTop / tBottom;
    const u = uTop / uBottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

interface networkSeriealizable {
  biases: number[][];
  weights: number[][][];
}

function createNuralNet(
  storage: Storage,
  inputCount: number,
  hiddenLayersNeuronCount: number,
  outPutLayerNeuronCount: number,
  layersCount: number
) {
  let data = storage.getItem("network");

  if (data == null) {
    let network = new Network(
      inputCount,
      hiddenLayersNeuronCount,
      outPutLayerNeuronCount,
      layersCount
    );
    network.layers.forEach((layer) => {
      layer.initBiases();
      layer.initWeights();
    });
    return network;
  }

  let obj: networkSeriealizable = JSON.parse(data);
  let network = new Network(
    obj.weights[0][0].length,
    obj.biases[0].length,
    obj.biases[obj.biases.length - 1].length,
    obj.biases.length
  );
  network.layers.forEach((layer, index) => {
    layer.biases = obj.biases[index];
    layer.weights = obj.weights[index];
    if (index != 0) layer.mutate(0.1);
  });

  return network;
}

function saveNetwork(storage: Storage, network: Network) {
  let data: networkSeriealizable = {
    biases: network.layers.map((layer) => layer.biases),
    weights: network.layers.map((layer) => layer.weights),
  };

  storage.setItem("network", JSON.stringify(data));
}

export {
  lerp,
  getIntersection,
  Intersection,
  segment,
  createNuralNet,
  saveNetwork,
};
