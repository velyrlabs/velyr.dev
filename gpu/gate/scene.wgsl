// Analytic Velyr mark: r = bar coverage, g = token coverage, b = rim light on the bar edges.
struct Params {
  resolution: vec2f,
  center: vec2f,
  light: vec2f,
  tokenHalf: vec2f,
  unit: f32,
  tokenY: f32,
  tokenAlpha: f32,
  reach: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn sdQuad(p: vec2f, a: vec2f, b: vec2f, c: vec2f, d: vec2f) -> f32 {
  var v = array<vec2f, 4>(a, b, c, d);
  var dist = dot(p - v[0], p - v[0]);
  var side = 1.0;
  var j = 3u;
  for (var i = 0u; i < 4u; i++) {
    let e = v[j] - v[i];
    let w = p - v[i];
    let q = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    dist = min(dist, dot(q, q));
    let inside = vec3<bool>((p.y >= v[i].y), (p.y < v[j].y), (e.x * w.y > e.y * w.x));
    if (all(inside) || !any(inside)) {
      side = -side;
    }
    j = i;
  }
  return side * sqrt(dist);
}

// Brand geometry, exact: M4 8h13l13 48H17z and M60 8H47L34 56h13z.
fn sdBars(p: vec2f) -> f32 {
  let left = sdQuad(p, vec2f(4.0, 8.0), vec2f(17.0, 8.0), vec2f(30.0, 56.0), vec2f(17.0, 56.0));
  let right = sdQuad(p, vec2f(60.0, 8.0), vec2f(47.0, 8.0), vec2f(34.0, 56.0), vec2f(47.0, 56.0));
  return min(left, right);
}

fn sdBox(p: vec2f, center: vec2f, half: vec2f) -> f32 {
  let q = abs(p - center) - half;
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let px = uv * params.resolution;
  let m = (px - params.center) / params.unit + vec2f(32.0);
  let bars = sdBars(m);
  let barsPx = bars * params.unit;
  let barCoverage = clamp(0.5 - barsPx, 0.0, 1.0);

  let token = sdBox(m, vec2f(32.0, params.tokenY), params.tokenHalf) * params.unit;
  let tokenCoverage = clamp(0.5 - token, 0.0, 1.0) * params.tokenAlpha;

  let e = 0.05;
  let normal = normalize(vec2f(
    sdBars(m + vec2f(e, 0.0)) - sdBars(m - vec2f(e, 0.0)),
    sdBars(m + vec2f(0.0, e)) - sdBars(m - vec2f(0.0, e))
  ) + vec2f(1e-5));
  let toLight = params.light - px;
  let facing = pow(max(dot(normal, normalize(toLight)), 0.0), 1.5);
  let edge = exp(-abs(barsPx) / 1.4);
  let bevel = exp(-max(-barsPx, 0.0) / (params.unit * 1.1)) * barCoverage;
  let reachDistance = length(toLight) / (params.unit * 64.0);
  let falloff = 1.0 / (1.0 + reachDistance * reachDistance * params.reach);
  let rim = (edge + bevel * 0.4) * facing * falloff;

  return vec4f(barCoverage, tokenCoverage, rim, 1.0);
}
