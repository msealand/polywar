import React, { useState } from 'react';
import { Territory } from 'polywar';
import { MapComponent } from './Map';

import { loadBoard } from './loadBoard';

export type Board = {
  territories: Array<Territory>
}

const DeploymentToolsComponent = (props: any) => {
  return (
    <div className="text-center">
      <button 
        type="button" className="btn btn-primary"
        onClick={() => {
          props.moves.completeDeploymentPhase();
        }}
      >
        Complete Deployment
      </button>
    </div>
  )
}

const AttackToolsComponent = (props: any) => {
  let attackButton;
  if (props.attacker && props.defender) {
    attackButton = <button 
      type="button" className="btn btn-primary"
      onClick={() => {
        props.moves.attack(props.attacker, props.defender);
      }}
    >
      Attack
    </button>
  } else {
    attackButton = <button 
      type="button" className="btn btn-primary"
      onClick={() => {
        props.moves.completeAttackPhase();
      }}
    >
      Finished Attacking
    </button>
  }

  return (
    <div className="text-center">
      {attackButton}
    </div>
  )
}

const PostAttackTransferToolsComponent = (props: any) => {
  return (
    <div className="text-center">
      <button 
        type="button" className="btn btn-primary"
        onClick={() => {
          props.moves.postAttackTransfer();
        }}
      >
        Transfer
      </button>
    </div>
  )
}

const TransferToolsComponent = (props: any) => {
  return (
    <div className="text-center">
      <button 
        type="button" className="btn btn-primary"
        onClick={() => {
          props.moves.completeTransferPhase();
        }}
      >
        Finished Transfers
      </button>
    </div>
  )
}

type BoardState = {
  attacker: string | undefined;
  defender: string | undefined;
}

export const BoardComponent = (props: any) => {
  const board = loadBoard(props.G, props.playerID);
  const stage = props.ctx.activePlayers[props.playerID];

  const [ boardState, setBoardState ] = useState<BoardState>({ attacker: undefined, defender: undefined });

  let tools;
  let isTerritoryActive: ((territory: Territory) => boolean) | undefined = undefined;
  let handleTerritoryClick: ((territory: Territory) => void) | undefined = undefined;
  if (stage === 'deploy') {
    tools = <DeploymentToolsComponent moves={props.moves} />
    isTerritoryActive = (territory: Territory) => {
      return (territory.controlledBy === props.playerID); //(((territory.controlledBy === undefined) && ((territory.units ?? 0) <= 0)) || (territory.controlledBy === props.playerID));
    }
    handleTerritoryClick = (territory: Territory) => {
      props.moves.deployUnits(territory.id, 1);
    }
  } else if (stage === 'attack') {
    tools = <AttackToolsComponent moves={props.moves} attacker={boardState.attacker} defender={boardState.defender} />
    if (boardState.attacker && !boardState.defender) {
      isTerritoryActive = (territory: Territory) => {
        const doesBorder = territory.borderingTerritories.some((t) => t.id === boardState.attacker);
        return (doesBorder && ((territory.units ?? 0) > 0) && (territory.controlledBy !== props.playerID)) || (territory.id === boardState.attacker)
      }
      handleTerritoryClick = (territory: Territory) => {
        setBoardState({ attacker: boardState.attacker, defender: territory.id });
      }
    } else if (boardState.attacker && boardState.defender) {
      isTerritoryActive = (territory: Territory) => {
        return (territory.id === boardState.defender) || (territory.id === boardState.attacker)
      }
      handleTerritoryClick = (territory: Territory) => {
        setBoardState({ attacker: undefined, defender: undefined });
      }
    } else {
      isTerritoryActive = (territory: Territory) => {
        return (territory.controlledBy === props.playerID) && ((territory.units ?? 0) > 0) && territory.borderingTerritories.some((t) => ((t.units ?? 0) > 0) && (t.controlledBy !== props.playerID));
      }
      handleTerritoryClick = (territory: Territory) => {
        setBoardState({ attacker: territory.id, defender: undefined });
      }
    }
  } else if (stage === 'postAttackTransfer') {
    tools = <PostAttackTransferToolsComponent moves={props.moves} />
  } else if (stage === 'transfer') {
    tools = <TransferToolsComponent moves={props.moves} />
    isTerritoryActive = (territory: Territory) => {
      return (territory.controlledBy === props.playerID)
    }
  } else {
    tools = (
      <div className="alert alert-secondary mb-0" role="alert">
        Waiting for other players...
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              {tools}
            </div>
          </div>
        </div>

        <div className="col">
            <MapComponent board={board} isTerritoryActive={isTerritoryActive} handleTerritoryClick={handleTerritoryClick} />
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              Something...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
