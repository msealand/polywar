import { PolyWar } from 'polywar'
import { Server } from 'boardgame.io/server';

const server = Server({
  games: [PolyWar],
});

server.run(8000);
