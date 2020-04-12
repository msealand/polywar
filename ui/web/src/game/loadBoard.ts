import { Board } from './Map';
import { Territory, TerritoryGroup } from 'polywar';
import { Delaunay } from "d3-delaunay";

export function loadBoard(G: any, playerID: string): Board {
  const boardData = G.boardData;
  const territoryMap = boardData.territories.reduce((map: Map<string, Territory>, t: Territory) => {
    map.set(t.id, { ...t });
    return map;
  }, new Map<string, Territory>());
  const groupMap: Map<string, TerritoryGroup> = boardData.groups.reduce((map: Map<string, TerritoryGroup>, g: TerritoryGroup) => {
    const territories: Array<Territory> = g.territories.map((tid) => {
      return territoryMap.get(tid);
    })
    map.set(g.id, { ...g, territories });
    return map;
  }, new Map<string, TerritoryGroup>());

  const territories: Array<Territory> = Array.from(territoryMap.values());
  const allPoints = territories.reduce<Array<Array<number>>>((points, t) => {
    points.push([t.position.x, t.position.y]);
    return points;
  }, []);

  const delaunay = Delaunay.from(allPoints);
  const voronoi = delaunay.voronoi([-1, -1, 1004, 589]);
  territories.forEach((t, idx) => {
    t.groups = (t as any).groups.map((id) => groupMap.get(id)).sort((g1, g2) => g2.bonusUnits - g1.bonusUnits);
    t.borderingTerritories = (t as any).borders.map((id: string) => territoryMap.get(id));
    t.border = voronoi.cellPolygon(idx).map((p) => {
      return { x: p[0], y: p[1] };
    });

    t.fogged = false; //(t.controlledBy !== playerID) && (!t.borderingTerritories.some((t) => t.controlledBy === playerID));
    return t;
  });

  const groups = Array.from(groupMap.values()).sort((g1, g2) => g2.name - g1.name);

  return { territories, groups };
}
