'use strict';

const React = require('react'),
      DateRangePicker = require('react-dates').DateRangePicker,
      SpanButton = require('./SpanButton.jsx');

module.exports = ({
  firstScan,
  tomorrow,
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
}) => {
  const spans = ['Day', 'Week', 'Month', 'Year'],
        spanButtons = spans.map(name =>
          <SpanButton key={name}
                      name={name}
                      range={range}
                      timespan={timespan} />
        );
  return(
    <div className={'controls'}>
      <button className={'nav-button'}
              disabled={startDate.isSameOrBefore(firstScan, 'day')}
              onClick={() => previous()}>&laquo;</button>
      <div className={'center-block'}>
        <div>
          {spanButtons}
        </div>
        <div>
          <DateRangePicker startDate={startDate}
                           endDate={endDate}
                           focusedInput={focusedInput}
                           onFocusChange={onFocusChange}
                           onDatesChange={onDatesChange}
                           isOutsideRange={isOutsideRange}
                           initialVisibleMonth={initialVisibleMonth} />
        </div>
      </div>
      <button className={'nav-button'}
              disabled={endDate.isSameOrAfter(tomorrow, 'day')}
              onClick={() => next()}>&raquo;</button>
    </div>
  )
}
