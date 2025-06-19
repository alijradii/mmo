import { Entity } from "../../entity";
import { ChaseAttackState } from "../../nonPlayerStates/chaseAttackState";
import { GoToState } from "../../nonPlayerStates/goToState";
import { Coord, toTile } from "../pathfinding/pathUtils";
import { Planner } from "../planning/planner";

const TILE_SIZE = 16;
const EDGE_BUFFER = 2; // Tiles within this distance from edge are considered unsafe

function isSafeTile(tile: Coord, heightmap: number[][]): boolean {
  const rows = heightmap.length;
  const cols = heightmap[0].length;

  return (
    tile.x >= EDGE_BUFFER &&
    tile.x < cols - EDGE_BUFFER &&
    tile.y >= EDGE_BUFFER &&
    tile.y < rows - EDGE_BUFFER &&
    heightmap[tile.y][tile.x] === 1
  );
}

export function rangedCombatPlanner(entity: Entity): void {
  const planner: Planner | undefined = entity.planner;
  if (!planner) return;

  const hostiles = planner.hostileEntities;
  if (!hostiles || hostiles.length === 0) return;

  // Find nearest hostile
  let nearest: Entity = hostiles[0];
  let minDist2 = Infinity;
  for (const h of hostiles) {
    const dx = h.x - entity.x;
    const dy = h.y - entity.y;
    const dist2 = dx * dx + dy * dy;
    if (dist2 < minDist2) {
      minDist2 = dist2;
      nearest = h;
    }
  }

  const range = entity.autoAttack.weapon?.projectileRange ?? 0;
  const rangeSq = range * range;
  const reach = 150;

  const ATTACK_PROBABILITY = minDist2 < 2 * reach ? 0.5 : 0.7;
  if (minDist2 > rangeSq && Math.random() < ATTACK_PROBABILITY) {
    entity.setState(
      new ChaseAttackState(entity, nearest, entity.autoAttack, reach)
    );
    return;
  }

  const currentTile = toTile(entity.x, entity.y, TILE_SIZE);
  const heightmap = entity.world.mapInfo.heightmap;
  const rows = heightmap.length;
  const cols = heightmap[0].length;

  if (!isSafeTile(currentTile, heightmap)) {
    entity.setState(
      new ChaseAttackState(entity, nearest, entity.autoAttack, reach)
    );
    return;
  }

  const dx = entity.x - nearest.x;
  const dy = entity.y - nearest.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;

  const MAX_STEPS = 4;
  let chosenTile: Coord | null = null;

  for (let steps = MAX_STEPS; steps >= 1; steps--) {
    const candidateX = entity.x + ux * steps * TILE_SIZE;
    const candidateY = entity.y + uy * steps * TILE_SIZE;
    const candidateTile = toTile(candidateX, candidateY, TILE_SIZE);

    if (!isSafeTile(candidateTile, heightmap)) continue;

    chosenTile = candidateTile;
    break;
  }

  if (!chosenTile) {
    const directions: Coord[] = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
    ];

    const bestTile = directions
      .map((dir) => ({ x: currentTile.x + dir.x, y: currentTile.y + dir.y }))
      .filter((tile) => isSafeTile(tile, heightmap))
      .sort((a, b) => {
        const dxA = (a.x + 0.5) * TILE_SIZE - nearest.x;
        const dyA = (a.y + 0.5) * TILE_SIZE - nearest.y;
        const dxB = (b.x + 0.5) * TILE_SIZE - nearest.x;
        const dyB = (b.y + 0.5) * TILE_SIZE - nearest.y;
        return dxB * dxB + dyB * dyB - (dxA * dxA + dyA * dyA); // Prefer farther from hostile
      })[0];

    if (bestTile) {
      chosenTile = bestTile;
    }
  }

  if (!chosenTile) {
    entity.setState(
      new ChaseAttackState(entity, nearest, entity.autoAttack, reach)
    );
    return;
  }

  const destination: Coord = {
    x: (chosenTile.x + 0.5) * TILE_SIZE,
    y: (chosenTile.y + 0.5) * TILE_SIZE,
  };

  if (chosenTile.x === currentTile.x && chosenTile.y === currentTile.y) {
    entity.setState(
      new ChaseAttackState(entity, nearest, entity.autoAttack, reach)
    );
    return;
  }

  entity.setState(
    new GoToState(entity, destination, () => {}, /* arriveRadius = */ 2)
  );
}
