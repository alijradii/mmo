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
  const t = Math.round((xf - x0) / v0);

  const vz = (-16 - 0.5 * 9.81 * t * t) / t;
  return vz;
};
