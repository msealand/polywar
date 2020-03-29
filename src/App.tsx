import React, { Component } from 'react';
import { BoardComponent, Board } from './Board';

const board = require('./map.json') as Board;

class App extends Component {
  render() {
    return (
      <div className="h-100 row align-items-center">
        <div className="col d-flex justify-content-center">
          <BoardComponent width={1003} height={588} board={board} />
        </div>
      </div>
    );
  }
}

export default App;
