import React from 'react';

type RoomProps = {
  room: {
    gameName: string;
    gameID: string;
    players: Array<{
      name: string;
      id: string;
    }>;
  };
  playerName: string;
  isInGame: boolean;
  handleJoin: Function;
  handleLeave: Function;
  handlePlay: Function;
};

export const Room = (props: RoomProps) => {
  const _createSeat = (gameId, player, idx) => {
    return (<li className="list-group-item" key={gameId + '-player-' + player.id}>
      <p className="text-monospace mb-0">
        Slot {idx + 1}: {player.name || '[free]'}
      </p>
    </li>);
  };

  const _createButtonJoin = (inst, seatId) => {
    const disabled = props.isInGame;
    return (<button key={'button-join-' + inst.gameID} type="button" className="btn btn-sm btn-success ml-1" onClick={() => props.handleJoin(inst.gameName, inst.gameID, '' + seatId)} disabled={disabled}>
      Join
    </button>);
  };

  const _createButtonLeave = inst => (<button key={'button-leave-' + inst.gameID} type="button" className="btn btn-sm btn-danger ml-1" onClick={() => props.handleLeave(inst.gameName, inst.gameID)}>
    Leave
  </button>);

  const _createButtonPlay = (inst, seatId) => (<button key={'button-play-' + inst.gameID} type="button" className="btn btn-sm btn-success ml-1" onClick={() => props.handlePlay(inst.gameName, {
    gameID: inst.gameID,
    playerID: '' + seatId,
    numPlayers: inst.players.length,
  })}>
    Play
  </button>);

  const _createButtonSpectate = inst => (<button key={'button-spectate-' + inst.gameID} type="button" className="btn btn-sm btn-primary ml-1" onClick={() => props.handlePlay(inst.gameName, {
    gameID: inst.gameID,
    numPlayers: inst.players.length,
  })}>
    Spectate
  </button>);

  const _createInstanceButtons = inst => {
    const playerSeat = inst.players.find(player => player.name === props.playerName);
    const freeSeat = inst.players.find(player => !player.name);
    if (playerSeat && freeSeat) {
      // already seated: waiting for game to start
      return _createButtonLeave(inst);
    }
    if (freeSeat) {
      // at least 1 seat is available
      return _createButtonJoin(inst, freeSeat.id);
    }
    // room is full
    if (playerSeat) {
      return (<div>
        {[
          _createButtonPlay(inst, playerSeat.id),
          _createButtonLeave(inst),
        ]}
      </div>);
    }
    // allow spectating
    return _createButtonSpectate(inst);
  };
  
  return (<div className="container-fluid">
    <div className="row">
      <div className="col">
        <ul className="list-group">
          {props.room.players.map(_createSeat.bind(null, props.room.gameID))}
        </ul>
      </div>
      <div className="col col-3 text-right">
        {_createInstanceButtons(props.room)}
      </div>
    </div>
  </div>);
};
