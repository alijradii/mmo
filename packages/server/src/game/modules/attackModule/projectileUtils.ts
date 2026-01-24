interface calculateLaunchSpeedProps {
  x0: number;
  v0: number;
  xf: number;
}

export const calculateLaunchSpeed = ({
  x0,
  v0,
  xf,
}: calculateLaunchSpeedProps) => {
  // Handle zero velocity case
  if (v0 === 0) {
    return 0;
  }

  const t = Math.max(0, Math.floor((xf - x0) / v0) - 1);
  
  // Handle division by zero if t is 0
  if (t === 0) {
    return 0;
  }

  const vz = (-10 - 0.5 * 12 * t * t - 16) / t;
  return vz;
};
