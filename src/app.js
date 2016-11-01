'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
//const fetch = require('whatwg-fetch');
const LineChart = require('react-d3-basic').LineChart;

(() => {
  class Content extends React.Component{
    constructor() {
      super();
      const now = moment(),
            today = moment()
              .year(now.year())
              .month(now.month())
              .day(now.day())
              .hour(0)
              .minute(0)
              .second(0)
              .millisecond(0);
      this.state = {
        startDate: today,
        endDate: moment(today)
          .add(1, 'day')
          .subtract(1, 'millisecond'),
        range: 'day'
      };
    }
    endMaker(date) {
      return moment(date)
        .add(1, this.state.range)
        .subtract(1, 'millisecond')
    }
    previous() {
      this.setState({
        startDate: this.state.startDate.subtract(1, this.state.range),
        endDate: this.endMaker(this.state.startDate)
      });
    }
    next() {
      this.setState({
        startDate: this.state.startDate.add(1, this.state.range),
        endDate: this.endMaker(this.state.startDate)
      });
    }
    timespan(e) {
      this.setState({
        range: e.target.value,
        endDate: moment(this.state.startDate)
          .add(1, e.target.value)
          .subtract(1, 'milliseconds')
      });
    }
    render() {
      return(
        <div>
          <p>The {this.state.range} starts at {this.state.startDate.format()}</p>
          <p>The {this.state.range} ends at {this.state.endDate.format()}</p>
          <button onClick={() => this.previous()}>Previous</button>
          <select onChange={(e) => this.timespan(e)}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <button onClick={() => this.next()}>Next</button>
        </div>
      )
    }
  };

  ReactDOM.render(
    <Content />,
    document.getElementById('app')
  );
})()
