// Bars as Bone material, rim + volumetric scattering from the moving light, and the token as a
// Signal light source whose rays are occluded by the bars, so its light leaks through the slot.
struct Params {
  resolution: vec2f,
  light: vec2f,
  token: vec2f,
  aspect: vec2f,
  ink: vec3f,
  rimIntensity: f32,
  bone: vec3f,
  tokenIntensity: f32,
  signal: vec3f,
  frameIndex: u32,
}
@group(0) @binding(0) var linearSampler: sampler;
@group(0) @binding(1) var sceneTexture: texture_2d<f32>;
@group(0) @binding(2) var blurTexture: texture_2d<f32>;
@group(0) @binding(3) var<uniform> params: Params;

const STEPS: i32 = 40;

// Interleaved gradient noise: cheap per-pixel jitter that hides ray-march banding.
fn ign(px: vec2f) -> f32 {
  let p = px + f32(params.frameIndex % 64u) * vec2f(5.588238);
  return fract(52.9829189 * fract(dot(p, vec2f(0.06711056, 0.00583715))));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene = textureSample(sceneTexture, linearSampler, uv);
  let glow = textureSample(blurTexture, linearSampler, uv);
  let jitter = ign(uv * params.resolution);

  // Light rays: march toward the light, gathering blurred rim.
  let lightStep = (uv - params.light) * (0.85 / f32(STEPS));
  var coordinate = uv - lightStep * jitter;
  var weight = 1.0;
  var weightSum = 0.0;
  var rays = 0.0;
  for (var i = 0; i < STEPS; i++) {
    coordinate -= lightStep;
    rays += textureSampleLevel(blurTexture, linearSampler, coordinate, 0.0).b * weight;
    weightSum += weight;
    weight *= 0.955;
  }
  rays = rays / weightSum * 3.2;

  // Token rays: march toward the token; each bar crossing dims what is behind it.
  let tokenStep = (uv - params.token) * (1.0 / f32(STEPS));
  coordinate = uv - tokenStep * jitter;
  weight = 1.0;
  weightSum = 0.0;
  var occlusion = 1.0;
  var tokenRays = 0.0;
  for (var i = 0; i < STEPS; i++) {
    coordinate -= tokenStep;
    let s = textureSampleLevel(sceneTexture, linearSampler, coordinate, 0.0);
    occlusion *= 1.0 - s.r * 0.22;
    tokenRays += textureSampleLevel(blurTexture, linearSampler, coordinate, 0.0).g * occlusion * weight;
    weightSum += weight;
    weight *= 0.93;
  }
  tokenRays = tokenRays / weightSum * 1.3;

  // Brand rule: the token stays Signal; denial is carried by the label and the bounce.
  let tokenColor = params.signal;
  let toLight = (uv - params.light) * params.aspect;
  let shade = 0.7 + 0.3 / (1.0 + dot(toLight, toLight) * 6.0);

  var color = mix(params.ink, params.bone * shade, scene.r);
  let radiance =
    params.bone * (scene.b * 0.9 + rays * 0.5) * params.rimIntensity +
    tokenColor * (tokenRays + glow.g * 0.35) * params.tokenIntensity;
  color += (vec3f(1.0) - exp(-radiance * 1.4)) * (1.0 - scene.r * 0.55);
  color = mix(color, tokenColor, scene.g);
  color += (jitter - 0.5) * 0.01;
  return vec4f(clamp(color, vec3f(0.0), vec3f(1.0)), 1.0);
}
