import React, { useState } from 'react';
import { Circle, Text, Line, Group } from 'react-konva';

export type Coordinate = { x: number, y: number };

export type Territory = {
  id: string;
  name: string;
  colorIdx: number;

  position: Coordinate;
  border: Array<Coordinate>;

  borderingTerritories: Array<Territory>;

  units: number;

  fogged: boolean;
};

type TerritoryComponentState = {
  territory: Territory
}

const wrapDeltaWidth = (1003 * 0.5);
const wrapDeltaHeight = (588 * 0.5);

function colorsForTerritory(territory: Territory) {
  if (territory.fogged) {
    const fog = 'hsla(0, 0%, 25%, 0)';
    return {
      fillColor: fog,
      strokeColor: fog,
      textColor: fog
    }
  } else {
    const fillColor = territory.colorIdx ? `hsl(${(territory.colorIdx ?? 0) * 137.508}, 50%, 25%)` : `hsl(0, 0%, 25%)`;
    const strokeColor = territory.colorIdx ? `hsl(${(territory.colorIdx ?? 0) * 137.508}, 100%, 70%)` : `hsl(0, 0%, 70%)`;
    const textColor = 'white';
    return { fillColor, strokeColor, textColor };
  }
}

export const TerritoryBorderComponent = (props: { territory: Territory }) => {
  const [territoryState] = useState<TerritoryComponentState>({ territory: props.territory });
  const territory = territoryState.territory;

  const { fillColor, strokeColor } = colorsForTerritory(territory);

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
  const [territoryState] = useState<TerritoryComponentState>({ territory: props.territory });
  const territory = territoryState.territory;

  const { strokeColor: territoryColor } = colorsForTerritory(territory);

  const pos = territory.position;
  const connectingLines = territory.borderingTerritories.map((otherTerritory) => {
    const otherPos = Object.assign({}, otherTerritory.position);
    const { strokeColor: otherColor } = colorsForTerritory(otherTerritory);

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

    return <Line key={`${territory.id}-${otherTerritory.id}`}
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
  const [territoryState, setTerritoryState] = useState<TerritoryComponentState>({ territory: props.territory });
  const territory = territoryState.territory;

  let groupNode: any; // Can't seem to make "Group" work as a type here for some reason...

  const handleClick = () => {
    if (territory.colorIdx === undefined) {
      territory.colorIdx = 7;
    }
    territory.units = (territory.units ?? 0) + 1;
    setTerritoryState({ territory });
  };

  const handleMouseEnter = () => {
    groupNode?.to({
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 0.2
    });
  }

  const handleMouseLeave = () => {
    groupNode?.to({
      scaleX: 1.0,
      scaleY: 1.0,
      duration: 0.2
    });
  }

  const units = territory.units ?? 0;

  const { fillColor, strokeColor, textColor } = colorsForTerritory(territory);

  return (
    <Group
      ref={(node) => groupNode = node}

      x={territory.position.x}
      y={territory.position.y} 

      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Circle radius={9} fill={fillColor} />
      <Circle radius={9} strokeWidth={2} stroke={strokeColor} />
      <Text 
        x={-(units < 10 ? 11.75 : 12)} // Being super picky here
        y={-11.5}
        width={24} 
        height={24} 
        fontSize={(units < 100 ? (units < 10 ? 11 : 10) : 8)}
        fontStyle="bold"
        fontFamily="source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
        fill={textColor} 
        align="center" 
        verticalAlign="middle" 
        text={`${units}`} 
      />
    </Group>
  );
};
