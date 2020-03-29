import { BoardComponent } from './Board';

import { Ctx } from 'boardgame.io';
import { Client } from 'boardgame.io/react';

const PolyWar = {
  setup: () => ({ boardData: require('./map.json') }),

  moves: {
    clickCell: (G: any, ctx: Ctx, id: any) => {
      console.log(`do something...`);
    },
  },
};

const App = Client({ 
  debug: true,
  game: PolyWar,
  board: BoardComponent
});

export default App;
