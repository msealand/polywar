import React, { useState } from 'react';
import { Circle } from 'react-konva';

type TerritoryState = {
  colorIdx: number;
};

export const Territory = (props: {
  x: number;
  y: number;
  colorIdx?: number;
}) => {
  const [state, setState] = useState<TerritoryState>({ colorIdx: props.colorIdx ?? 0 });

  const handleClick = () => {
    const newIdx = state.colorIdx + 1;
    setState({
      colorIdx: newIdx
    });
  };

  return (
    <React.Fragment>
      <Circle x={props.x} y={props.y} radius={9} stroke={`hsl(${(state.colorIdx ?? 0) * 137.508}, 100%, 70%)`} onClick={handleClick} />
      <Circle x={props.x} y={props.y} radius={9} fill={`hsl(${(state.colorIdx ?? 0) * 137.508}, 50%, 25%)`} onClick={handleClick} />
    </React.Fragment>
  );
};
