import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uCursor;
uniform vec2 uFlow;
uniform float uTime;
uniform float uScroll;
uniform float uScrollVelocity;
uniform float uState;
uniform float uTurbulence;
uniform float uDepth;
uniform float uLight;

varying vec2 vUv;

float hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p.x + p.y) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  float f = 1.0;

  for (int i = 0; i < 6; i++) {
    v += a * noise(p * f);
    f *= 2.03;
    a *= 0.54;
  }

  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 cursorUv = vec2(uCursor.x * 0.5 + 0.5, uCursor.y * 0.5 + 0.5);
  vec2 cursorDelta = uv - cursorUv;
  float cursorDistance = length(cursorDelta);
  float cursorField = exp(-cursorDistance * 7.5);

  float swayA = sin((uv.y + uScroll * 1.8) * 13.0 + uTime * 1.2);
  float swayB = cos((uv.x - uScroll * 1.4) * 11.0 - uTime * 0.95);
  vec2 baseFlow = vec2(swayA, swayB) * (0.028 + uTurbulence * 0.075);

  float sweepA = sin((uv.x * 22.0) + uScroll * 40.0 + uTime * 0.42);
  float sweepB = cos((uv.y * 20.0) - uScroll * 36.0 - uTime * 0.36);
  vec2 scrollFlow = vec2(sweepA, sweepB) * (0.02 + uScrollVelocity * 0.09);

  vec2 cursorDir = normalize(cursorDelta + vec2(0.0001));
  vec2 cursorFlow = -cursorDir * cursorField * (0.15 + uState * 0.08);

  vec2 warped = uv + baseFlow + scrollFlow + cursorFlow + uFlow * 0.12;

  float n1 = fbm(warped * 3.4 + vec2(uTime * 0.2, -uTime * 0.17));
  float n2 = fbm(warped * 8.2 + vec2(-uTime * 0.14, uTime * 0.22));
  float fluid = mix(n1, n2, 0.55 + uState * 0.25);
  float ridge = abs(fract(fluid * 2.6 + uScroll * 0.8) - 0.5);
  float depth = smoothstep(-0.8, 1.0, fluid + uDepth * 0.38 + cursorField * 0.15);

  vec3 darkBase = vec3(0.01, 0.05, 0.12);
  vec3 blueCore = vec3(0.04, 0.34, 0.78);
  vec3 cyanGlow = vec3(0.10, 0.85, 1.0);
  vec3 orangeHit = vec3(1.0, 0.54, 0.16);
  vec3 chrome = vec3(0.92, 0.96, 1.0);

  vec3 color = mix(darkBase, blueCore, depth);
  color = mix(color, cyanGlow, smoothstep(0.2, 0.95, fluid + uLight * 0.25));
  color = mix(color, orangeHit, smoothstep(0.55, 1.0, fluid + uScroll * 0.38 + uScrollVelocity * 0.45));

  float spec = pow(1.0 - ridge * 2.0, 7.0) * (0.35 + uLight * 0.9);
  color += chrome * spec;
  color += vec3(0.32, 0.52, 1.0) * cursorField * (0.5 + uState * 0.4);

  // Brighten and increase contrast for intentionally visible output.
  color = pow(max(color, vec3(0.0)), vec3(0.78));
  color *= 1.14 + uLight * 0.36;

  float alpha = clamp(0.56 + depth * 0.32 + cursorField * 0.22, 0.42, 0.96);
  gl_FragColor = vec4(color, alpha);
}
`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const STAGE_PROFILES = {
  calm: { state: 0.3, turbulence: 0.26, depth: 0.34, light: 0.42 },
  active: { state: 0.9, turbulence: 0.72, depth: 0.68, light: 0.88 },
  stabilized: { state: 0.56, turbulence: 0.4, depth: 0.5, light: 0.62 }
};

const inferStageByIndex = (index, total) => {
  if (index < total / 3) return 'calm';
  if (index < (total * 2) / 3) return 'active';
  return 'stabilized';
};

export default function useImmersiveBackground(activeSection) {
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  useEffect(() => {
    const existingCanvas = document.querySelector('.immersive-webgl-canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.domElement.className = 'immersive-webgl-canvas';
    document.body.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uCursor: { value: new THREE.Vector2(0, 0) },
      uFlow: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uScrollVelocity: { value: 0 },
      uState: { value: STAGE_PROFILES.calm.state },
      uTurbulence: { value: STAGE_PROFILES.calm.turbulence },
      uDepth: { value: STAGE_PROFILES.calm.depth },
      uLight: { value: STAGE_PROFILES.calm.light }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    scene.add(new THREE.Mesh(geometry, material));

    const maxScroll = () =>
      Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    const current = {
      scroll: 0,
      scrollVelocity: 0,
      cursorX: 0,
      cursorY: 0,
      flowX: 0,
      flowY: 0,
      state: STAGE_PROFILES.calm.state,
      turbulence: STAGE_PROFILES.calm.turbulence,
      depth: STAGE_PROFILES.calm.depth,
      light: STAGE_PROFILES.calm.light
    };

    const target = { ...current };
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let rafId = 0;
    let sectionObserver;
    let stageKey = 'calm';

    const applyStage = (nextStage) => {
      stageKey = nextStage;
      const profile = STAGE_PROFILES[nextStage] || STAGE_PROFILES.calm;
      target.state = profile.state;
      target.turbulence = profile.turbulence;
      target.depth = profile.depth;
      target.light = profile.light;
    };

    const sectionElements = Array.from(document.querySelectorAll('main section'));
    const sectionRatios = new Map();
    sectionElements.forEach((el) => sectionRatios.set(el, 0));

    if (sectionElements.length) {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            sectionRatios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
          });

          let bestIndex = 0;
          let bestRatio = 0;
          sectionElements.forEach((el, index) => {
            const ratio = sectionRatios.get(el) || 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestIndex = index;
            }
          });

          const inferred = inferStageByIndex(bestIndex, sectionElements.length || 1);
          if (inferred !== stageKey) {
            applyStage(inferred);
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      sectionElements.forEach((el) => sectionObserver.observe(el));
    }

    const onScroll = () => {
      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaT = Math.max(now - lastScrollTime, 16);
      const velocity = clamp(deltaY / deltaT, 0, 2.5);

      target.scroll = clamp(window.scrollY / maxScroll(), 0, 1);
      target.scrollVelocity = velocity;
      // Scroll drives dramatic turbulence and lighting shifts.
      target.turbulence = clamp(target.turbulence + velocity * 0.15, 0.2, 1.45);
      target.light = clamp(target.light + target.scroll * 0.25 + velocity * 0.08, 0.35, 1.45);
      target.depth = clamp(target.depth + target.scroll * 0.18, 0.24, 1.25);

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    const onPointerMove = (event) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = 1 - (event.clientY / window.innerHeight) * 2;
      target.cursorX = clamp(nx, -1, 1);
      target.cursorY = clamp(ny, -1, 1);
      target.flowX = target.cursorX;
      target.flowY = target.cursorY;
    };

    const onPointerLeave = () => {
      target.cursorX = 0;
      target.cursorY = 0;
      target.flowX = 0;
      target.flowY = 0;
    };

    const onResize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      onScroll();
    };

    const animate = () => {
      // Low smoothing so state changes are obvious immediately.
      const smooth = 0.26;
      const velocitySmooth = 0.34;

      current.scroll += (target.scroll - current.scroll) * smooth;
      current.cursorX += (target.cursorX - current.cursorX) * smooth;
      current.cursorY += (target.cursorY - current.cursorY) * smooth;
      current.flowX += (target.flowX - current.flowX) * smooth;
      current.flowY += (target.flowY - current.flowY) * smooth;
      current.state += (target.state - current.state) * smooth;
      current.turbulence += (target.turbulence - current.turbulence) * smooth;
      current.depth += (target.depth - current.depth) * smooth;
      current.light += (target.light - current.light) * smooth;
      current.scrollVelocity +=
        (target.scrollVelocity - current.scrollVelocity) * velocitySmooth;

      target.turbulence += (STAGE_PROFILES[stageKey].turbulence - target.turbulence) * 0.1;
      target.depth += (STAGE_PROFILES[stageKey].depth - target.depth) * 0.08;
      target.light += (STAGE_PROFILES[stageKey].light - target.light) * 0.08;
      target.scrollVelocity *= 0.9;

      uniforms.uTime.value = performance.now() * 0.001;
      uniforms.uScroll.value = current.scroll;
      uniforms.uScrollVelocity.value = current.scrollVelocity;
      uniforms.uCursor.value.set(current.cursorX, current.cursorY);
      uniforms.uFlow.value.set(current.flowX, current.flowY);
      uniforms.uState.value = current.state;
      uniforms.uTurbulence.value = current.turbulence;
      uniforms.uDepth.value = current.depth;
      uniforms.uLight.value = current.light;

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

    applyStage('calm');
    onScroll();
    onResize();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      if (sectionObserver) {
        sectionObserver.disconnect();
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);
}
