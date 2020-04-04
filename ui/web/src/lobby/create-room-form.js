/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';

export class LobbyCreateRoomForm extends React.Component {
  static propTypes = {
    games: PropTypes.array.isRequired,
    createGame: PropTypes.func.isRequired,
  };

  state = {
    selectedGame: 0,
    numPlayers: 2,
  };

  constructor(props) {
    super(props);
    /* fix min and max number of players */
    for (let game of props.games) {
      let game_details = game.game;
      if (!game_details.minPlayers) {
        game_details.minPlayers = 1;
      }
      if (!game_details.maxPlayers) {
        game_details.maxPlayers = 4;
      }
      console.assert(game_details.maxPlayers >= game_details.minPlayers);
    }
    this.state = {
      selectedGame: 0,
      numPlayers: props.games[0].game.minPlayers,
    };
  }

  _createGameNameOption = (game, idx) => {
    return (
      <option key={'name-option-' + idx} value={idx}>
        {game.game.name}
      </option>
    );
  };

  _createNumPlayersOption = idx => {
    return (
      <option key={'num-option-' + idx} value={idx}>
        {idx}
      </option>
    );
  };

  _createNumPlayersRange = game => {
    return [...new Array(game.maxPlayers + 1).keys()].slice(game.minPlayers);
  };

  render() {
    return (
      <div className="form-group">
        {/* <select
          className="custom-select"
          value={this.state.selectedGame}
          onChange={evt => this.onChangeSelectedGame(evt)}
        >
          {this.props.games.map(this._createGameNameOption)}
        </select> */}

        <h6 className="card-title">Number of Players</h6>

        <select
          className="custom-select form-control form-control-sm mx-0"
          value={this.state.numPlayers}
          onChange={this.onChangeNumPlayers}
        >
          {this._createNumPlayersRange(
            this.props.games[this.state.selectedGame].game
          ).map(this._createNumPlayersOption)}
        </select>

        <div className="mt-3">
          <button type="button" className="btn btn-success" onClick={this.onClickCreate}>Create</button>
        </div>
      </div>
    );
  }

  onChangeNumPlayers = event => {
    this.setState({
      numPlayers: Number.parseInt(event.target.value),
    });
  };

  onChangeSelectedGame = event => {
    let idx = Number.parseInt(event.target.value);
    this.setState({
      selectedGame: idx,
      numPlayers: this.props.games[idx].game.minPlayers,
    });
  };

  onClickCreate = () => {
    this.props.createGame(
      this.props.games[this.state.selectedGame].game.name,
      this.state.numPlayers
    );
  };
}

export default LobbyCreateRoomForm;
