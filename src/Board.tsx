import React, { useState } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

import { Territory, TerritoryComponent, TerritoryBorderComponent, TerritoryConnectionsComponent } from './Territory';

export type Board = {
  territories: Array<Territory>
}

const BoardMapImage = (props: {
  boardId: string;
}) => {
  const [image] = useImage(`testassets/${props.boardId}.png`);
  return <Image image={image} />;
};

type BoardOptions = {
  width: number,
  height: number,

  board: Board
}

export const BoardComponent = (props: BoardOptions) => {
  const [board, setBoard] = useState<Board>(props.board);

  const territoryComponents = board.territories.map((territory, idx) => {
    return <TerritoryComponent key={territory.id} territory={territory} />
  })  
  
  const territoryBorderComponents = board.territories.map((territory, idx) => {
    return <TerritoryBorderComponent key={territory.id} territory={territory} />
  })

  const territoryConnectionsComponents = board.territories.map((territory, idx) => {
    return <TerritoryConnectionsComponent key={territory.id} territory={territory} />
  })

  return (
    <Stage width={props.width} height={props.height}>
      <Layer>
        <BoardMapImage boardId="1584805889" />
      </Layer>
      {/* <Layer>
        {territoryBorderComponents}
      </Layer> */}
      <Layer>
        {territoryConnectionsComponents}
      </Layer>
      <Layer>
        {territoryComponents}
      </Layer>
    </Stage>
  );
};
