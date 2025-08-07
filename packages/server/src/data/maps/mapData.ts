export interface EntitySpawn {
  mob: string;
  count: number;
}

export interface SpawnRegion {
  name?: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  entities: EntitySpawn[];
}

export interface MapData {
  name: string;
  width: number;
  height: number;
  spawnRegions: SpawnRegion[];
  spawnPoint: { x: number; y: number };
}

export const MAPS_DATA: Record<string, MapData> = {
  palace_interior: {
    name: "palace_interior",
    width: 80,
    height: 64,
    spawnRegions: [],
    spawnPoint: { x: 0, y: 0 },
  },
  dungeon: {
    name: "dungeon",
    width: 0,
    height: 0,
    spawnRegions: [
      {
        name: "entrance room",
        x1: 1183,
        y1: 3003,
        x2: 1575,
        y2: 3172,
        entities: [{ mob: "Bat", count: 2 }],
      },
      {
        name: "entrance isle",
        x1: 1381,
        y1: 2540,
        x2: 1444,
        y2: 2822,
        entities: [
          { mob: "SkeletonWarrior", count: 2 },
          { mob: "Bat", count: 3 },
        ],
      },
    ],
    spawnPoint: { x: 1350, y: 3200 },
  },
};
