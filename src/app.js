'use strict';

require('../scss/main.scss');
require('whatwg-fetch');

const {firstscan, apiurl} = require('./config'),
      DateRangePicker = require('react-dates').DateRangePicker,
      LineTooltip = require('react-d3-tooltip').LineTooltip,
      React = require('react'),
      ReactDOM = require('react-dom'),
      moment = require('moment');

(() => {
  const tomorrow = moment().add(1, 'day').endOf('day'),
        firstScan = moment(firstscan).startOf('day');

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
      this.fetchData = this.fetchData.bind(this);
      this.previous = this.previous.bind(this);
      this.next = this.next.bind(this);
      this.timespan = this.timespan.bind(this);
      this.onDatesChange = this.onDatesChange.bind(this);
      this.onFocusChange = this.onFocusChange.bind(this);
      this.isOutsideRange = this.isOutsideRange.bind(this);
      this.initialVisibleMonth = this.initialVisibleMonth.bind(this);
    }
    // Called to get data from the API to update the chart
    fetchData(sentStart, sentEnd) {
      const start = sentStart.format('YYYYMMDD'),
            end = sentEnd.format('YYYYMMDD');
      fetch(`http://${apiurl}/api/range/${start}/${end}`)
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
      // React D3 configuration settings
      const margins = {
              top: 20,
              right: 50,
              bottom: 20,
              left: 50
            },
            chartSeries = [
              {
                field: 'ping',
                name: 'Ping (ms)',
                color: 'orange'
              },
              {
                field: 'upload',
                name: 'Upload (Mbit/s)',
                color: 'green'
              },
              {
                field: 'download',
                name: 'Download (Mbit/s)',
                color: 'red'
              }
            ],
            height = window.innerHeight - 160,
            width = window.innerWidth - 10,
            x = data => moment(data.scantime).toDate(),
            xScale = 'time';
      return(
        <div>
          <Controls
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            range={this.state.range}
            focusedInput={this.state.focusedInput}
            timespan={this.timespan}
            previous={this.previous}
            next={this.next}
            onFocusChange={this.onFocusChange}
            onDatesChange={this.onDatesChange}
            isOutsideRange={this.isOutsideRange}
            initialVisibleMonth={this.initialVisibleMonth}
          />
          <div className={'chart'}>
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
          <footer>
            <span>&copy; Ryan Tanay {moment().format('YYYY')} - <a href={'https://github.com/NewEvolution/speedtest'}>source</a></span>
          </footer>
        </div>
      )
    }
  };

  const Controls = ({
    startDate,
    endDate,
    range,
    focusedInput,
    timespan,
    previous,
    next,
    onFocusChange,
    onDatesChange,
    isOutsideRange,
    initialVisibleMonth
  }) =>
    <div className={'controls'}>
      <button
        className={'nav-button'}
        disabled={startDate.isSameOrBefore(firstScan, 'day')}
        onClick={() => previous()}
      >&laquo;</button>
      <div className={'center-block'}>
        <div>
          <SpanButton name={'Day'} range={range} timespan={timespan} />
          <SpanButton name={'Week'} range={range} timespan={timespan} />
          <SpanButton name={'Month'} range={range} timespan={timespan} />
          <SpanButton name={'Year'} range={range} timespan={timespan} />
        </div>
        <div>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            focusedInput={focusedInput}
            onFocusChange={onFocusChange}
            onDatesChange={onDatesChange}
            isOutsideRange={isOutsideRange}
            initialVisibleMonth={initialVisibleMonth}
          />
        </div>
      </div>
      <button
        className={'nav-button'}
        disabled={endDate.isSameOrAfter(tomorrow, 'day')}
        onClick={() => next()}
      >&raquo;</button>
    </div>;

  const SpanButton = ({name, range, timespan}) => {
    const active = name.toLowerCase() == range;
    return(
      <button
        className={`range-button ${active ? 'active' : ''}`}
        disabled={active}
        onClick={e => timespan(e)}
        value={name.toLowerCase()}
      >{name}</button>
    )
  }

  ReactDOM.render(<Content />, document.getElementById('app'));
})()
