export interface Vector {
  x: number;
  y: number;
}

export const getDirectionFromVector = ({ x, y }: Vector): string => {
  if (x > 0) return "right";
  else if (x < 0) return "left";
  else if (y > 0) return "down";
  return "up";
};
