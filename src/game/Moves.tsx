import { Ctx } from "boardgame.io";

import { Territory } from "./Territory";


export const deployUnits = {
    move: (G: any, ctx: Ctx, territoryId: string, unitCount: number) => {
        const territory: Territory = G.boardData.territories.find((t: Territory) => t.id === territoryId);
        if (territory && (!territory.controlledBy || (territory.controlledBy === ctx.currentPlayer))) {
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
        if (ctx.events?.endStage) {
            ctx.events.endStage();
        }
    },
    undoable: false,
    redact: false
}

export const completeAttackPhase = {
    move: (G: any, ctx: Ctx) => {
        if (ctx.events?.endStage) {
            ctx.events.endStage();
        }
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
