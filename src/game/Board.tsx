import React from 'react';
import { Territory } from './Territory';
import { MapComponent } from './Map';

import { loadBoard } from './loadBoard';

export type Board = {
  territories: Array<Territory>
}

export const BoardComponent = (props: any) => {
  const board = loadBoard(props.G, props.ctx);

  return (
    <div className="h-100 row align-items-center">
        <div className="col d-flex justify-content-center">
            <div><button onClick={() => {
              console.log(`end stage?`)
              props.events.endStage()
              console.log(props.ctx);
            }}>Done</button></div>
            <div className="map">
                <MapComponent width={1003} height={588} board={board} moves={props.moves} />
            </div>
        </div>
    </div>
  );
};
