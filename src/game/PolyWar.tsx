import { PluginPlayer } from 'boardgame.io/plugins';

import { deployUnits, completeDeployment } from './Moves';


export const PolyWar = {
    plugins: [PluginPlayer],
  
    setup: () => {
      const boardData = require('./map.json');
  
      boardData.territories.forEach((t: any) => {
        const r = Math.random();
        if (r >= 0.66) {
          t.controlledBy = "1"
          t.colorIdx = 2;
        } else if (r >= 0.33) {
          t.controlledBy = "0"
          t.colorIdx = 1;
        }
        t.units = 3;
      });
  
      return { boardData: boardData }
    },
  
    playerSetup: (playerID: string) => ({ 
      colorIdx: Number(playerID) + 1
    }),
  
    turn: {
        activePlayers: { currentPlayer: 'deploy' },

        stages: {
            deploy: {
                moves: {
                    deployUnits: deployUnits,
                    completeDeployment: completeDeployment
                },
                next: 'attack',
                start: true
            },
            attack: {
                moves: {

                },
                next: 'transfer'
            },
            transfer: {
                moves: {

                }
            }
        }
    },
  
    moves: {}
};
