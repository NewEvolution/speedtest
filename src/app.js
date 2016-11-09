'use strict';

require('../scss/main.scss');

const APIURL = process.env.APIURL || 'localhost:3000',
      DateRangePicker = require('react-dates').DateRangePicker,
      LineTooltip = require('react-d3-tooltip').LineTooltip,
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
        chartData:  [{}]
      };
      this.fetchData(today, tomorrow);
    }
    // Called to get data from the API to update the chart
    fetchData(sentStart, sentEnd) {
      const start = sentStart.format('YYYYMMDD'),
            end = sentEnd.format('YYYYMMDD');
      fetch(`http://${APIURL}/api/range/${start}/${end}`)
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
      const start = moment(this.state.startDate).subtract(1, this.state.range),
            end = moment(this.state.startDate);
      this.setState({
        startDate: start,
        endDate: end
      }, this.fetchData(start, end));
    }
    // Called to increment the start and end dates by the current range
    next() {
      const start = moment(this.state.startDate).add(1, this.state.range),
            end = moment(this.state.startDate).add(2, this.state.range);
      this.setState({
        startDate: start,
        endDate: end,
      }, this.fetchData(start, end));
    }
    // Called to change the current range (day, week, month, year)
    timespan(e) {
      const range = e.target.value,
            end = moment(this.state.startDate).add(1, range);
      this.setState({
        range: range,
        endDate: end
      }, this.fetchData(this.state.startDate, end));
    }
    // Called by date picker upon changing dates to set dates in state
    onDatesChange(datesObj) {
      if (datesObj.startDate) {
        this.setState({
          startDate: datesObj.startDate
        });
      }
      if (datesObj.endDate) {
        this.setState({
          endDate: datesObj.endDate.startOf('day')
        });
      }
      if (datesObj.startDate && datesObj.endDate) {
        const start = datesObj.startDate,
              end = datesObj.endDate.startOf('day');
        this.setState({
          startDate: start,
          endDate: end
        }, this.fetchData(start, end));
      }
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
                name: 'Download (Mbit/s)',
                color: 'red'
              },
              {
                field: 'upload',
                name: 'Upload (Mbit/s)',
                color: 'green'
              },
              {
                field: 'ping',
                name: 'Ping (ms)',
                color: 'orange'
              }
            ],
            height = window.innerHeight - 150,
            width = window.innerWidth - 10,
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
            <LineTooltip
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
