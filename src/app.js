'use strict';

const React = require('react');

class Test extends React.Component {
  render() {
    return(
      <div>
        <p>This is insane</p>
      </div>
    )
  };
};

const ReactDOM = require('react-dom');

ReactDOM.render(<Test />, document.getElementById('app'));
