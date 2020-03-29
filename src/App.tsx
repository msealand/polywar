import React, { Component } from 'react';
import { BoardComponent, Board } from './Board';
import { Territory } from './Territory';


import { Delaunay } from "d3-delaunay";

function loadBoard(): Board {
  const boardData = require('./map.json') as Board;

  const territoryMap = boardData.territories.reduce((map, t) => {
    map.set(t.id, t);
    return map;
  }, new Map<string, Territory>());

  const territories = Array.from(territoryMap.values())
  
  const allPoints = territories.reduce<Array<Array<number>>>((points, t) => {
    points.push([t.position.x, t.position.y]);
    return points;
  }, []);

  const delaunay = Delaunay.from(allPoints);
  const voronoi = delaunay.voronoi([-1, -1, 1004, 589]);

  territories.forEach((t, idx) => {
    t.borderingTerritories = (t as any).borders.map((id: string) => territoryMap.get(id));
    t.border = voronoi.cellPolygon(idx).map((p) => {
      return { x: p[0], y: p[1] }
    });

    // t.colorIdx = idx;

    return t;
  })

  return boardData;
}


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
