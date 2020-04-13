import { Ctx } from "boardgame.io";

export type Coordinate = { x: number, y: number };

export type Territory = {
  id: string;
  name: string;

  colorIdx: number;

  position: Coordinate;
  border: Array<Coordinate>;

  borderingTerritories: Array<Territory>;
  groups: Array<TerritoryGroup>;

  units: number;
  controlledBy: string;

  fogged: boolean;
};

export type TerritoryGroup = {
  id: string;
  name: string;

  bonusUnits: number;
  controlledBy: string;
  
  territories: Array<Territory>;
  
  colorIdx: number;
  fogged: boolean;
}

const findTerritory = (G: any, id: string) => {
  return G.boardData.territories.find(t => t.id === id);
}

export const checkBoardState = (G: any, ctx: Ctx) => {
  checkTerritories(G, ctx);
  checkTerritoryGroups(G);
}

const checkTerritories = (G: any, ctx: Ctx) => {
  const playerId = ctx?.currentPlayer;
  const territories = G.boardData.territories;
  territories.forEach((t) => {
    const borderingTerritories = t.borderingTerritories ?? t.borders.map(id => findTerritory(G, id));
    t.fogged = (t.controlledBy !== playerId) && (!borderingTerritories.some((t) => t.controlledBy === playerId));
  });
}

const checkTerritoryGroups = (G: any) => {
  const groups = G.boardData.groups;
  groups.forEach((group) => {
    const groupTerritories = G.boardData.territories.filter((t) => t.groups.find((g) => {
      return (typeof g === 'string') ? (g === group.id) : (g.id === group.id);
    }))

    let controllingPlayer = groupTerritories[0].controlledBy;
    if (controllingPlayer == "-1") controllingPlayer = undefined; // <-- Gotta find where we set -1

    if (groupTerritories.every(t => (t.controlledBy === controllingPlayer))) {
      group.controlledBy = controllingPlayer;
      group.colorIdx = groupTerritories[0].colorIdx;
      group.fogged = false;
    } else {
      group.controlledBy = undefined;
      group.colorIdx = undefined;
      group.fogged = groupTerritories.some(t => t.fogged);
    } 
  })
}
