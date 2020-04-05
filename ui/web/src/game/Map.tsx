import React from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

import { Territory } from 'polywar';
import { TerritoryComponent, TerritoryBorderComponent, TerritoryConnectionsComponent } from './Territory';

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

  // Original size of map...
  const CANVAS_VIRTUAL_WIDTH = 1003;
  const CANVAS_VIRTUAL_HEIGHT = 588;

  const windowWidth = window.innerWidth;
  let width = CANVAS_VIRTUAL_WIDTH;
  
  // Some gusses on sizes based on window width
  if (windowWidth > 1200) {
    width = CANVAS_VIRTUAL_WIDTH;
  } else if (windowWidth > 992) {
    width = 800;
  } else if (windowWidth > 768) {
    width = 600;
  } else if (windowWidth > 576) {
    width = 480;
  } else {
    width = 320;
  }

  const height = (width * (CANVAS_VIRTUAL_HEIGHT / CANVAS_VIRTUAL_WIDTH));
  const scale = width / CANVAS_VIRTUAL_WIDTH;
  
  return (
    <div className="map mx-auto" style={{ width: width + 2 }}>
      <Stage width={width} height={height} scaleX={scale} scaleY={scale}>
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
    </div>
  );
};
