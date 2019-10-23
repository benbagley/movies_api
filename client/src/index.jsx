import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

class MyFlixApplication extends React.Component {
  render() {
    return (
      <div className="my-flix">
        <div>
          <h1>Good Morning</h1>
        </div>
      </div>
    );
  }
}

const container = document.querySelector('.app-container');
ReactDOM.render(React.createElement(MyFlixApplication), container);
