import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import { MainView } from './components/main-view/main-view';

class MyFlixApplication extends React.Component {
  render() {
    return <MainView />
  }
}

const container = document.querySelector('.app-container');
ReactDOM.render(React.createElement(MyFlixApplication), container);
