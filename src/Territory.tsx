import React, { useState } from 'react';
import { Circle, Text, Line } from 'react-konva';

export type Coordinate = { x: number, y: number };

export type Territory = {
  id: string;
  name: string;
  colorIdx: number;

  position: Coordinate;
  border: Array<Coordinate>;

  borderingTerritories: Array<Territory>;

  units: number;
};

type TerritoryComponentState = {
  territory: Territory,
  hovering: boolean
}

const wrapDeltaWidth = (1003 * 0.5);
const wrapDeltaHeight = (588 * 0.5);

export const TerritoryBorderComponent = (props: { territory: Territory }) => {
  const [territoryState] = useState<TerritoryComponentState>({ territory: props.territory, hovering: false });
  const territory = territoryState.territory;

  const fillColor = territory.colorIdx ? `hsl(${(territory.colorIdx ?? 0) * 137.508}, 50%, 25%)` : `hsl(0, 0%, 25%)`;
  const strokeColor = territory.colorIdx ? `hsl(${(territory.colorIdx ?? 0) * 137.508}, 100%, 70%)` : `hsl(0, 0%, 70%)`;

  const borderPoints = territory.border.reduce<Array<number>>((pts, pt) => {
    pts.push(pt.x, pt.y);
    return pts;
  }, [])

  return (
    <React.Fragment>
      <Line points={borderPoints} stroke={strokeColor} fill={fillColor} closed opacity={0.25} />
    </React.Fragment>
  );
};

export const TerritoryConnectionsComponent = (props: { territory: Territory }) => {
  const [territoryState] = useState<TerritoryComponentState>({ territory: props.territory, hovering: false });
  const territory = territoryState.territory;

  const territoryColor = territory.colorIdx ? `hsl(${(territory.colorIdx ?? 0) * 137.508}, 100%, 70%)` : `hsl(0, 0%, 70%)`;

  const pos = territory.position;
  const connectingLines = territory.borderingTerritories.map((otherTerritory) => {
    const otherPos = Object.assign({}, otherTerritory.position);
    const otherColor = otherTerritory.colorIdx ? `hsl(${(otherTerritory.colorIdx ?? 0) * 137.508}, 100%, 70%)` : `hsl(0, 0%, 70%)`;

    const xDelta = Math.abs(pos.x - otherPos.x);
    if (xDelta > wrapDeltaWidth) {
        if (pos.x > otherPos.x) { otherPos.x += (xDelta * 2.0) }
        else { otherPos.x -= (xDelta * 2.0) }
    } 

    const yDelta = Math.abs(pos.y - otherPos.y);
    if (yDelta > wrapDeltaHeight) {
        if (pos.y > otherPos.y) { otherPos.y += (yDelta * 2.0) }
        else { otherPos.y -= (yDelta * 2.0) }
    }

    return <Line 
      points={[ pos.x, pos.y, otherPos.x, otherPos.y ]}
      strokeWidth={1}
      strokeLinearGradientStartPointX={pos.x}
      strokeLinearGradientStartPointY={pos.y}
      strokeLinearGradientEndPointX={otherPos.x}
      strokeLinearGradientEndPointY={otherPos.y}
      strokeLinearGradientColorStops={[0, territoryColor, 1, otherColor]}
    />
  });

  return (
    <React.Fragment>
      {connectingLines}
    </React.Fragment>
  );
};

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
