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
  attacker?: string;
  defender?: string;

  hoverTerritory?: Territory;
}

export const BoardComponent = (props: any) => {
  // console.log(props);

  const board = loadBoard(props.G, props.playerID);
  const stage = props.ctx.activePlayers[props.playerID];
  const players = props.gameMetadata.reduce((players, p) => {
    players[p.id] = p;
    return players;
  }, {});

  const [ boardState, setBoardState ] = useState<BoardState>({});

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
  }

  const toolsCard = () => {
    if (props.ctx.currentPlayer === props.playerID) {
      return  (
        <div className="card">
          <div className="card-body">
            {tools}
          </div>
        </div>
      )
    } else {
      return (
        <div className="alert alert-dark mb-0 text-center" role="alert">
          {players[props.ctx.currentPlayer].name}'s turn
        </div>
      )
    }
  }

  const controlledBy = (t: Territory) => {
    const player = players[t.controlledBy]
    if (player) {
      return (<li className="list-group-item">Controlled By: {player.name}</li>)
    } else {
      return (<li className="list-group-item">Neutral Territory</li>)
    }
  }

  const territoryState = () => {
    const t = boardState.hoverTerritory;
    if (t) {
      return (
        <div className="card">
          <div className="card-header">
            <h5 className="text-center mb-0">{t.name}</h5>
          </div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">{t.units} Units</li>
              {controlledBy(t)}
            </ul>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {toolsCard()}
        </div>

        <div className="col">
            <MapComponent 
              board={board} 
              isTerritoryActive={isTerritoryActive} 
              handleTerritoryClick={handleTerritoryClick}
              handleTerritoryEntry={(territory: Territory) => {
                setBoardState({ attacker: boardState.attacker, defender: boardState.defender, hoverTerritory: territory });
              }}
              handleTerritoryExit={() => {
                setBoardState({ attacker: boardState.attacker, defender: boardState.defender, hoverTerritory: undefined });
              }}
            />
        </div>

        <div className="col">
          {territoryState()}
        </div>
      </div>
    </div>
  );
};
