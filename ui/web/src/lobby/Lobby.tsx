import React from 'react';
import { Lobby } from 'boardgame.io/react';

import { PolyWar } from 'polywar';
import { PolyWarClient } from '../game/PolyWarClient';

import { LobbyLoginForm } from './login-form';
import { LobbyCreateRoomForm } from './create-room-form';
import { LobbyRoomInstance } from './room-instance';

const LobbyPhases = {
  ENTER: 'enter',
  PLAY: 'play',
  LIST: 'list',
};

type Room = {
  gameID: string, 
  gameName: string, 
  players: any
}

const renderRooms = (rooms: Array<Room>, playerName, handleJoinRoom, handleLeaveRoom, handleStartGame) => {
    const isInGame = rooms.some((room) => 
      room.players.find(p => p.name == playerName)
    )

    return rooms.map(room => {
      const { gameID, gameName, players } = room;
      return (
        <li key={'instance-' + gameID + '-item'} className="list-group-item">
          <LobbyRoomInstance
            key={'instance-' + gameID}
            room={{ gameID, gameName, players: Object.values(players) }}
            playerName={playerName}
            isInGame={isInGame}
            onClickJoin={handleJoinRoom}
            onClickLeave={handleLeaveRoom}
            onClickPlay={handleStartGame}
          />
        </li>
      );
    });
  };

const LobbyEnter = (props) => {
  return (
    <div className="lobby-enter">
      <LobbyLoginForm
        key={props.playerName}
        playerName={props.playerName}
        onEnter={props.handleEnterLobby}
      />
    </div>
  )
}

const LobbyHeader = (props) => {
  return (
    <nav className="navbar mb-3">
      <div className="navbar-brand">{props.playerName}</div>

      <form className="form-inline">
        <button type="button" className="btn btn-outline-danger my-2 my-sm-0" onClick={props.handleExitLobby}>Exit lobby</button>
      </form>
    </nav>
  )
}

const GameHeader = (props) => {
  return (
    <nav className="navbar mb-3">
      <div className="navbar-brand">{props.playerName}</div>

      <form className="form-inline">
        <button type="button" className="btn btn-outline-danger my-2 my-sm-0" onClick={props.handleExitRoom}>Exit game</button>
      </form>
    </nav>
  )
}

const LobbyList = (props) => {
  return (
    <div className="lobby-list">
      {LobbyHeader(props)}

      <div className="container-fluid">
        <div className="row">

          <div className="col col-3">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Create a room</h5>
              </div>
              <div className="card-body">
                <LobbyCreateRoomForm
                  games={props.gameComponents}
                  createGame={props.handleCreateRoom}
                />
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Join a room</h5>
              </div>
              {/* <div className="card-body"> */}
                <ul className="list-group list-group-flush">
                {/* <div id="instances">
                  <table>
                    <tbody> */}
                      {renderRooms(props.rooms, props.playerName, props.handleJoinRoom, props.handleLeaveRoom, props.handleStartGame)}
                    {/* </tbody>
                  </table>
                  <span className="error-msg">
                    {props.errorMsg}
                    <br />
                  </span>
                </div> */}
                </ul>
              {/* </div> */}
              <div className="card-footer">
                <p className="text-muted text-center mb-0">
                    Rooms that become empty are automatically deleted.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const LobbyPlay = (props) => {
  return (
    <div className="lobby-play">
      {GameHeader(props)}

      {props.runningGame && (
        <props.runningGame.app
          gameID={props.runningGame.gameID}
          playerID={props.runningGame.playerID}
          credentials={props.runningGame.credentials}
        />
      )}
    </div>
  )
}

const renderLobbyPhase = (props) => {
  switch (props.phase) {
    case LobbyPhases.ENTER: return LobbyEnter(props);
    case LobbyPhases.LIST: return LobbyList(props);
    case LobbyPhases.PLAY: return LobbyPlay(props);
  }
}

function renderLobby(props: {
  errorMsg: string,
  gameComponents: Array<any>, // Game objects
  rooms: Array<Room>,
  phase: string,
  playerName: string,
  runningGame: any,
  handleEnterLobby: Function,
  handleExitLobby: Function,
  handleCreateRoom: Function,
  handleJoinRoom: Function,
  handleLeaveRoom: Function,
  handleExitRoom: Function,
  handleRefreshRooms: Function,
  handleStartGame: Function,
}) {
    return (
      <div id="lobby-view" style={{ padding: 50 }}>
        {renderLobbyPhase(props)}
      </div>
    )
}

export const LobbyComponent = () => {
    return <Lobby
        gameServer={`http://${window.location.hostname}:8000`}
        lobbyServer={`http://${window.location.hostname}:8000`}
        gameComponents={[{
            game: PolyWar,
            board: PolyWarClient
        }]}
        renderer={renderLobby}
    />
}
