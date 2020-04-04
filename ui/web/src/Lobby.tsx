import React from 'react';
import { Lobby } from 'boardgame.io/react';

import { PolyWar } from 'polywar';
import { PolyWarClient } from './game/PolyWarClient';

export const LobbyComponent = () => {
    return <Lobby
        gameServer={`http://${window.location.hostname}:8000`}
        lobbyServer={`http://${window.location.hostname}:8000`}
        gameComponents={[{
            game: PolyWar,
            board: PolyWarClient
        }]}
    />
}
