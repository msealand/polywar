import { Ctx } from "boardgame.io";

import { Territory, checkBoardState } from "./Territory";

export const deployUnits = {
    move: (G: any, ctx: Ctx, territoryId: string, unitCount: number) => {
        const territory: Territory = G.boardData.territories.find((t: Territory) => t.id === territoryId);
        const player = G.players[ctx.currentPlayer];
        const reserveUnits = player?.reserveUnits ?? 0;
        if (unitCount > reserveUnits) {
            console.log(`not enough units`);
            return;
        }

        if (territory && (((territory.controlledBy === undefined) && ((territory.units ?? 0) <= 0)) || (territory.controlledBy === ctx.currentPlayer))) {
            territory.controlledBy = ctx.currentPlayer;

            territory.units = (territory.units ?? 0) + unitCount;
            player.reserveUnits = player.reserveUnits - unitCount;
            
            checkBoardState(G, ctx);
        }
    },
    undoable: true,
    redact: true,
    client: false
}

export const completeDeploymentPhase = {
    move: (G: any, ctx: Ctx) => {
        if (ctx.events?.setStage) {
            ctx.events.setStage('attack');
        }
    },
    undoable: false,
    redact: false
}

export const attack = {
    move: (G: any, ctx: Ctx, attackingTerritoryId: string, defendingTerritoryId: string, unitCount: number = 3) => {
        const attackingTerritory: Territory = G.boardData.territories.find((t: Territory) => t.id === attackingTerritoryId);
        const defendingTerritory: Territory = G.boardData.territories.find((t: Territory) => t.id === defendingTerritoryId);

        if (attackingTerritory.units <= 1) { console.log(`can't attack with a single unit`); return; }
        if (attackingTerritory.units < unitCount) { console.log(`can't attack with more units than you have`); return; }

        if (unitCount > 3) {
            console.log(`TODO: split this in to groups of 3...`);
            return;
        }

        const attackCount = Math.min(attackingTerritory.units - 1, unitCount);
        const defendCount = Math.min(defendingTerritory.units, 2);

        const random = ctx.random!;
        const attackRoles = random.D6(attackCount);
        const defendRoles = random.D6(defendCount);


        // <crazy warfish dice roll logic>
        let ar = Array.from(attackRoles.sort().reverse());
        let dr = Array.from(defendRoles.sort().reverse());

        let al = 0;
        let dl = 0;
        while (ar.length && dr.length) {
            const a = ar[0];
            const d = dr[0];

            if (a > d) {
                dl++;
                ar.shift();
                dr.shift();
            } else {
                const aIdx = ar.findIndex((a) => d >= a);
                if (aIdx >= 0) {
                    al++;
                    ar.splice(aIdx, 1);
                    dr.shift();
                } else {
                    ar.shift();
                    dr.shift();
                }
            }
        }
        // </crazy warfish dice roll logic>


        const attackingLosses = al;
        const defendingLosses = dl;

        console.log(attackingTerritory.controlledBy, attackRoles, defendingTerritory.controlledBy, defendRoles, attackingLosses, defendingLosses);

        attackingTerritory.units = attackingTerritory.units - attackingLosses;
        defendingTerritory.units = defendingTerritory.units - defendingLosses;

        if (defendingTerritory.units === 0) {
            defendingTerritory.units = attackCount - attackingLosses;
            defendingTerritory.controlledBy = attackingTerritory.controlledBy;
            attackingTerritory.units = attackingTerritory.units - defendingTerritory.units;

            checkBoardState(G, ctx);

            console.log(attackingTerritory.controlledBy, defendingTerritory.controlledBy);

            if (ctx.events?.setStage) {
                ctx.events.setStage('postAttackTransfer');
            }
        }
    },
    undoable: false,
    redact: true,
    client: false
}

export const postAttackTransfer = {
    move: (G: any, ctx: Ctx, territoryId: string) => {
        const territory: Territory = G.boardData.territories.find((t: Territory) => t.id === territoryId);
        if (ctx.events?.setStage) {
            ctx.events.setStage('attack');
        }
    },
    undoable: false,
    redact: true,
    client: false
}

export const completeAttackPhase = {
    move: (G: any, ctx: Ctx) => {
        if (ctx.events?.setStage) {
            ctx.events.setStage('transfer');
        }
    },
    undoable: false,
    redact: false
}

export const transfer = {
    move: (G: any, ctx: Ctx) => {
    },
    undoable: false,
    redact: true,
    client: false
}

export const completeTransferPhase = {
    move: (G: any, ctx: Ctx) => {
        if (ctx.events?.endTurn) {
            ctx.events.endTurn();
        }
    },
    undoable: false,
    redact: false
}
