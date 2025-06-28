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
