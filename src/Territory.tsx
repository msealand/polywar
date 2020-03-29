import React, { useState } from 'react';
import { Circle, Text } from 'react-konva';

export type Coordinate = { x: number, y: number };

export type Territory = {
  id: string;
  name: string;
  colorIdx: number;

  position: Coordinate;
  borders: Array<string>;

  units: number;
};

type TerritoryComponentState = {
  territory: Territory,
  hovering: boolean
}

export const TerritoryComponent = (props: { territory: Territory }) => {
  const [territoryState, setTerritoryState] = useState<TerritoryComponentState>({ territory: props.territory, hovering: false });
  const territory = territoryState.territory;

  const handleClick = () => {
    if (territory.colorIdx === undefined) {
      territory.colorIdx = 7;
    }
    territory.units = (territory.units ?? 0) + 1;
    setTerritoryState({ territory, hovering: territoryState.hovering });
  };

  const handleMouseEnter = () => {
    setTerritoryState({ territory, hovering: true })
  }

  const handleMouseLeave = () => {
    setTerritoryState({ territory, hovering: false });
  }

  const units = territory.units ?? 0;

  const fillColor = territory.colorIdx ? `hsl(${(territory.colorIdx ?? 0) * 137.508}, 50%, 25%)` : `hsl(0, 0%, 25%)`;
  const strokeColor = territory.colorIdx ? `hsl(${(territory.colorIdx ?? 0) * 137.508}, 100%, 70%)` : `hsl(0, 0%, 70%)`;

  const scale = territoryState.hovering ? 1.5 : 1.0

  return (
    <React.Fragment>
      <Circle x={territory.position.x} y={territory.position.y} radius={9} fill={fillColor} scale={{ x: scale, y: scale}} />
      <Circle x={territory.position.x} y={territory.position.y} radius={9} strokeWidth={2} stroke={strokeColor} scale={{ x: scale, y: scale}} />
      <Text 
        x={territory.position.x - (territory.units < 10 ? 11.5 : 12)} // Being super picky here
        y={territory.position.y - 11.5} 
        width={24} 
        height={24} 
        fontSize={(units < 100 ? (units < 10 ? 11 : 10) : 8) * scale}
        fontStyle="bold"
        fontFamily="source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
        fill="white" 
        align="center" 
        verticalAlign="middle" 

        text={`${units}`} 
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </React.Fragment>
  );
};
