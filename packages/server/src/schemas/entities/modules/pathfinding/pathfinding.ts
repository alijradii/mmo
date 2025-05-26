import { PriorityQueue } from "../../../../utils/dsa/priorityQueue";

type Coord = { x: number; y: number };

function heuristic(s: Coord, e: Coord): number {
  return Math.max(Math.abs(s.x - e.x), Math.abs(s.y - e.y));
}

function key(coord: Coord): string {
  return `${coord.x},${coord.y}`;
}

function reconstructPath(
  cameFrom: Map<string, Coord>,
  current: Coord
): Coord[] {
  const path: Coord[] = [current];

  while (cameFrom.has(key(current))) {
    current = cameFrom.get(key(current))!;
    path.push(current);
  }

  path.pop();
  return path.reverse();
}

export const computePathAsync = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  map: number[][]
): Promise<Array<{ x: number; y: number }> | null> => {
  return new Promise((resolve) => {
    setImmediate(() => {
      try {
        const result = astar(start, end, map);
        resolve(result);
      } catch (err) {
        console.error("Pathfinding failed:", err);
        resolve(null);
      }
    });
  });
};

export async function astar(
  startCoords: Coord,
  endCoords: Coord,
  worldMap: number[][],
  maxNodes = 4000 // ← node exploration limit
): Promise<Coord[] | null> {
  // convert world-space coords to tile coords
  const start: Coord = {
    x: Math.floor(startCoords.x / 16),
    y: Math.floor(startCoords.y / 16),
  };
  const end: Coord = {
    x: Math.floor(endCoords.x / 16),
    y: Math.floor(endCoords.y / 16),
  };

  const pq = new PriorityQueue<Coord>();
  const openSet = new Set<string>();
  const gScore = new Map<string, number>();
  const cameFrom = new Map<string, Coord>();

  pq.put(0, start);
  openSet.add(key(start));
  gScore.set(key(start), 0);

  const directions: Coord[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  let exploredNodes = 0;

  while (!pq.isEmpty()) {
    if (++exploredNodes > maxNodes) {
      console.warn(
        `A* aborted: exceeded ${maxNodes} node explorations from (${start.x},${start.y}) to (${end.x},${end.y})`
      );
      return null;
    }

    const current = pq.get();
    openSet.delete(key(current));

    if (current.x === end.x && current.y === end.y) {
      return reconstructPath(cameFrom, end);
    }

    for (const dir of directions) {
      const neighbor: Coord = {
        x: current.x + dir.x,
        y: current.y + dir.y,
      };

      // bounds check
      if (
        neighbor.y < 0 ||
        neighbor.y >= worldMap.length ||
        neighbor.x < 0 ||
        neighbor.x >= worldMap[0].length
      ) {
        continue;
      }

      // walkable tile?
      if (worldMap[neighbor.y][neighbor.x] !== 1) continue;

      const tentativeG = (gScore.get(key(current)) ?? Infinity) + 1;
      const neighborKey = key(neighbor);

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        const fScore = tentativeG + heuristic(neighbor, end);

        if (!openSet.has(neighborKey)) {
          pq.put(fScore, neighbor);
          openSet.add(neighborKey);
        }
      }
    }
  }

  return null;
}
