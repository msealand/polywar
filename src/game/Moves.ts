import { Ctx } from "boardgame.io";

import { Territory } from "./Territory";


export const deployUnits = {
    move: (G: any, ctx: Ctx, territoryId: string, unitCount: number) => {
        const territory: Territory = G.boardData.territories.find((t: Territory) => t.id === territoryId);
        if (territory && (((territory.controlledBy === undefined) && ((territory.units ?? 0) <= 0)) || (territory.controlledBy === ctx.currentPlayer))) {
            territory.controlledBy = ctx.currentPlayer;
            territory.units = (territory.units ?? 0) + unitCount;

            territory.colorIdx = ctx.player?.get()?.colorIdx;
        }
    },
    undoable: true,
    redact: true
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
    move: (G: any, ctx: Ctx, attackingTerritoryId: string, defendingTerritoryId: string) => {
        const attackingTerritory: Territory = G.boardData.territories.find((t: Territory) => t.id === attackingTerritoryId);
        const defendingTerritory: Territory = G.boardData.territories.find((t: Territory) => t.id === defendingTerritoryId);

        const random = ctx.random!;
        const attackRoles = random.D6(Math.min(attackingTerritory.units, 3));
        const defendRoles = random.D6(Math.min(defendingTerritory.units, 2));


        const defendingLosses = defendRoles.reduce((losses, roll) => {
            if (attackRoles.some((ar) => ar > roll)) losses++;
            return losses;
        }, 0);

        const attackingLosses = attackRoles.reduce((losses, roll) => {
            if (defendRoles.some((dr) => dr > roll)) losses++;
            return losses;
        }, 0);

        // const attackingLosses = Math.min(defendRoles.filter((dr) => !attackRoles.some((ar) => ar >= dr)).length, attackRoles.length);
        // const defendingLosses = Math.min(attackRoles.filter((ar) => !defendRoles.some((dr) => dr >= ar)).length, defendRoles.length);

        console.log(attackRoles, defendRoles, attackingLosses, defendingLosses);

        attackingTerritory.units = attackingTerritory.units - attackingLosses;
        defendingTerritory.units = defendingTerritory.units - defendingLosses;

        if (ctx.events?.setStage) {
            ctx.events.setStage('postAttackTransfer');
        }
    },
    undoable: true,
    redact: false
}

export const postAttackTransfer = {
    move: (G: any, ctx: Ctx, territoryId: string) => {
        const territory: Territory = G.boardData.territories.find((t: Territory) => t.id === territoryId);
        if (ctx.events?.setStage) {
            ctx.events.setStage('attack');
        }
    },
    undoable: true,
    redact: false
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
    redact: false
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
