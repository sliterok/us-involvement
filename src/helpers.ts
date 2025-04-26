export function greenRedMix(t: number): [number, number, number] {
  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  const hue = 120 * clamp(t);
  const { r, g, b } = hsvToRgb(hue, 1, 1);
  return [r, g, b];
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let [r1, g1, b1] = [0, 0, 0];
  if (hp < 1) [r1, g1] = [c, x];
  else if (hp < 2) [r1, g1] = [x, c];
  else if (hp < 3) [g1, b1] = [c, x];
  else if (hp < 4) [g1, b1] = [x, c];
  else if (hp < 5) [r1, b1] = [x, c];
  else [r1, b1] = [c, x];

  const m = v - c;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}
