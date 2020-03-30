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
  const { board, isTerritoryActive }: { board: Board, isTerritoryActive?: (territory: Territory) => boolean, handleTerritoryClick?: (territory: Territory) => void } = props;

  const territoryComponents = board.territories.map((territory) => {
    return <TerritoryComponent key={territory.id} territory={territory} isActive={() => {
      if (props.isTerritoryActive) return props.isTerritoryActive(territory);
      else return false;
    }} handleClick={() => {
      if (props.handleTerritoryClick) props.handleTerritoryClick(territory);
    }} />
  })
  
  const territoryBorderComponents = (false ? board.territories : []).map((territory) => {
    return <TerritoryBorderComponent key={territory.id} territory={territory} />
  })

  const territoryConnectionsComponents = board.territories.map((territory) => {
    return <TerritoryConnectionsComponent key={territory.id} territory={territory} isActive={
      (otherTerritory) => {
        // if (isTerritoryActive) {
        //   return isTerritoryActive(territory) && isTerritoryActive(otherTerritory);
        // } else {
          return false;
        // }
      }
    } />
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
