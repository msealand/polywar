import React from 'react';
import { Lobby, Client } from 'boardgame.io/react';

import { PolyWar } from 'polywar';
import { PolyWarClient } from '../game/PolyWarClient';

import { LobbyLoginContainer } from './LobbyLogin';
import { CreateRoomContainer } from './CreateRoom';
import { Room } from './Room';

enum LobbyPhases {
  ENTER = 'enter',
  PLAY = 'play',
  LIST = 'list'
};

type Room = {
  gameID: string, 
  gameName: string, 
  players: any
}

type Game = any;
type GameComponent = {
  game: Game,
  board: Client
}

export type LobbyProps = {
  errorMsg: string;
  gameComponents: Array<GameComponent>;
  rooms: Array<Room>;
  phase: LobbyPhases;
  playerName: string;
  runningGame: Game;

  handleEnterLobby: (playerName: string) => void;
  handleExitLobby: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleCreateRoom: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleJoinRoom: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleLeaveRoom: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleExitRoom: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleRefreshRooms: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleStartGame: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const renderRooms = (rooms: Array<Room>, playerName, handleJoinRoom, handleLeaveRoom, handleStartGame) => {
  const isInGame = rooms.some((room) => 
    room.players.find(p => p.name == playerName)
  )

  return rooms.map(room => {
    const { gameID, gameName, players } = room;
    return (
      <li key={'instance-' + gameID + '-item'} className="list-group-item">
        <Room
          key={'instance-' + gameID}
          room={{ gameID, gameName, players: Object.values(players) }}
          playerName={playerName}
          isInGame={isInGame}
          handleJoin={handleJoinRoom}
          handleLeave={handleLeaveRoom}
          handlePlay={handleStartGame}
        />
      </li>
    );
  });
};

const GameHeader = (props: LobbyProps) => {
  return (
    <nav className="navbar mb-3">
      <div className="navbar-brand">{props.playerName}</div>

      <form className="form-inline">
        <button type="button" className="btn btn-outline-danger my-2 my-sm-0" onClick={props.handleExitRoom}>Exit game</button>
      </form>
    </nav>
  )
}

const LobbyHeader = (props: LobbyProps) => {
  return (
    <nav className="navbar mb-3">
      <div className="navbar-brand">{props.playerName}</div>

      <form className="form-inline">
        <button type="button" className="btn btn-outline-danger my-2 my-sm-0" onClick={props.handleExitLobby}>Exit lobby</button>
      </form>
    </nav>
  )
}

const RoomList = (props: LobbyProps) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Join a game</h5>
      </div>
      <ul className="list-group list-group-flush">
          {renderRooms(props.rooms, props.playerName, props.handleJoinRoom, props.handleLeaveRoom, props.handleStartGame)}
      </ul>
      <div className="card-footer">
        <p className="text-muted text-center mb-0">
            Rooms that become empty are automatically deleted.
        </p>
      </div>
    </div>
  )
}

const LobbyList = (props: LobbyProps) => {
  return (
    <React.Fragment>
      {LobbyHeader(props)}

      <div className="container-fluid">
        <div className="row">

          <div className="col col-3">
            {CreateRoomContainer(props)}
          </div>

          <div className="col">
            {RoomList(props)}
          </div>

        </div>
      </div>
    </React.Fragment>
  )
}

const LobbyPlay = (props: LobbyProps) => {
  return (
    <React.Fragment>
      {GameHeader(props)}

      {props.runningGame && (
        <props.runningGame.app
          gameID={props.runningGame.gameID}
          playerID={props.runningGame.playerID}
          credentials={props.runningGame.credentials}
        />
      )}
    </React.Fragment>
  )
}

const renderLobby = (props: LobbyProps) => {
  switch (props.phase) {
    case LobbyPhases.ENTER: return LobbyLoginContainer(props);
    case LobbyPhases.LIST:  return LobbyList(props);
    case LobbyPhases.PLAY:  return LobbyPlay(props);
    default: return (
      <div className="alert alert-error">Invalid Lobby Phase</div>
    )
  }
}

export const LobbyContainer = () => {
    return (
      <Lobby
        gameServer={`http://${window.location.hostname}:8000`}
        lobbyServer={`http://${window.location.hostname}:8000`}
        gameComponents={[{
            game: PolyWar,
            board: PolyWarClient
        }]}
        renderer={renderLobby}
      />
    )
}
