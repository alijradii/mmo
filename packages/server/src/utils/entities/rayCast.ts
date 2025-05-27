export function raycastClear(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  worldMap: number[][],
  tileSize = 16
): boolean {
  // Convert world-space points into tile coordinates
  let tx0 = Math.floor(x0 / tileSize);
  let ty0 = Math.floor(y0 / tileSize);
  const tx1 = Math.floor(x1 / tileSize);
  const ty1 = Math.floor(y1 / tileSize);

  const dx = Math.abs(tx1 - tx0);
  const dy = Math.abs(ty1 - ty0);
  const sx = tx0 < tx1 ? 1 : -1;
  const sy = ty0 < ty1 ? 1 : -1;

  let err = dx - dy;

  while (true) {
    // If this tile is not walkable, the ray is blocked
    if (
      ty0 < 0 ||
      ty0 >= worldMap.length ||
      tx0 < 0 ||
      tx0 >= worldMap[0].length ||
      worldMap[ty0][tx0] !== 1
    ) {
      return false;
    }

    // Reached the destination tile
    if (tx0 === tx1 && ty0 === ty1) {
      return true;
    }

    // Step
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      tx0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      ty0 += sy;
    }
  }
}
