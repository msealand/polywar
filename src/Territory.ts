export type Coordinate = { x: number, y: number };

export type Territory = {
  id: string;
  name: string;

  colorIdx: number;

  position: Coordinate;
  border: Array<Coordinate>;

  borderingTerritories: Array<Territory>;

  units: number;
  controlledBy: string;

  fogged: boolean;
};
