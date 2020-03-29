import React, { Component } from 'react';
import { Board } from './Board';

class App extends Component {
  render() {
    return (
      <Board width={1003} height={588} />
    );
  }
}

export default App;
