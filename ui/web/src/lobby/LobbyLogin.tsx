import React, { useState } from 'react';
import { LobbyProps } from './Lobby';

type LobbyLoginProps = {
    playerName: string,
    enterLobby: (playerName: string) => void
}

const LobbyLogin = (props: LobbyLoginProps) => {
  const [playerName, setPlayerName] = useState(props.playerName);
  
  return (
    <div className="card">
        <div className="card-body">
            <h6 className="card-title">Player Name</h6>

            <input id="player-name" className="form-control" type="text" value={playerName} onChange={(event) => {
                const name = event.target.value.trim();
                setPlayerName(name);
            }}/>

            <div className="mt-3">
                <button type="button" className="btn btn-success" onClick={() => {
                    if (playerName?.length) {
                        props.enterLobby(playerName);
                    }
                }} disabled={!(playerName?.length)}>
                Enter Lobby
                </button>
            </div>
        </div>
    </div>
  );
};

export const LobbyLoginContainer = (props: LobbyProps) => {
  return (
    <div className="w-25 mx-auto">
        <LobbyLogin playerName={props.playerName} enterLobby={props.handleEnterLobby} />
    </div>
  );
};
