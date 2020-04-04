import React from 'react';
// import { Lobby } from './lobby/react';
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

const _getPhaseVisibility = (phase, requiredPhase) => {
    return phase !== requiredPhase ? 'hidden' : 'phase';
};

const renderRooms = (rooms, playerName, handleJoinRoom, handleLeaveRoom, handleStartGame) => {
    return rooms.map(room => {
      const { gameID, gameName, players } = room;
      return (
        <LobbyRoomInstance
          key={'instance-' + gameID}
          room={{ gameID, gameName, players: Object.values(players) }}
          playerName={playerName}
          onClickJoin={handleJoinRoom}
          onClickLeave={handleLeaveRoom}
          onClickPlay={handleStartGame}
        />
      );
    });
  };

function renderLobby(props) {
    /*
    {
        errorMsg,
        gameComponents,
        rooms: this.connection.rooms,
        phase,
        playerName,
        runningGame,
        handleEnterLobby: this._enterLobby,
        handleExitLobby: this._exitLobby,
        handleCreateRoom: this._createRoom,
        handleJoinRoom: this._joinRoom,
        handleLeaveRoom: this._leaveRoom,
        handleExitRoom: this._exitRoom,
        handleRefreshRooms: this._updateConnection,
        handleStartGame: this._startGame,
    }
    */

    return (
        <div id="lobby-view" style={{ padding: 50 }}>
          <div className={_getPhaseVisibility(props.phase, LobbyPhases.ENTER)}>
            <LobbyLoginForm
              key={props.playerName}
              playerName={props.playerName}
              onEnter={props.handleEnterLobby}
            />
          </div>
  
          <div className={_getPhaseVisibility(props.phase, LobbyPhases.LIST)}>
            <p>Welcome, {props.playerName}</p>
  
            <div className="phase-title" id="game-creation">
              <span>Create a room:</span>
              <LobbyCreateRoomForm
                games={props.gameComponents}
                createGame={props.handleCreateRoom}
              />
            </div>
            <p className="phase-title">Join a room:</p>
            <div id="instances">
              <table>
                <tbody>
                  {renderRooms(props.rooms, props.playerName, props.handleJoinRoom, props.handleLeaveRoom, props.handleStartGame)}
                </tbody>
              </table>
              <span className="error-msg">
                {props.errorMsg}
                <br />
              </span>
            </div>
            <p className="phase-title">
              Rooms that become empty are automatically deleted.
            </p>
          </div>
  
          <div className={_getPhaseVisibility(props.phase, LobbyPhases.PLAY)}>
            {props.runningGame && (
              <props.runningGame.app
                gameID={props.runningGame.gameID}
                playerID={props.runningGame.playerID}
                credentials={props.runningGame.credentials}
              />
            )}
            <div className="buttons" id="game-exit">
              <button onClick={props.handleExitRoom}>Exit game</button>
            </div>
          </div>
  
          <div className="buttons" id="lobby-exit">
            <button onClick={props.handleExitLobby}>Exit lobby</button>
          </div>
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
