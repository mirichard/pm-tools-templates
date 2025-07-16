// src/components/RiskMatrix.js
import React from 'react';
import Plot from 'react-plotly.js';

const RiskMatrix = ({ data }) => {
  const trace = [{
    x: data.map(d => d.likelihood),
    y: data.map(d => d.impact),
    mode: 'markers',
    marker: { size: 12, color: 'red' },
    text: data.map(d => d.title)
  }];

  return (
    <div>
      <h3>Risk Matrix</h3>
      <Plot
        data={trace}
        layout={{
          xaxis: { title: 'Likelihood' },
          yaxis: { title: 'Impact' },
          height: 400
        }}
        useResizeHandler
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default RiskMatrix;

