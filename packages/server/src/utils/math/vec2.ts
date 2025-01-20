export interface Vec2 {
  x: number;
  y: number;
}

export const Vec2MultiplyByScalar = (scalar: number, vec: Vec2): Vec2 => {
  return { x: vec.x * scalar, y: vec.y * scalar };
};

export const Vec2Length = (vec: Vec2): number => {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
};

export const Vec2Dot = (a: Vec2, b: Vec2): number => {
  return a.x * b.x + a.y * b.y;
};

export const Vec2Sub = (a: Vec2, b: Vec2): Vec2 => {
  return { x: a.x - b.x, y: a.y - b.y };
};

export const Vec2Limit = (vector: Vec2, maxLength: number): Vec2 => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  if (length > maxLength) {
    const scale = maxLength / length;
    return {
      x: vector.x * scale,
      y: vector.y * scale,
    };
  }

  return { x: vector.x, y: vector.y };
};
