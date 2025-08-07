export interface EntitySpawn {
  mob: string;
  count: number;
}

export interface BossSpawn {
  x: number;
  y: number;
  entity: string;
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
  bossSpawn?: BossSpawn;
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
          { mob: "SkeletonWarrior", count: 4 },
          { mob: "Bat", count: 5 },
        ],
      },
      {
        name: "left entrace isle",
        x1: 870,
        y1: 2423,
        x2: 1350,
        y2: 2511,
        entities: [
          { mob: "SkeletonArcher", count: 3 },
          { mob: "SkeletonWarrior", count: 2 },
        ],
      },
      {
        name: "left entrace room cell 1",
        x1: 1136,
        y1: 2246,
        x2: 1227,
        y2: 2317,
        entities: [{ mob: "SkeletonArcher", count: 1 }],
      },
      {
        name: "left entrace room cell 2",
        x1: 907,
        y1: 2256,
        x2: 976,
        y2: 2331,
        entities: [{ mob: "SkeletonArcher", count: 1 }],
      },
      {
        name: "left entrace room",
        x1: 537,
        y1: 2368,
        x2: 795,
        y2: 2504,
        entities: [
          { mob: "SkeletonArcher", count: 2 },
          { mob: "SkeletonWarrior", count: 2 },
          { mob: "SkeletonAssassin", count: 2 },
        ],
      },
      {
        name: "right entrance room isle",
        x1: 1642,
        y1: 2269,
        x2: 1972,
        y2: 2330,
        entities: [{ mob: "Bat", count: 8 }],
      },
      {
        name: "right entrance room",
        x1: 2037,
        y1: 2230,
        x2: 2304,
        y2: 2363,
        entities: [
          { mob: "SkeletonBerserker", count: 3 },
          { mob: "SkeletonAssassin", count: 1 },
        ],
      },
      {
        name: "path fork",
        x1: 1338,
        y1: 1983,
        x2: 1500,
        y2: 2031,
        entities: [
          {
            mob: "SkeletonBerserker",
            count: 1,
          },
          {
            mob: "SkeletonArcher",
            count: 2,
          },
        ],
      },
      {
        name: "upper left isle",
        x1: 588,
        y1: 1400,
        x2: 1270,
        y2: 1485,
        entities: [
          {
            mob: "SkeletonBerserker",
            count: 2,
          },
          {
            mob: "SkeletonAssassin",
            count: 2,
          },
          {
            mob: "SkeletonArcher",
            count: 2,
          },
        ],
      },
      {
        name: "upper right isle",
        x1: 1859,
        y1: 1283,
        x2: 2698,
        y2: 1349,
        entities: [
          {
            mob: "SkeletonArcher",
            count: 2,
          },
          {
            mob: "SkeletonWarrior",
            count: 4,
          },
        ],
      },
    ],

    spawnPoint: { x: 1350, y: 3200 },
    bossSpawn: {
      x: 1516,
      y: 243,
      entity: "LanternPhantom",
    },
  },
};
