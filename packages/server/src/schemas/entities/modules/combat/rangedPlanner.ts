import { Entity } from "../../entity";
import { ChaseAttackState } from "../../nonPlayerStates/chaseAttackState";
import { GoToState } from "../../nonPlayerStates/goToState";
import { Coord, toTile } from "../pathfinding/pathUtils";
import { Planner } from "../planning/planner";

export function rangedCombatPlanner(entity: Entity): void {
  const planner: Planner | undefined = (entity as any).planner;
  if (!planner) return;

  const hostiles = planner.hostileEntities;
  if (!hostiles || hostiles.length === 0) {
    return;
  }

  let nearest: Entity = hostiles[0];
  let minDist2 = Number.POSITIVE_INFINITY;
  for (const h of hostiles) {
    const dx = h.x - entity.x;
    const dy = h.y - entity.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < minDist2) {
      minDist2 = d2;
      nearest = h;
    }
  }

  const range = entity.autoAttack.weapon?.projectileRange ?? 0;
  const rangeSq = range * range;

  if (minDist2 > rangeSq) {
    entity.setState(new ChaseAttackState(entity, nearest, entity.autoAttack));
    return;
  }

  const ATTACK_PROBABILITY = 0.3;
  if (Math.random() < ATTACK_PROBABILITY) {
    // Attack the nearest hostile
    entity.setState(new ChaseAttackState(entity, nearest, entity.autoAttack));
    return;
  }

  const currentTile = toTile(entity.x, entity.y, 16);
  const heightmap = entity.world.mapInfo.heightmap;
  if (
    currentTile.y < 0 ||
    currentTile.y >= heightmap.length ||
    currentTile.x < 0 ||
    currentTile.x >= heightmap[0].length ||
    heightmap[currentTile.y][currentTile.x] !== 1
  ) {
    return;
  }

  const targetPos: Coord = { x: nearest.x, y: nearest.y };

  const dxWorld = entity.x - targetPos.x;
  const dyWorld = entity.y - targetPos.y;
  const lenWorld = Math.sqrt(dxWorld * dxWorld + dyWorld * dyWorld) || 1;
  const ux = dxWorld / lenWorld;
  const uy = dyWorld / lenWorld;

  const MAX_STEPS = 8;
  const tileSize = 16;
  let chosenTile = currentTile;
  let found = false;

  for (let steps = MAX_STEPS; steps >= 1; steps--) {
    const candX = entity.x + ux * steps * tileSize;
    const candY = entity.y + uy * steps * tileSize;
    const candTile = toTile(candX, candY, tileSize);

    if (
      candTile.y < 0 ||
      candTile.y >= heightmap.length ||
      candTile.x < 0 ||
      candTile.x >= heightmap[0].length
    ) {
      continue;
    }

    if (heightmap[candTile.y][candTile.x] !== 1) {
      continue;
    }

    chosenTile = candTile;
    found = true;
    break;
  }

  if (!found) {
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

    const currentCenter: Coord = {
      x: (currentTile.x + 0.5) * tileSize,
      y: (currentTile.y + 0.5) * tileSize,
    };
    const currDx = currentCenter.x - targetPos.x;
    const currDy = currentCenter.y - targetPos.y;
    let bestDist2 = currDx * currDx + currDy * currDy;

    for (const dir of directions) {
      const neighbor: Coord = {
        x: currentTile.x + dir.x,
        y: currentTile.y + dir.y,
      };
      if (
        neighbor.y < 0 ||
        neighbor.y >= heightmap.length ||
        neighbor.x < 0 ||
        neighbor.x >= heightmap[0].length ||
        heightmap[neighbor.y][neighbor.x] !== 1
      ) {
        continue;
      }
      const neighCenter: Coord = {
        x: (neighbor.x + 0.5) * tileSize,
        y: (neighbor.y + 0.5) * tileSize,
      };
      const dxN = neighCenter.x - targetPos.x;
      const dyN = neighCenter.y - targetPos.y;
      const dist2N = dxN * dxN + dyN * dyN;

      if (dist2N > bestDist2) {
        bestDist2 = dist2N;
        chosenTile = neighbor;
      }
    }
  }

  if (chosenTile.x === currentTile.x && chosenTile.y === currentTile.y) {
    return;
  }

  const destination: Coord = {
    x: (chosenTile.x + 0.5) * tileSize,
    y: (chosenTile.y + 0.5) * tileSize,
  };

  entity.setState(
    new GoToState(
      entity,
      destination,
      () => {
        rangedCombatPlanner(entity);
      },
      /* arriveRadius = */ 2
    )
  );
}
