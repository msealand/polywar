import React from 'react';
import { Territory } from './Territory';
import { MapComponent } from './Map';

import { loadBoard } from './loadBoard';

export type Board = {
  territories: Array<Territory>
}

const DeploymentToolsComponent = (props: any) => {
  return (
    <div>
      <button onClick={() => {
        props.moves.completeDeploymentPhase();
      }}>Complete Deployment</button>
    </div>
  )
}

const AttackToolsComponent = (props: any) => {
  return (
    <div>
      <button onClick={() => {
        props.moves.completeAttackPhase();
      }}>Complete Attacks</button>
    </div>
  )
}

const TransferToolsComponent = (props: any) => {
  return (
    <div>
      <button onClick={() => {
        props.moves.completeTransferPhase();
      }}>Complete Transfers</button>
    </div>
  )
}

export const BoardComponent = (props: any) => {
  const board = loadBoard(props.G, props.ctx);
  const stage = props.ctx.activePlayers[props.playerID];

  let tools;
  let isTerritoryActive: ((territory: Territory) => boolean) | undefined = undefined;
  if (stage === 'deploy') {
    tools = <DeploymentToolsComponent moves={props.moves} />
    isTerritoryActive = (territory: Territory) => {
      return (territory.controlledBy === props.playerID)
    }
  } else if (stage === 'attack') {
    tools = <AttackToolsComponent moves={props.moves} />
  } else if (stage === 'transfer') {
    tools = <TransferToolsComponent moves={props.moves} />
    isTerritoryActive = (territory: Territory) => {
      return (territory.controlledBy === props.playerID)
    }
  }

  return (
    <div className="h-100">
      <div className="row align-items-center">
        <div className="col d-flex justify-content-center">
          <div className="toolbar">
            {tools}
          </div>
        </div>
      </div>
      <div className="row align-items-center">
          <div className="col d-flex justify-content-center">
              <div className="map">
                  <MapComponent board={board} moves={props.moves} isTerritoryActive={isTerritoryActive} />
              </div>
          </div>
      </div>
    </div>
  );
};
