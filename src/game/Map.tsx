import React from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

import { Territory, TerritoryComponent, TerritoryBorderComponent, TerritoryConnectionsComponent } from './Territory';

export type Board = {
  territories: Array<Territory>
}

const MapImageComponent = (props: {
  boardId: string;
}) => {
  const [image] = useImage(`testassets/${props.boardId}.png`);
  return <Image image={image} />;
};

export const MapComponent = (props: any) => {
  const { board, moves, isTerritoryActive }: { board: Board, moves: any, isTerritoryActive?: (territory: Territory) => boolean } = props;

  const territoryComponents = board.territories.map((territory) => {
    const isActive = (isTerritoryActive ? isTerritoryActive(territory) : false);
    return <TerritoryComponent key={territory.id} territory={territory} isActive={isActive} handleClick={() => {
      moves.deployUnits(territory.id, 1);
    }} />
  })
  
  const territoryBorderComponents = (false ? board.territories : []).map((territory) => {
    return <TerritoryBorderComponent key={territory.id} territory={territory} />
  })

  const territoryConnectionsComponents = board.territories.map((territory) => {
    return <TerritoryConnectionsComponent key={territory.id} territory={territory} />
  })

  return (
    <Stage width={1003} height={588}>
      <Layer>
        <MapImageComponent boardId="1584805889" />
      </Layer>
      <Layer>
        {territoryBorderComponents}
      </Layer>
      <Layer>
        {territoryConnectionsComponents}
      </Layer>
      <Layer>
        {territoryComponents}
      </Layer>
    </Stage>
  );
};
