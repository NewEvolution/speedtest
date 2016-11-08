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
        firstScan = moment('2016-04-25').startOf('day');

  class Content extends React.Component{
    constructor() {
      super();
      const today = moment().startOf('day'),
            tomorrow = moment(today).add(1, 'day');
      this.state = {
        startDate: today,
        endDate: tomorrow,
        range: 'day',
        focusedInput: null,
        chartData:  [{
          "ping": 16.554,
          "download": 77.024,
          "upload": 40.171,
          "scantime": "2016-05-01T05:00:00.000Z"
        }]
      };
      this.fetchData();
    }
    // Called to get data from the API to update the chart
    fetchData() {
      const start = this.state.startDate.format('YYYYMMDD'),
            end = this.state.endDate.format('YYYYMMDD')
      fetch(`http://localhost:3000/api/range/${start}/${end}`)
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            chartData: json
          });
        }).catch((err) => {
          throw err;
        })
    }
    // Called to decrement the start and end dates by the current range
    previous() {
      this.setState({
        startDate: this.state.startDate.subtract(1, this.state.range),
        endDate: this.state.endDate.subtract(1, this.state.range)
      }, this.fetchData());
    }
    // Called to increment the start and end dates by the current range
    next() {
      this.setState({
        startDate: this.state.startDate.add(1, this.state.range),
        endDate: this.state.endDate.subtract(1, this.state.range)
      }, this.fetchData());
    }
    // Called to change the current range (day, week, month, year)
    timespan(e) {
      this.setState({
        range: e.target.value,
        endDate: moment(this.state.startDate).add(1, e.target.value)
      }, this.fetchData());
    }
    // Called by date picker upon changing dates to set dates in state
    onDatesChange(datesObj) {
      this.setState({
        startDate: datesObj.startDate,
        endDate: datesObj.endDate.startOf('day')
      }, this.fetchData())
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
      const margins = {
              top: 20,
              right: 50,
              bottom: 20,
              left: 50
            },
            chartSeries = [
              {
                field: 'download',
                name: 'Download',
                color: 'red'
              },
              {
                field: 'upload',
                name: 'Upload',
                color: 'green'
              }
            ],
            height = 400,
            width = 1000,
            x = data => moment(data.scantime).toDate(),
            xScale = 'time';
      return(
        <div>
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
          <div>
            <LineChart
              margins={margins}
              data={this.state.chartData}
              width={width}
              height={height}
              chartSeries={chartSeries}
              x={x}
              xScale={xScale}
            />
          </div>
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
