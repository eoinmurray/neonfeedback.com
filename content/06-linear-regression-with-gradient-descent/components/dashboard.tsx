'use client';
import PlotComponent from "../../../components/plot-component";
import * as Plot from '@observablehq/plot';

export default function Dashboard() {
  const x = Array.from({ length: 1000 }, (_, i) => (i / 999) * 2 - 1);
  const lr = 0.1;
  const y_true = x.map(value => Math.sin(value * Math.PI)); // stretch it a bit

  let a = Math.random();
  let b = Math.random();
  let c = Math.random();
  let d = Math.random();

  for (let t = 0; t < 2000; t++) {
    const y_pred = x.map(xi => a + b * xi + c * xi ** 2 + d * xi ** 3 );
    const error = y_pred.map((yp, i) => yp - y_true[i]);

    const n = x.length;
    const a_grad = error.reduce((acc, e) => acc + e, 0) / n;
    const b_grad = error.reduce((acc, e, i) => acc + e * x[i], 0) / n;
    const c_grad = error.reduce((acc, e, i) => acc + e * x[i] ** 2, 0) / n;
    const d_grad = error.reduce((acc, e, i) => acc + e * x[i] ** 3, 0) / n;

    a -= lr * a_grad;
    b -= lr * b_grad;
    c -= lr * c_grad;
    d -= lr * d_grad;
  }

  const y_pred = x.map(xi => a + b * xi + c * xi ** 2 + d * xi ** 3);

  let plotData = [
    ...x.map((xValue, index) => ({
      x: xValue,
      y: y_true[index],
      line: "true"
    })),
    ...x.map((xValue, index) => ({
      x: xValue,
      y: y_pred[index],
      line: "prediction"
    }))
  ]

  return (
    <div>
      <PlotComponent
        title="Plot of predicted vs true values"
        width={400}
        height={200}
        marks={[
          Plot.line(plotData, { x: 'x', y: 'y', stroke: 'line' }),
        ]}
        color={{ legend: true }}
      />
    </div>
  );
}
