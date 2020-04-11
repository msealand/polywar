import { Ctx } from 'boardgame.io';
import { PluginPlayer } from 'boardgame.io/plugins';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { deployUnits, completeDeploymentPhase, attack, postAttackTransfer, completeAttackPhase, transfer, completeTransferPhase } from './Moves';

export const PolyWar = {
    name: "poly-war",
    minPlayers: 2,
    maxPlayers: 10,

    plugins: [PluginPlayer],

    setup: (ctx: Ctx) => {
        const boardData = JSON.parse(readFileSync(resolve(__dirname, 'map.json'), { encoding: 'utf8' }));

        const random = ctx.random!;
        for (let initialUnitDeployment = 1; initialUnitDeployment <= 3; initialUnitDeployment++) {
            let randomTerritories = random.Shuffle(boardData.territories);

            while (randomTerritories.length > 0) {
                for (let playerId = -1; playerId < ctx.numPlayers; playerId++) {
                    const t: any = randomTerritories.find((t: any) => (t.units ?? 0) < initialUnitDeployment);
                    if (t) {
                        t.colorIdx = playerId + 1
                        t.controlledBy = `${playerId}`;
                        t.units = (t.units ?? 0) + 1;
                    } else {
                        console.log(`no t`, initialUnitDeployment, playerId, randomTerritories.length); 
                        randomTerritories = [];
                    }
                    randomTerritories = randomTerritories.filter((rt: any) => rt.id !== t.id);
                    if (!randomTerritories.length) break;
                }
            }
        }

        const players = (new Array(ctx.numPlayers)).fill({
            reserveUnits: 3
        }).reduce((players, player, idx) => {
            const playerId = `${idx}`;
            player.id = playerId;
            players[playerId] = player;
            return players;
        }, {});

        console.log(`Players: ${players}`);
  
        return { boardData, players }
    },
  
    playerSetup: (playerID: string) => ({ 
      colorIdx: Number(playerID) + 1
    }),
  
    turn: {
        activePlayers: { currentPlayer: 'deploy' },

        onBegin: (G, ctx) => {
            const territoryCount = G.boardData.territories.reduce((count, territory) => {
                if (territory.controlledBy === ctx.currentPlayer) return count + 1;
                return count;
            }, 0);
            
            const unitBonus = Math.max(3, Math.floor(territoryCount / 3));

            let units = G.players[ctx.currentPlayer].reserveUnits;
            units += unitBonus;
            G.players[ctx.currentPlayer].reserveUnits = units;
        },

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
