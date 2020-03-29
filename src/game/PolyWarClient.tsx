import { BoardComponent } from './Board';
import { PolyWar } from './PolyWar';

import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer'

export const PolyWarClient = Client({ 
  debug: true,
  game: PolyWar,
  board: BoardComponent,
  multiplayer: Local()
});
