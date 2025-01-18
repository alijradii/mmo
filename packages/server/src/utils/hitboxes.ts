export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const rectanglesCollider = (r1: Rectangle, r2: Rectangle): boolean => {
  return !(
    r1.x > r2.x + r2.width ||
    r1.x + r1.width < r2.x ||
    r1.y > r2.y + r2.height ||
    r1.y + r1.height < r2.y
  );
};
