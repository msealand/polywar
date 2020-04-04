import { PolyWar } from './PolyWar'

const Server = require('boardgame.io/server').Server;

const server = Server({
  games: [PolyWar],
});

server.run(8000);
