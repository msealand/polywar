import React, { useState } from 'react';
import { Circle, Text } from 'react-konva';

type TerritoryState = {
  units: number;
  colorIdx: number;
};

export const Territory = (props: {
  x: number;
  y: number;
  colorIdx?: number;
}) => {
  const [state, setState] = useState<TerritoryState>({ units: 3, colorIdx: props.colorIdx ?? 0 });

  const handleClick = () => {
    const units = state.units + 1;
    setState({
      units: units,
      colorIdx: state.colorIdx
    });
  };

  return (
    <React.Fragment>
      <Circle x={props.x} y={props.y} radius={12} fill={`hsl(${(state.colorIdx ?? 0) * 137.508}, 50%, 25%)`} />
      <Circle x={props.x} y={props.y} radius={12} strokeWidth={2} stroke={`hsl(${(state.colorIdx ?? 0) * 137.508}, 100%, 70%)`} />
      <Text 
        x={props.x - 12}
        y={props.y - 12} 
        width={24} 
        height={24} 
        fontSize={state.units < 100 ? 14 : 10} 
        fontStyle="bold"
        fontFamily="source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
        fill="white" 
        align="center" 
        verticalAlign="middle" 

        text={`${state.units}`} 
        onClick={handleClick}
      />
    </React.Fragment>
  );
};
