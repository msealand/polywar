import React, { useState } from 'react';
import { Circle } from 'react-konva';

type TerritoryState = {
  color: string;
  colorIdx: number;
};

export const Territory = (props: {
  x: number;
  y: number;
  colorIdx?: number;
}) => {
  const [state, setState] = useState<TerritoryState>({ color: `hsl(${(props.colorIdx ?? 0) * 137.508}, 100%, 70%)`, colorIdx: props.colorIdx ?? 0 });

  const handleClick = () => {
    const newIdx = state.colorIdx + 1;
    const newColor = `hsl(${newIdx * 137.508}, 100%, 70%)`;
    setState({
      color: newColor,
      colorIdx: newIdx
    });
  };
  
  return <Circle x={props.x} y={props.y} radius={9} fill={state.color} onClick={handleClick} />;
};
