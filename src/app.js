'use strict';

require('../scss/main.scss');

const DateRangePicker = require('react-dates').DateRangePicker,
      LineChart = require('react-d3-basic').LineChart,
      React = require('react'),
      ReactDOM = require('react-dom'),
      moment = require('moment');
require('whatwg-fetch');

(() => {
  const tomorrow = moment().add(1, 'day').endOf('day'),
        firstScan = moment('2016-04-25').startOf('day'),
        // Given date and range, provide a new moment 1 range in the future
        endMaker = (date, range) => {
          return moment(date).add(1, range)
        };

  class Content extends React.Component{
    constructor() {
      super();
      const today = moment().startOf('day'),
            tomorrow = endMaker(today, 'day');
      this.state = {
        startDate: today,
        endDate: tomorrow,
        range: 'day',
        focusedInput: null
      };
    }
    // Called to get data from the API to update the chart
    fetchData() {
      const start = this.state.startDate.format('YYYYMMDD'),
            end = this.state.endDate.format('YYYYMMDD')
      fetch(`http://localhost:3000/api/range/${start}/${end}`)
        .then((res) => res.json())
        .then((json) => {
          console.log('json:', json);
        }).catch((err) => {
          throw err;
        })
    }
    // Called to decrement the start and end dates by the current range
    previous() {
      this.setState({
        startDate: this.state.startDate.subtract(1, this.state.range),
        endDate: endMaker(this.state.startDate, this.state.range)
      });
      this.fetchData();
    }
    // Called to increment the start and end dates by the current range
    next() {
      this.setState({
        startDate: this.state.startDate.add(1, this.state.range),
        endDate: endMaker(this.state.startDate, this.state.range)
      });
      this.fetchData();
    }
    // Called to change the current range (day, week, month, year)
    timespan(e) {
      this.setState({
        range: e.target.value,
        endDate: endMaker(this.state.startDate, e.target.value)
      });
    }
    // Called by date picker upon changing dates to set dates in state
    onDatesChange(datesObj) {
      this.setState({
        startDate: datesObj.startDate,
        endDate: datesObj.endDate
      })
    }
    // Called by date picker when focus changes to/from inputs
    onFocusChange(focused) {
      this.setState({
        focusedInput: focused
      })
    }
    // Disables dates in the callendar that fall in the future
    // or before data collection started
    isOutsideRange(date) {
      return (date.isAfter(tomorrow) || date.isBefore(firstScan));
    }
    // Sets the start month to the previous month
    initialVisibleMonth() {
      return moment().subtract(1, 'month');
    }
    render() {
      return(
        <div>
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
        </div>
      )
    }
  };

  function Controls(props) {
    return(
      <div>
        <button
          className={'prev'}
          disabled={props.startDate.isSameOrBefore(firstScan, 'day')}
          onClick={() => props.previous()}
        >&laquo;</button>
        <div className={'center-block'}>
          <div>
            <select onChange={e => props.timespan(e)}>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
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
        <button
          className={'next'}
          disabled={props.endDate.isSameOrAfter(tomorrow, 'day')}
          onClick={() => props.next()}
        >&raquo;</button>
      </div>
    )
  };

  ReactDOM.render(
    <Content />,
    document.getElementById('app')
  );
})()
