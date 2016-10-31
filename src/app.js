'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const LineChart = require('react-d3-basic').LineChart;

(() => {
  const data = [
          { x: 1, y: 6 },
          { x: 2, y: 3 },
          { x: 3, y: 7 },
          { x: 4, y: 2 },
          { x: 5, y: 4 },
        ],
        chartSeries = [
          {
            field: 'y',
            name: 'Borps',
            color: '#ffcc00'
          }
        ],
        x = (item) => item.x;

  ReactDOM.render(
    <LineChart
      data={data}
      chartSeries={chartSeries}
      x={x}
    />,
    document.getElementById('app')
  );
})()
