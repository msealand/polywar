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
  const gameId = props.room.gameID;

  const playerSlot = (player, idx) => {
    return (
      <li className="list-group-item list-group-item-dark" key={gameId + '-player-' + player.id}>
        <p className="text-monospace mb-0">
          Slot {idx + 1}: {player.name || '[free]'}
        </p>
      </li>
    );
  };

  const joinButton = (game, seatId) => {
    return (
      <button 
        key={'button-join-' + game.gameID} 
        type="button" className="btn btn-sm btn-success ml-1" 
        onClick={() => props.handleJoin(game.gameName, game.gameID, '' + seatId)} 
        disabled={props.isInGame}
      >
        Join
      </button>
    );
  };

  const leaveButton = (game) => (
    <button 
      key={'button-leave-' + game.gameID} 
      type="button" className="btn btn-sm btn-danger ml-1" 
      onClick={() => props.handleLeave(game.gameName, game.gameID)}
    >
      Leave
    </button>
  );

  const playButton = (game, seatId) => (
    <button 
      key={'button-play-' + game.gameID} 
      type="button" className="btn btn-sm btn-success ml-1" 
      onClick={() => props.handlePlay(game.gameName, {
        gameID: game.gameID,
        playerID: '' + seatId,
        numPlayers: game.players.length,
      })}
    >
      Play
    </button>
  );

  const spectateButton = (game) => (
    <button 
      key={'button-spectate-' + game.gameID} 
      type="button" className="btn btn-sm btn-primary ml-1" 
      onClick={() => props.handlePlay(game.gameName, {
        gameID: game.gameID,
        numPlayers: game.players.length,
      })}
    >
      Spectate
    </button>
  );

  const roomButtons = (game) => {
    const playerSeat = game.players.find(player => player.name === props.playerName);
    const freeSeat = game.players.find(player => !player.name);

    if (playerSeat && freeSeat) {
      // already seated: waiting for game to start
      return leaveButton(game);
    }

    if (freeSeat) {
      // at least 1 seat is available
      return joinButton(game, freeSeat.id);
    }

    // room is full
    if (playerSeat) {
      return (<div>
        {[
          playButton(game, playerSeat.id),
          leaveButton(game),
        ]}
      </div>);
    }

    // allow spectating
    return spectateButton(game);
  };
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <ul className="list-group">
            {props.room.players.map(playerSlot)}
          </ul>
        </div>
        <div className="col col-3 text-right">
          {roomButtons(props.room)}
        </div>
      </div>
    </div>
  );
};
