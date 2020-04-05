import React, { useState } from 'react';
import { LobbyProps } from './Lobby';
const CreateRoom = (props) => {
  const game = props.games[0].game;
  const [numPlayers, setNumPlayers] = useState(game.minPlayers ?? 1);
  const numPlayersOptions = () => {
    return (new Array((game.maxPlayers - game.minPlayers) + 1)).fill(0)
      .map((ignore, idx) => {
        const count = idx + game.minPlayers;
        return (<option key={'player-count-' + count} value={count}>
          {count}
        </option>);
      });
  };
  return (<div className="form-group">

    <h6 className="card-title">Number of Players</h6>

    <select className="custom-select form-control form-control-sm mx-0" value={numPlayers} onChange={(event) => {
      setNumPlayers(Number(event.target.value));
    }}>
      {numPlayersOptions()}
    </select>

    <div className="mt-3">
      <button type="button" className="btn btn-success" onClick={() => {
        props.createGame(game.name, numPlayers);
      }}>Create</button>
    </div>
  </div>);
};
export const CreateRoomContainer = (props: LobbyProps) => {
  return (<div className="card">
    <div className="card-header">
      <h5 className="mb-0">Create a game</h5>
    </div>
    <div className="card-body">
      <CreateRoom games={props.gameComponents} createGame={props.handleCreateRoom} />
    </div>
  </div>);
};
