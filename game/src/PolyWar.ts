import { Ctx } from 'boardgame.io';
import { PluginPlayer } from 'boardgame.io/plugins';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { deployUnits, completeDeploymentPhase, attack, postAttackTransfer, completeAttackPhase, transfer, completeTransferPhase } from './Moves';

export const PolyWar = {
    name: "poly-war",

    plugins: [PluginPlayer],

    setup: (ctx: Ctx) => {
        // const boardData = require('./map.json');
        const boardData = JSON.parse(readFileSync(resolve(__dirname, 'map.json'), { encoding: 'utf8' }));

        const random = ctx.random!;
        for (let initialUnitDeployment = 1; initialUnitDeployment <= 3; initialUnitDeployment++) {
            let randomTerritories = random.Shuffle(boardData.territories);

            while (randomTerritories.length > 0) {
                for (let playerID = -1; playerID < ctx.numPlayers; playerID++) {
                    const t: any = randomTerritories.find((t: any) => (t.units ?? 0) < initialUnitDeployment);
                    if (t) {
                        t.colorIdx = playerID + 1
                        t.controlledBy = `${playerID}`;
                        t.units = (t.units ?? 0) + 1;
                    } else {
                        console.log(`no t`, initialUnitDeployment, playerID, randomTerritories.length); 
                        randomTerritories = [];
                    }
                    randomTerritories = randomTerritories.filter((rt: any) => rt.id !== t.id);
                    if (!randomTerritories.length) break;
                }
            }
        }
  
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
                    deployUnits,
                    completeDeploymentPhase
                }
            },
            attack: {
                moves: {
                    attack,
                    completeAttackPhase
                }
            },
            postAttackTransfer: {
                moves: {
                    postAttackTransfer
                }
            },
            transfer: {
                moves: {
                    transfer,
                    completeTransferPhase
                }
            }
        }
    },
  
    moves: {}
};
