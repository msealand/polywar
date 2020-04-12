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
}

export const checkTerritoryGroups = (G: any) => {
  const groups = G.boardData.groups;
  groups.forEach((group) => {
    const groupTerritories = G.boardData.territories.filter((t) => t.groups.find((g) => {
      return (typeof g === 'string') ? (g === group.id) : (g.id === group.id);
    }))

    let controllingPlayer = groupTerritories[0].controlledBy;
    if (controllingPlayer == "-1") controllingPlayer = undefined; // <-- Gotta find where we set -1

    if (controllingPlayer === undefined) {
        group.controlledBy = undefined;
    } else {
        group.controlledBy = groupTerritories.every(t => (t.controlledBy === controllingPlayer)) ? controllingPlayer : undefined;
    }
  })
}
