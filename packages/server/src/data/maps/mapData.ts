export interface EntitySpawn {
    mob: string;
    count: number;
}

export interface SpawnRegion {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    entities: EntitySpawn[]
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
    spawnRegions: [],
    spawnPoint: { x: 1350, y: 3200 },
  },
};
