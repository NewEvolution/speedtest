'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
//const fetch = require('whatwg-fetch');
const LineChart = require('react-d3-basic').LineChart;

(() => {
  const endMaker = (date, range) => {
    return moment(date)
      .add(1, range)
      .subtract(1, 'millisecond')
  };

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
        endDate: endMaker(today, 'day'),
        range: 'day'
      };
    }
    previous() {
      this.setState({
        startDate: this.state.startDate.subtract(1, this.state.range),
        endDate: endMaker(this.state.startDate, this.state.range)
      });
    }
    next() {
      this.setState({
        startDate: this.state.startDate.add(1, this.state.range),
        endDate: endMaker(this.state.startDate, this.state.range)
      });
    }
    timespan(e) {
      this.setState({
        range: e.target.value,
        endDate: endMaker(this.state.startDate, e.target.value)
      });
    }
    render() {
      return(
        <Controls
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          range={this.state.range}
          timespan={(e) => this.timespan(e)}
          previous={() => this.previous()}
          next={() => this.next()}
        />
      )
    }
  };

  function Controls(props) {
    return(
      <div>
        <h1>{props.range}</h1>
        <p>{props.startDate.format('M/D/YYYY h:mm a')} - {props.endDate.format('M/D/YYYY h:mm a')}</p>
        <button onClick={() => props.previous()}>Previous</button>
        <select onChange={(e) => props.timespan(e)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <button onClick={() => props.next()}>Next</button>
      </div>
    )
  };

  ReactDOM.render(
    <Content />,
    document.getElementById('app')
  );
})()
