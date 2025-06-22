import { raycastClear } from "../../../../utils/entities/rayCast";

export type Coord = { x: number; y: number };
export function toTile(x: number, y: number, tileSize: number = 16) {
  return { x: Math.floor(x / tileSize), y: Math.floor(y / tileSize) };
}

export function hasTargetMoved(
  a: { x: number; y: number },
  b: { x: number; y: number } | null
) {
  return !b || a.x !== b.x || a.y !== b.y;
}

export function isValidTile(tile: { x: number; y: number }, map: number[][]) {
  return map[tile.y]?.[tile.x] !== undefined;
}

export function isGrounded(
  a: { x: number; y: number },
  b: { x: number; y: number },
  map: number[][]
) {
  return map[a.y][a.x] === 1 && map[b.y][b.x] === 1;
}

export function shouldReplan(
  pathLength: number,
  waypointIndex: number,
  targetMoved: boolean,
  replanCooldown: number,
  stuckCounter: number
) {
  return (
    pathLength === 0 ||
    waypointIndex >= pathLength ||
    (targetMoved && replanCooldown <= 0) ||
    stuckCounter > 10
  );
}

export function prunePath(
  path: Array<{ x: number; y: number }>,
  tileSize: number,
  heightmap: number[][]
): Array<{ x: number; y: number }> {
  const pruned: typeof path = [];
  let i = 0;
  while (i < path.length) {
    let furthest = i;
    for (let j = path.length - 1; j > furthest; j--) {
      const p0 = {
        x: (path[i].x + 0.5) * tileSize,
        y: (path[i].y + 0.5) * tileSize,
      };
      const p1 = {
        x: (path[j].x + 0.5) * tileSize,
        y: (path[j].y + 0.5) * tileSize,
      };
      if (raycastClear(p0.x, p0.y, p1.x, p1.y, heightmap)) {
        furthest = j;
        break;
      }
    }
    pruned.push(path[furthest]);
    i = furthest + 1;
  }
  return pruned;
}
