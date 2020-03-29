import { Ctx } from "boardgame.io";

import { Territory } from "./Territory";


export const deployUnits = {
    move: (G: any, ctx: Ctx, territoryId: string, unitCount: number) => {
        const territory: Territory = G.boardData.territories.find((t: Territory) => t.id === territoryId);
        if (territory) {
            territory.controlledBy = ctx.currentPlayer;
            territory.units = (territory.units ?? 0) + unitCount;

            territory.colorIdx = ctx.player?.get()?.colorIdx;
        }
    },
    undoable: true,
    redact: true
}

export const completeDeployment = {
    move: (G: any, ctx: Ctx) => {
        if (ctx.events?.endStage) {
            ctx.events.endStage();
        }
    },
    undoable: false,
    redact: true
}
