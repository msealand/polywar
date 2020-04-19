import { Ctx } from 'boardgame.io';
import { PluginPlayer } from 'boardgame.io/plugins';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { deployUnits, completeDeploymentPhase, attack, postAttackTransfer, completeAttackPhase, transfer, completeTransferPhase } from './Moves';
import { checkBoardState } from './Territory';

export enum FogLevel {
    None = 0,
    Light = 1,
    Medium = 2,
    Heavy = 3
}

export type PolyWarRules = {
    fogLevel: FogLevel
}

export const PolyWar = {
    name: "poly-war",
    minPlayers: 2,
    maxPlayers: 10,

    rules: { fogLevel: FogLevel.None },

    setup: (ctx: Ctx, setupData: any) => {
        console.log(`Initial Context:`, ctx);
        console.log(`Setup Data:`, setupData);

        const boardData = JSON.parse(readFileSync(resolve(__dirname, 'map.json'), { encoding: 'utf8' }));

        const random = ctx.random!;
        for (let initialUnitDeployment = 1; initialUnitDeployment <= 3; initialUnitDeployment++) {
            let randomTerritories = random.Shuffle(boardData.territories);

            while (randomTerritories.length > 0) {
                for (let playerId = -1; playerId < ctx.numPlayers; playerId++) {
                    const t: any = randomTerritories.find((t: any) => (t.units ?? 0) < initialUnitDeployment);
                    if (t) {
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
            player.colorIdx = idx + 1;
            players[playerId] = { ...player };
            return players;
        }, {});

        console.log(`Players:`, players);
  
        return { boardData, players }
    },

    playerView: (G, ctx, playerID) => {
        let g = { ...G };

        const playerArray = Object.keys(g.players ?? {}).map((pid) => {
            const p = g.players[pid];
            if (pid !== playerID) {
                return {
                    id: p.id,
                    name: p.name,
                    colorIdx: p.colorIdx
                }
            } else {
                return p;
            }
        })
        const players = playerArray.reduce((players, p) => {
            players[p.id] = p;
            return players;
        }, {});

        // TODO: This should change based on fog level
        const territories = g.boardData.territories.map((t) => {
            // Heavy Fog
            if (t.controlledBy !== playerID) {
                return {
                    id: t.id,
                    name: t.name,
                    position: t.position,
                    groups: t.groups,
                    borders: t.borders
                }
            } else {
                return t;
            }
        })

        const groups = g.boardData.groups.map((grp) => {
            if (grp.controlledBy !== playerID) {
                return {
                    id: grp.id,
                    name: grp.name,
                    territories: grp.territories,
                    territoryCount: grp.territoryCount,
                    bonusUnits: grp.bonusUnits
                }
            } else {
                return grp;
            }
        })

        return { players, boardData: { territories, groups } };
    },
  
    turn: {
        activePlayers: { currentPlayer: 'deploy' },

        onBegin: (G, ctx) => {
            // Just in case... probably not required.
            checkBoardState(G, ctx);

            const territoryCount = G.boardData.territories.reduce((count, territory) => {
                if (territory.controlledBy === ctx.currentPlayer) return count + 1;
                return count;
            }, 0);
            const groupBonus = G.boardData.groups.filter((group) => {
                return group.controlledBy == ctx.currentPlayer;
            }).reduce((groupBonus, group) => {
                return groupBonus + group.bonusUnits;
            }, 0);

            const unitBonus = Math.max(3, Math.floor(territoryCount / 3));
            const totalBonus = unitBonus + groupBonus;

            console.log(`Territory Unit Bonus: ${unitBonus}`);
            console.log(`Group Unit Bonus: ${groupBonus}`);
            console.log(`Total Unit Bonus: ${totalBonus}`);

            let units = G.players[ctx.currentPlayer].reserveUnits;
            units += totalBonus;
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
