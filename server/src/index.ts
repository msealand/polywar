import { PolyWar } from 'polywar'
import { Server, FlatFile } from 'boardgame.io/server';
import { resolve } from 'path';

const server = Server({
  games: [PolyWar],
  db: new FlatFile({
    dir: resolve(__dirname, '..', 'games'),
    logging: true
  }),
});

server.run(8000);
