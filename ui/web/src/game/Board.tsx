import React, { useState, CSSProperties } from 'react';
import { XCircle } from 'react-bootstrap-icons';

import { Territory, TerritoryGroup } from 'polywar';
import { MapComponent } from './Map';

import { loadBoard } from './loadBoard';
import { colorsForIdx } from './Colors';

export type Board = {
  territories: Array<Territory>
}

const DeploymentToolsComponent = (props: any) => {
  return (
    <div className="text-center">
      <div className="pb-3">{props.player?.reserveUnits ?? 0} Reserve Units</div>

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
  const message = () => {
    if (!props.attacker) return (<div className="pb-3">Pick an attacking territory</div>);
    else if (!props.defender) return (<div className="pb-3">Pick a defending territory</div>);
    else return (
      <div className="pb-3">{props.attacker.name} attacking {props.defender.name}</div>
    )
  }

  const cancelButton = () => {
    if (props.attacker || props.defender) {
      return (
        <XCircle className="float-right" style={{ color: "#f66" }} onClick={() => {
          props.cancel();
        }}></XCircle>
      )
    }
  }

  const attackButton = () => {
    if (props.attacker && props.defender) {
      return (
        <button 
          type="button" className="btn btn-primary"
          onClick={() => {
            props.moves.attack(props.attacker.id, props.defender.id);
          }}
        >
          Attack
        </button>
      )
    }
  }

  const finishedAttackingButton = () => {
    if (!props.attacker || !props.defender) {
      return (
        <button 
          type="button" className="btn btn-primary"
          onClick={() => {
            props.moves.completeAttackPhase();
          }}
        >
          Finished Attacking
        </button>
      )
    }
  }

  return (
    <div className="text-center">
      {cancelButton()}
      {message()}
      {attackButton()}
      {finishedAttackingButton()}
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
  const players = props.G.players;
  props.gameMetadata.forEach((p) => {
    if (!players[p.id]) players[p.id] = {};
    const player = players[p.id];
    Object.assign(player, p);
  })

  const [ boardState, setBoardState ] = useState<BoardState>({});

  let tools;
  let isTerritoryActive: ((territory: Territory) => boolean) | undefined = undefined;
  let handleTerritoryClick: ((territory: Territory) => void) | undefined = undefined;

  if (stage === 'deploy') {
    tools = <DeploymentToolsComponent player={players[props.ctx.currentPlayer]} moves={props.moves} />
    isTerritoryActive = (territory: Territory) => {
      return (territory.controlledBy === props.playerID); //(((territory.controlledBy === undefined) && ((territory.units ?? 0) <= 0)) || (territory.controlledBy === props.playerID));
    }
    handleTerritoryClick = (territory: Territory) => {
      props.moves.deployUnits(territory.id, 1);
    }
  } else if (stage === 'attack') {
    const attacker = boardState.attacker ? board.territories.find((t) => t.id == boardState.attacker) : undefined;
    const defender = boardState.defender ? board.territories.find((t) => t.id == boardState.defender) : undefined;

    tools = <AttackToolsComponent moves={props.moves} attacker={attacker} defender={defender} cancel={() => {
      setBoardState({ attacker: undefined, defender: undefined });
    }} />
    if (boardState.attacker && !boardState.defender) {
      const canBeDefender = (territory: Territory) => {
        const doesBorder = territory.borderingTerritories.some((t) => t.id === boardState.attacker);
        return (doesBorder && ((territory.units ?? 0) > 0) && (territory.controlledBy !== props.playerID))
      }
      isTerritoryActive = canBeDefender;
      handleTerritoryClick = (territory: Territory) => {
        if (canBeDefender(territory)) {
          setBoardState({ attacker: boardState.attacker, defender: territory.id });
        }
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
        if (territory.controlledBy === props.playerID) {
          setBoardState({ attacker: territory.id, defender: undefined });
        }
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
            {/* <button type="button" className="btn btn-sm btn-warning" onClick={() => { 
              props.undo() 
            }}>Undo</button> */}
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
      return (<li className="list-group-item list-group-item-dark">Controlled By: {player.name}</li>)
    } else {
      return (<li className="list-group-item list-group-item-dark">Neutral Territory</li>)
    }
  }

  const groups = (territory?: Territory) => {
    const groups = territory?.groups ?? board.groups;

    return groups.sort((g1, g2) => {
      // const controlledByCurrentPlayer1 = groupIsControlled(board.territories, g1, props.ctx.currentPlayer);
      // const controlledByCurrentPlayer2 = groupIsControlled(board.territories, g2, props.ctx.currentPlayer);

      // if (controlledByCurrentPlayer1 && !controlledByCurrentPlayer2) return -1;
      // else if (controlledByCurrentPlayer2 && !controlledByCurrentPlayer1) return 1;
      // else {
        return g2.bonusUnits - g1.bonusUnits;
      // }
    }).map((g: TerritoryGroup) => {
      const colorIdx = players[g.controlledBy]?.colorIdx;
      const colors = colorsForIdx(colorIdx, g.fogged);

      const style: CSSProperties = {
        backgroundColor: colors.fillColor,
        color: g.fogged ? '#fff' : colors.textColor,
        borderColor: colors.strokeColor
      }

      return (
        <li className={`list-group-item list-group-item-compact`} style={style} key={`territorygroup-${g.id}`}>
          {g.name}
          <div className="float-right">+{g.bonusUnits}</div>
        </li>
      )
    })
  }

  const groupsCard = (territory?: Territory) => {
    return (
      <div className="card mt-3">
        <div className="card-body p-0 m-0 overflow-auto" style={{ height: "500px" }}>
          <ul className="list-group list-group-flush p-0 m-0">
            {groups(territory)}
          </ul>
        </div>
      </div>
    )
  }

  const groupsState = () => {
    const t = boardState.hoverTerritory;
    if (t) {
      return groupsCard(t)
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
              <li className="list-group-item list-group-item-dark">{t.units} Units</li>
              {controlledBy(t)}
            </ul>
          </div>
        </div>
      );
    }
  }

  const playerList = () => {
    return Object.keys(players).map((id) => {
      const player = players[id];
      console.log(player);
      const colors = colorsForIdx(player.colorIdx);
      const style: CSSProperties = {
        backgroundColor: colors.fillColor,
        color: colors.textColor,
        borderColor: colors.strokeColor
      }
      return (
        <tr key={`player-${id}`} style={style}>
          <th scope="row">{player.name}</th>
          <td>{player.reserveUnits}</td>
          {/* <td >Mark</td>
          <td>Otto</td>
          <td>@mdo</td> */}
        </tr>
      )
    })
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {toolsCard()}
          {groupsCard()}
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

            <div className="players mt-3">
              <table className="table table-sm table-dark">
                <thead>
                  <tr>
                    <th scope="col">Player</th>
                    <th scope="col">Reserve Units</th>
                  </tr>
                </thead>
                <tbody>
                  {playerList()}
                </tbody>
              </table>
            </div>
        </div>

        <div className="col">
          {territoryState()}
          {groupsState()}
        </div>
      </div>
    </div>
  );
};
