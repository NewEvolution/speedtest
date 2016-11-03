'use strict';

require('../scss/main.scss');

const DateRangePicker = require('react-dates').DateRangePicker;
const React = require('react');
const ReactDOM = require('react-dom');
const moment = require('moment');
//const fetch = require('whatwg-fetch');
const LineChart = require('react-d3-basic').LineChart;

(() => {
  const endMaker = (date, range) => {
          return moment(date).add(1, range)
        },
        tomorrow = moment().add(1, 'day').endOf('day'),
        firstScan = moment('2016-04-25').startOf('day');

  class Content extends React.Component{
    constructor() {
      super();
      const today = moment().startOf('day');
      this.state = {
        startDate: today,
        endDate: endMaker(today, 'day'),
        range: 'day',
        focusedInput: null
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
    onDatesChange(datesObj) {
      this.setState({
        startDate: datesObj.startDate,
        endDate: datesObj.endDate
      })
    }
    onFocusChange(focused) {
      this.setState({
        focusedInput: focused
      })
    }
    isOutsideRange(date) {
      return (date.isAfter(tomorrow) || date.isBefore(firstScan));
    }
    initialVisibleMonth() {
      return moment().subtract(1, 'month');
    }
    render() {
      return(
        <Controls
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          range={this.state.range}
          focusedInput={this.state.focusedInput}
          timespan={e => this.timespan(e)}
          previous={() => this.previous()}
          next={() => this.next()}
          onFocusChange={f => this.onFocusChange(f)}
          onDatesChange={d => this.onDatesChange(d)}
          isOutsideRange={d => this.isOutsideRange(d)}
          initialVisibleMonth={() => this.initialVisibleMonth()}
        />
      )
    }
  };

  function Controls(props) {
    return(
      <div>
        <button
          disabled={props.startDate.isSameOrBefore(firstScan, 'day')}
          onClick={() => props.previous()}
        >Previous</button>
        <select onChange={e => props.timespan(e)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
        <button
          disabled={props.endDate.isSameOrAfter(tomorrow, 'day')}
          onClick={() => props.next()}
        >Next</button>
        <div>
          <DateRangePicker
            startDate={props.startDate}
            endDate={props.endDate}
            focusedInput={props.focusedInput}
            onFocusChange={f => props.onFocusChange(f)}
            onDatesChange={d => props.onDatesChange(d)}
            isOutsideRange={d => props.isOutsideRange(d)}
            initialVisibleMonth={() => props.initialVisibleMonth()}
          />
        </div>
      </div>
    )
  };

  ReactDOM.render(
    <Content />,
    document.getElementById('app')
  );
})()
