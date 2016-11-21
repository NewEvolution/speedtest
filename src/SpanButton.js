'use strict';

const React = require('react');

module.exports = ({name, range, timespan}) => {
  const active = name.toLowerCase() == range;
  return(
    <button className={`range-button ${active ? 'active' : ''}`}
            disabled={active}
            onClick={e => timespan(e)}
            value={name.toLowerCase()}>{name}</button>
  )
}
