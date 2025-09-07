interface TwoVecProps {
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

export const getManhattanDistance = ({
  ax,
  ay,
  bx,
  by,
}: TwoVecProps): number => {
  return Math.abs(ax - bx) + Math.abs(ay - by);
};

export const getEuclideanDistance = ({
  ax,
  ay,
  bx,
  by,
}: TwoVecProps): number => {
  return Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
};

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}