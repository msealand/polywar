import React, { useState } from 'react';
import { Territory } from './Territory';
import { MapComponent } from './Map';

import { loadBoard } from './loadBoard';

export type Board = {
  territories: Array<Territory>
}

export const BoardComponent = (props: any) => {
  console.log(`BoardComponent created`, props);

  const [board] = useState<Board>(loadBoard(props.G.boardData));

  return (
    <div className="h-100 row align-items-center">
        <div className="col d-flex justify-content-center">
            <MapComponent width={1003} height={588} board={board} />
        </div>
    </div>
  );
};
