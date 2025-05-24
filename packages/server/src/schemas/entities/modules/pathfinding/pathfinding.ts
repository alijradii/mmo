type Coord = [number, number];

function heuristic(s: Coord, e: Coord): number {
  return Math.max(Math.abs(s[0] - e[0]), Math.abs(s[1] - e[1]));
}

function reconstructPath(
  cameFrom: Map<string, Coord>,
  current: Coord
): Coord[] {
  const path: Coord[] = [current];
  const key = (coord: Coord) => `${coord[0]},${coord[1]}`;

  while (cameFrom.has(key(current))) {
    current = cameFrom.get(key(current))!;
    path.push(current);
  }

  path.pop();
  return path.reverse();
}

export function astar(
  startCoords: Coord,
  endCoords: Coord,
  worldMap: number[][]
): Coord[] | null {
  const start: Coord = [
    Math.floor(startCoords[1] / 16),
    Math.floor(startCoords[0] / 16),
  ];
  const end: Coord = [
    Math.floor(endCoords[1] / 16),
    Math.floor(endCoords[0] / 16),
  ];

  const pq = new PriorityQueue<Coord>();
  const openSet = new Set<string>();
  const gScore = new Map<string, number>();
  const cameFrom = new Map<string, Coord>();

  const key = (coord: Coord) => `${coord[0]},${coord[1]}`;

  pq.put(0, start);
  openSet.add(key(start));
  gScore.set(key(start), 0);

  const directions: Coord[] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (!pq.isEmpty()) {
    const current = pq.get();
    const [r, c] = current;
    const height = worldMap[r][c];
    openSet.delete(key(current));

    if (current[0] === end[0] && current[1] === end[1]) {
      return reconstructPath(cameFrom, end);
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr < 0 ||
        nr >= worldMap.length ||
        nc < 0 ||
        nc >= worldMap[0].length
      ) {
        continue;
      }

      const newHeight = worldMap[nr][nc];
      if (newHeight !== 1) {
        continue;
      }

      const neighbor: Coord = [nr, nc];
      const tempGScore = (gScore.get(key(current)) ?? Infinity) + 1;

      if (tempGScore < (gScore.get(key(neighbor)) ?? Infinity)) {
        cameFrom.set(key(neighbor), current);
        gScore.set(key(neighbor), tempGScore);
        const fScore = tempGScore + heuristic(neighbor, end);

        if (!openSet.has(key(neighbor))) {
          pq.put(fScore, neighbor);
          openSet.add(key(neighbor));
        }
      }
    }
  }

  return null;
}
