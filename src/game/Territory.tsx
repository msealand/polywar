import React from 'react';
import { Circle, Text, Line, Group } from 'react-konva';

import { Territory } from './proxy'

type IsTerritoryConnectionActiveCallback = (otherTerritory: Territory) => boolean;
type IsTerritoryActiveCallback = () => boolean;
type TerritoryClickHandler = () => void;

const wrapDeltaWidth = (1003 * 0.5);
const wrapDeltaHeight = (588 * 0.5);

function colorsForTerritory(territory: Territory, isActive: boolean = true) {
  if (territory.fogged) {
    const fog = 'hsla(0, 0%, 25%, 0)';
    return {
      fillColor: fog,
      strokeColor: fog,
      textColor: fog
    }
  } else {
    const alpha = 1.0;
    const fillColor = territory.colorIdx ? `hsla(${(territory.colorIdx ?? 0) * 137.508}, 50%, 25%, ${alpha})` : `hsla(0, 0%, 25%, ${alpha})`;
    const strokeColor = 
      isActive ?
        territory.colorIdx ? `hsla(${(territory.colorIdx ?? 0) * 137.508}, 100%, 70%, ${alpha})` : `hsla(0, 0%, 70%, ${alpha})`
      : territory.colorIdx ? `hsla(${(territory.colorIdx ?? 0) * 137.508}, 90%, 60%, ${alpha})` : `hsla(0, 0%, 60%, ${alpha})`;
    const textColor = `hsla(0, 100%, 100%, ${alpha})`;
    return { fillColor, strokeColor, textColor };
  }
}

export const TerritoryBorderComponent = (props: { territory: Territory }) => {
  const territory = props.territory;

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

export const TerritoryConnectionsComponent = (props: { territory: Territory, isActive?: IsTerritoryConnectionActiveCallback }) => {
  const territory = props.territory;

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

    const isActive = (props.isActive ? props.isActive(otherTerritory) : false);

    return <Line key={`${territory.id}-${otherTerritory.id}`}
      points={[ pos.x, pos.y, otherPos.x, otherPos.y ]}
      strokeWidth={isActive ? 2.5 : 0.5}
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

export const TerritoryComponent = (props: { territory: Territory, isActive?: IsTerritoryActiveCallback, handleClick: TerritoryClickHandler }) => {
  const territory = props.territory;
  const isActive = (props.isActive ? props.isActive() : false);

  let groupNode: any; // Can't seem to make "Group" work as a type here for some reason...

  const handleMouseEnter = () => {
    if (isActive) {
      groupNode?.to({
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 0.2
      });
    }
  }

  const handleMouseLeave = () => {
    if (isActive) {
      groupNode?.to({
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 0.2
      });
    }
  }

  const units = territory.units ?? 0;

  const { fillColor, strokeColor, textColor } = colorsForTerritory(territory, isActive);

  return (
    <Group
      ref={(node) => groupNode = node}

      x={territory.position.x}
      y={territory.position.y} 

      onClick={props.handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Circle radius={9} fill={fillColor} />
      <Circle radius={9} strokeWidth={isActive ? 2.5 : 0.5} stroke={strokeColor} />
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
