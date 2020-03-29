import { Board } from './Map';
import { Territory } from './Territory';
import { Delaunay } from "d3-delaunay";
import { Ctx } from 'boardgame.io';

export function loadBoard(G: any, ctx: Ctx): Board {
  const boardData = G.boardData;
  const territoryMap = boardData.territories.reduce((map: Map<string, Territory>, t: Territory) => {
    map.set(t.id, { ...t });
    return map;
  }, new Map<string, Territory>());

  const territories: Array<Territory> = Array.from(territoryMap.values());
  const allPoints = territories.reduce<Array<Array<number>>>((points, t) => {
    points.push([t.position.x, t.position.y]);
    return points;
  }, []);

  const delaunay = Delaunay.from(allPoints);
  const voronoi = delaunay.voronoi([-1, -1, 1004, 589]);
  territories.forEach((t, idx) => {
    t.borderingTerritories = (t as any).borders.map((id: string) => territoryMap.get(id));
    t.border = voronoi.cellPolygon(idx).map((p) => {
      return { x: p[0], y: p[1] };
    });
    
    // This doesn't work??
    // t.colorIdx = (ctx.player?.state[t.controlledBy] as any)?.colorIdx;

    // t.fogged = (Math.random() >= 0.33);
    // t.colorIdx = idx;
    return t;
  });

  return { territories };
}
