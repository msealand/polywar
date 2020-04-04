/*
 * Copyright 2018 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';

export class LobbyLoginForm extends React.Component {
  static propTypes = {
    playerName: PropTypes.string,
    onEnter: PropTypes.func.isRequired,
  };
  static defaultProps = {
    playerName: '',
  };

  state = {
    playerName: this.props.playerName,
    nameErrorMsg: '',
  };

  render() {
    return (
      <div className="lobby-login card w-25 mx-auto ">
        <div className="card-body">
          <h6 className="card-title">Player Name</h6>

          <input
            id="player-name"
            className="form-control"
            type="text"
            value={this.state.playerName}
            onChange={this.onChangePlayerName}
            onKeyPress={this.onKeyPress}
          />

          <div className="mt-3">
            <button type="button" className="btn btn-success" onClick={this.onClickEnter}>
              Enter
            </button>
          </div>

        </div>
      </div>
    );
  }

  onClickEnter = () => {
    if (this.state.playerName === '') return;
    this.props.onEnter(this.state.playerName);
  };

  onKeyPress = event => {
    if (event.key === 'Enter') {
      this.onClickEnter();
    }
  };

  onChangePlayerName = event => {
    const name = event.target.value.trim();
    this.setState({
      playerName: name,
      nameErrorMsg: name.length > 0 ? '' : 'empty player name',
    });
  };
}

export default LobbyLoginForm;
