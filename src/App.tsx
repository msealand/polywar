import React, { Component } from 'react';
import { BoardComponent } from './Board';


import { loadBoard } from './loadBoard';
const board = loadBoard();


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
