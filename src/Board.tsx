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

export class Board extends React.Component {
  render() {
    return (<Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <BoardMapImage boardId="1584805889" />
      </Layer>
      <Layer>

        <Territory x={135} y={275} colorIdx={0} />
        <Territory x={235} y={255} colorIdx={1} />
        <Territory x={165} y={475} colorIdx={2} />
        <Territory x={435} y={365} colorIdx={3} />
        <Territory x={353} y={275} colorIdx={4} />
        <Territory x={168} y={542} colorIdx={5} />
        <Territory x={257} y={532} colorIdx={6} />
        <Territory x={321} y={342} colorIdx={7} />
      </Layer>
    </Stage>);
  }
}
