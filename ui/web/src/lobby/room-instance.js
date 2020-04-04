/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';

export class LobbyRoomInstance extends React.Component {
  static propTypes = {
    room: PropTypes.shape({
      gameName: PropTypes.string.isRequired,
      gameID: PropTypes.string.isRequired,
      players: PropTypes.array.isRequired,
    }),
    playerName: PropTypes.string.isRequired,
    onClickJoin: PropTypes.func.isRequired,
    onClickLeave: PropTypes.func.isRequired,
    onClickPlay: PropTypes.func.isRequired,
  };

  _createSeat = (gameId, player, idx) => {
    return (
      <li className="list-group-item" key={gameId + '-player-' + player.id}>
        <p className="text-monospace mb-0">
          Slot {idx + 1}: {player.name || '[free]'}
        </p>
      </li>
    )
  };

  _createButtonJoin = (inst, seatId) => (
    <button
      key={'button-join-' + inst.gameID}
      type="button" className="btn btn-sm btn-success ml-1"
      onClick={() =>
        this.props.onClickJoin(inst.gameName, inst.gameID, '' + seatId)
      }
    >
      Join
    </button>
  );

  _createButtonLeave = inst => (
    <button
      key={'button-leave-' + inst.gameID}
      type="button" className="btn btn-sm btn-danger ml-1"
      onClick={() => this.props.onClickLeave(inst.gameName, inst.gameID)}
    >
      Leave
    </button>
  );

  _createButtonPlay = (inst, seatId) => (
    <button
      key={'button-play-' + inst.gameID}
      type="button" className="btn btn-sm btn-success ml-1"
      onClick={() =>
        this.props.onClickPlay(inst.gameName, {
          gameID: inst.gameID,
          playerID: '' + seatId,
          numPlayers: inst.players.length,
        })
      }
    >
      Play
    </button>
  );

  _createButtonSpectate = inst => (
    <button
      key={'button-spectate-' + inst.gameID}
      type="button" className="btn btn-sm ml-1"
      onClick={() =>
        this.props.onClickPlay(inst.gameName, {
          gameID: inst.gameID,
          numPlayers: inst.players.length,
        })
      }
    >
      Spectate
    </button>
  );

  _createInstanceButtons = inst => {
    const playerSeat = inst.players.find(
      player => player.name === this.props.playerName
    );
    const freeSeat = inst.players.find(player => !player.name);
    if (playerSeat && freeSeat) {
      // already seated: waiting for game to start
      return this._createButtonLeave(inst);
    }
    if (freeSeat) {
      // at least 1 seat is available
      return this._createButtonJoin(inst, freeSeat.id);
    }
    // room is full
    if (playerSeat) {
      return (
        <div>
          {[
            this._createButtonPlay(inst, playerSeat.id),
            this._createButtonLeave(inst),
          ]}
        </div>
      );
    }
    // allow spectating
    return this._createButtonSpectate(inst);
  };

  render() {
    const room = this.props.room;
    let status = 'OPEN';

    if (!room.players.find(player => !player.name)) {
      status = 'RUNNING';
    }

    return (
      <div className="container">
        <div className="row">
          {/* <div className="col col-1">{status}</div>
          <div className="col col-1">{room.gameName}</div> */}
          <div className="col">
            <ul className="list-group">
              {room.players.map(this._createSeat.bind(this, room.gameID))}
            </ul>
          </div>
          <div className="col col-3 text-right">
            {this._createInstanceButtons(room)}
          </div>
        </div>
      </div>
    );
  }
}

export default LobbyRoomInstance;
