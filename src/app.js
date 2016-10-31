'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const LineChart = require('react-d3-basic').LineChart;

(() => {
  const data = [
          { x: 1, y: 6, z: 5 },
          { x: 2, y: 3, z: 1 },
          { x: 3, y: 7, z: 4 },
          { x: 4, y: 2, z: 2 },
          { x: 5, y: 4, z: 3 },
        ],
        chartSeries = [
          {
            field: 'y',
            name: 'Borps',
            color: '#ffcc00'
          },
          {
            field: 'z',
            name: 'Hurbs',
            color: '#d602ac'
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
