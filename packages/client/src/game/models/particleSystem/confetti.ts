export function createConfetti(duration: number = 2000): void {
  const random = Math.random;
  const cos = Math.cos;
  const sin = Math.sin;
  const PI = Math.PI;
  const PI2 = PI * 2;

  const particles = 150;
  const spread = 20;
  const sizeMin = 5;
  const sizeMax = 12 - sizeMin;
  const eccentricity = 10;
  const deviation = 100;
  const dxThetaMin = -0.1;
  const dxThetaMax = -dxThetaMin - dxThetaMin;
  const dyMin = 0.13;
  const dyMax = 0.18;
  const dThetaMin = 0.4;
  const dThetaMax = 0.7 - dThetaMin;

  const color = (r: number, g: number, b: number) => `rgb(${r},${g},${b})`;

  type ColorTheme = () => string;

  const colorThemes: ColorTheme[] = [
    () =>
      color((200 * random()) | 0, (200 * random()) | 0, (200 * random()) | 0),
    () => {
      const black = (200 * random()) | 0;
      return color(200, black, black);
    },
    () => {
      const black = (200 * random()) | 0;
      return color(black, 200, black);
    },
    () => {
      const black = (200 * random()) | 0;
      return color(black, black, 200);
    },
    () => color(200, 100, (200 * random()) | 0),
    () => color((200 * random()) | 0, 200, 200),
  ];

  const interpolation = (a: number, b: number, t: number) =>
    ((1 - cos(PI * t)) / 2) * (b - a) + a;

  const radius = 1 / eccentricity;
  const radius2 = radius + radius;

  function createPoisson(): number[] {
    const domain: number[] = [radius, 1 - radius];
    let measure = 1 - radius2;
    const spline: number[] = [0, 1];

    while (measure) {
      let dart = measure * random();
      let i, l, interval, a, b;

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        a = domain[i];
        b = domain[i + 1];
        interval = b - a;
        if (dart < measure + interval) {
          spline.push((dart += a - measure));
          break;
        }
        measure += interval;
      }
      const c = dart - radius;
      const d = dart + radius;

      for (i = domain.length - 1; i > 0; i -= 2) {
        l = i - 1;
        a = domain[l];
        b = domain[i];
        if (a >= c && a < d) {
          if (b > d) domain[l] = d;
          else domain.splice(l, 2);
        } else if (a < c && b > c) {
          if (b <= d) domain[i] = c;
          else domain.splice(i, 0, c, d);
        }
      }

      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        measure += domain[i + 1] - domain[i];
      }
    }

    return spline.sort();
  }

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "0";
  container.style.overflow = "visible";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  class Confetto {
    frame: number;
    outer: HTMLDivElement;
    inner: HTMLDivElement;
    axis: string;
    theta: number;
    dTheta: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    splineX: number[];
    splineY: number[];

    constructor(theme: ColorTheme) {
      this.frame = 0;
      this.outer = document.createElement("div");
      this.inner = document.createElement("div");
      this.outer.appendChild(this.inner);

      const outerStyle = this.outer.style;
      const innerStyle = this.inner.style;

      outerStyle.position = "absolute";
      outerStyle.width = `${sizeMin + sizeMax * random()}px`;
      outerStyle.height = `${sizeMin + sizeMax * random()}px`;
      innerStyle.width = "100%";
      innerStyle.height = "100%";
      innerStyle.backgroundColor = theme();

      outerStyle.perspective = "50px";
      outerStyle.transform = `rotate(${360 * random()}deg)`;
      this.axis = `rotate3D(${cos(360 * random())},${cos(360 * random())},0,`;
      this.theta = 360 * random();
      this.dTheta = dThetaMin + dThetaMax * random();
      innerStyle.transform = this.axis + this.theta + "deg)";

      this.x = window.innerWidth * random();
      this.y = -deviation;
      this.dx = sin(dxThetaMin + dxThetaMax * random());
      this.dy = dyMin + dyMax * random();
      outerStyle.left = `${this.x}px`;
      outerStyle.top = `${this.y}px`;

      this.splineX = createPoisson();
      this.splineY = [];
      for (let i = 1, l = this.splineX.length - 1; i < l; ++i) {
        this.splineY[i] = deviation * random();
      }
      this.splineY[0] = this.splineY[this.splineX.length - 1] =
        deviation * random();
    }

    update(height: number, delta: number): boolean {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      let phi = (this.frame % 7777) / 7777;
      let i = 0,
        j = 1;
      while (phi >= this.splineX[j]) i = j++;
      const rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      phi *= PI2;

      const outerStyle = this.outer.style;
      const innerStyle = this.inner.style;

      outerStyle.left = `${this.x + rho * cos(phi)}px`;
      outerStyle.top = `${this.y + rho * sin(phi)}px`;
      innerStyle.transform = this.axis + this.theta + "deg)";

      return this.y > height + deviation;
    }
  }

  let confetti: Confetto[] = [];
  let prev: number | undefined;

  function addConfetto(theme: ColorTheme): void {
    const confetto = new Confetto(theme);
    confetti.push(confetto);
    container.appendChild(confetto.outer);
  }

  for (let i = 0; i < particles; i++) {
    setTimeout(() => {
      const theme = colorThemes[(colorThemes.length * random()) | 0];
      addConfetto(theme);
    }, spread * random());
  }

  let frame: number;
  function loop(timestamp: number) {
    const delta = prev !== undefined ? timestamp - prev : 0;
    prev = timestamp;
    const height = window.innerHeight;

    for (let i = confetti.length - 1; i >= 0; --i) {
      if (confetti[i].update(height, delta)) {
        container.removeChild(confetti[i].outer);
        confetti.splice(i, 1);
      }
    }

    if (confetti.length) {
      frame = requestAnimationFrame(loop);
    } else {
      document.body.removeChild(container);
      cancelAnimationFrame(frame);
    }
  }
  frame = requestAnimationFrame(loop);

  setTimeout(() => {
    confetti = [];
  }, duration);
}
