import React from 'react';
import { Circle, Text, Line, Group } from 'react-konva';

import { Territory } from 'polywar'
import { colorsForIdx } from './Colors';

type IsTerritoryConnectionActiveCallback = (otherTerritory: Territory) => boolean;
type IsTerritoryActiveCallback = () => boolean;
type TerritoryClickHandler = () => void;

const wrapDeltaWidth = (1003 * 0.5);
const wrapDeltaHeight = (588 * 0.5);

export const TerritoryBorderComponent = (props: { territory: Territory }) => {
  const territory = props.territory;

  const { fillColor, strokeColor } = colorsForIdx(territory.colorIdx);//, territory.fogged);

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

  const { strokeColor: territoryColor } = colorsForIdx(territory.colorIdx);//, territory.fogged);

  const pos = territory.position;
  const connectingLines = territory.borderingTerritories.map((otherTerritory) => {
    const otherPos = Object.assign({}, otherTerritory.position);
    const { strokeColor: otherColor } = colorsForIdx(otherTerritory.colorIdx);//, otherTerritory.fogged);

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

export const TerritoryComponent = (props: { 
  territory: Territory, 
  isActive?: IsTerritoryActiveCallback, 
  handleClick: TerritoryClickHandler, 
  handleEntry?: TerritoryClickHandler, 
  handleExit?: TerritoryClickHandler 
}) => {
  const territory = props.territory;
  const isActive = (props.isActive ? props.isActive() : false);

  let groupNode: any; // Can't seem to make "Group" work as a type here for some reason...

  const handleMouseEnter = () => {
    // if (isActive) {
      groupNode?.to({
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 0.2
      });
    // }

    if (props.handleEntry) {
      props.handleEntry();
    }
  }

  const handleMouseLeave = () => {
    // if (isActive) {
      groupNode?.to({
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 0.2
      });
    // }

    if (props.handleExit) {
      props.handleExit();
    }
  }

  const units = territory.units ?? 0;

  const { fillColor, strokeColor, textColor } = colorsForIdx(territory.colorIdx, /*territory.fogged*/false, isActive);
  const strokeWidth = (isActive ? 2.5 : 0.5)

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
      <Circle radius={9} strokeWidth={strokeWidth} stroke={strokeColor} />
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
