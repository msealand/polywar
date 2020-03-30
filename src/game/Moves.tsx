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
    move: (G: any, ctx: Ctx, territoryId: string) => {
        const territory: Territory = G.boardData.territories.find((t: Territory) => t.id === territoryId);
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
