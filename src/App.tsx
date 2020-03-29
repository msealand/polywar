import React, { Component } from 'react';
import { Board } from './Board';

class App extends Component {
  render() {
    return (
      <div className="h-100 row align-items-center">
        <div className="col d-flex justify-content-center">
          <Board width={1003} height={588} />
        </div>
      </div>
    );
  }
}

export default App;
