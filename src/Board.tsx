import React from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

import { Territory } from './Territory';

const BoardMapImage = (props: {
  boardId: string;
}) => {
  const [image] = useImage(`testassets/${props.boardId}.png`);
  return <Image image={image} />;
};

type BoardOptions = {
  width: number,
  height: number
}

export const Board = (props: BoardOptions) => {
  return (
    // width={window.innerWidth} height={window.innerHeight}
  <Stage width={props.width} height={props.height}>
    <Layer>
      <BoardMapImage boardId="1584805889" />
    </Layer>
    <Layer>
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={0} />
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={1} />
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={2} />
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={3} />
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={4} />
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={5} />
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={6} />
      <Territory x={Math.random() * props.width} y={Math.random() * props.height} colorIdx={7} />
    </Layer>
  </Stage>
  );
};
