import { BoardComponent } from './Board';
import { PolyWar } from 'polywar';

import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'

export const PolyWarClient = Client({ 
  debug: false,
  game: PolyWar,
  board: BoardComponent,
  multiplayer: SocketIO({ server: 'localhost:8000' })
});
