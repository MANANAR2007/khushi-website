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

  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  float frequency = 1.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.02;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 centered = (uv - 0.5) * vec2(aspect, 1.0);

  float scrollWave = sin((uv.y + uScroll * 1.35) * 8.5 + uTime * 0.32);
  float scrollShear = cos((uv.x - uScroll * 0.75) * 7.0 - uTime * 0.24);

  vec2 flow = vec2(scrollWave, scrollShear) * (0.018 + uTurbulence * 0.035);
  flow += uFlow * 0.08;
  vec2 warpedUv = uv + flow;

  float lowBand = fbm(warpedUv * 2.6 + vec2(0.0, uTime * 0.05));
  float hiBand = fbm(warpedUv * 6.4 + vec2(uTime * 0.03, -uTime * 0.04));
  float fluid = mix(lowBand, hiBand, 0.5 + uState * 0.2);
  float depth = smoothstep(-0.7, 1.0, fluid + uDepth * 0.28);

  vec3 industrialBase = vec3(0.04, 0.08, 0.13);
  vec3 metalMid = vec3(0.20, 0.29, 0.37);
  vec3 chromeSheen = vec3(0.64, 0.73, 0.82);
  vec3 refractiveBlue = vec3(0.46, 0.66, 0.95);

  vec3 color = mix(industrialBase, metalMid, depth);
  float sheen = pow(smoothstep(0.25, 0.95, fluid), 1.2);
  color = mix(color, chromeSheen, sheen * (0.45 + uLight * 0.45));

  vec2 cursorUv = vec2(uCursor.x * 0.5 + 0.5, uCursor.y * 0.5 + 0.5);
  float cursorDistance = distance(uv, cursorUv);
  float cursorField = exp(-cursorDistance * 8.5);
  color += refractiveBlue * cursorField * 0.18;

  float vignette = smoothstep(1.05, 0.15, length(centered));
  float statePulse = 0.35 + uState * 0.35;
  float alpha = (0.22 + vignette * 0.46) * statePulse;

  gl_FragColor = vec4(color, alpha);
}
`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const SECTION_PROFILES = {
  home: { state: 0.24, turbulence: 0.18, depth: 0.28, light: 0.33 },
  about: { state: 0.56, turbulence: 0.22, depth: 0.36, light: 0.48 },
  products: { state: 0.92, turbulence: 0.4, depth: 0.55, light: 0.72 },
  manufacturing: { state: 0.88, turbulence: 0.36, depth: 0.52, light: 0.68 },
  sustainability: { state: 0.58, turbulence: 0.24, depth: 0.4, light: 0.52 },
  contact: { state: 0.34, turbulence: 0.2, depth: 0.32, light: 0.4 },
  default: { state: 0.4, turbulence: 0.22, depth: 0.35, light: 0.45 }
};

export default function useImmersiveBackground(activeSection) {
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      uState: { value: 0.24 },
      uTurbulence: { value: 0.18 },
      uDepth: { value: 0.28 },
      uLight: { value: 0.33 }
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

    const sectionProfile =
      SECTION_PROFILES[activeSectionRef.current] || SECTION_PROFILES.default;

    const target = {
      scroll: clamp(window.scrollY / maxScroll(), 0, 1),
      cursorX: 0,
      cursorY: 0,
      flowX: 0,
      flowY: 0,
      state: sectionProfile.state,
      depth: sectionProfile.depth,
      light: sectionProfile.light,
      baseTurbulence: sectionProfile.turbulence,
      turbulence: sectionProfile.turbulence
    };

    const current = { ...target };
    let activeSectionLocal = activeSectionRef.current;
    let sectionObserver;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let rafId = 0;

    const applySectionProfile = (sectionKey) => {
      const profile = SECTION_PROFILES[sectionKey] || SECTION_PROFILES.default;
      target.state = profile.state;
      target.depth = profile.depth;
      target.light = profile.light;
      target.baseTurbulence = profile.turbulence;
      target.turbulence = Math.max(target.turbulence, profile.turbulence);
    };

    const inferProfileKeyByIndex = (index, total) => {
      if (index <= 0) return 'home';
      if (index === 1) return 'about';
      if (index === 2) return 'products';
      if (index === 3) return 'manufacturing';
      if (index >= total - 1) return 'contact';
      return 'sustainability';
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

          let bestSection = null;
          let bestRatio = 0;
          sectionElements.forEach((el) => {
            const ratio = sectionRatios.get(el) || 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestSection = el;
            }
          });

          if (!bestSection) return;

          const index = sectionElements.indexOf(bestSection);
          const sectionKey =
            SECTION_PROFILES[bestSection.id] ? bestSection.id : inferProfileKeyByIndex(index, sectionElements.length);

          if (sectionKey !== activeSectionLocal) {
            activeSectionLocal = sectionKey;
            applySectionProfile(sectionKey);
          }
        },
        { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
      );

      sectionElements.forEach((el) => sectionObserver.observe(el));
    }

    const onScroll = () => {
      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaT = Math.max(now - lastScrollTime, 16);
      const velocity = deltaY / deltaT;

      target.scroll = clamp(window.scrollY / maxScroll(), 0, 1);
      const velocityBoost = clamp(velocity * 0.18, 0, 0.65);
      target.turbulence = clamp(
        target.baseTurbulence + velocityBoost,
        target.baseTurbulence,
        1.1
      );
      target.depth = clamp(target.depth + target.scroll * 0.08, 0.1, 1);
      target.light = clamp(target.light + target.scroll * 0.12, 0.2, 1);

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    const onPointerMove = (event) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = 1 - (event.clientY / window.innerHeight) * 2;
      target.cursorX = clamp(nx, -1, 1);
      target.cursorY = clamp(ny, -1, 1);
      target.flowX = target.cursorX * 0.8;
      target.flowY = target.cursorY * 0.8;
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
      if (!sectionObserver && activeSectionRef.current !== activeSectionLocal) {
        activeSectionLocal = activeSectionRef.current;
        applySectionProfile(activeSectionLocal);
      }

      const smooth = prefersReducedMotion ? 0.035 : 0.075;
      const turbulenceSmooth = prefersReducedMotion ? 0.02 : 0.055;

      current.scroll += (target.scroll - current.scroll) * smooth;
      current.cursorX += (target.cursorX - current.cursorX) * smooth;
      current.cursorY += (target.cursorY - current.cursorY) * smooth;
      current.flowX += (target.flowX - current.flowX) * smooth;
      current.flowY += (target.flowY - current.flowY) * smooth;
      current.state += (target.state - current.state) * smooth;
      current.depth += (target.depth - current.depth) * smooth;
      current.light += (target.light - current.light) * smooth;
      current.turbulence += (target.turbulence - current.turbulence) * turbulenceSmooth;

      target.turbulence += (target.baseTurbulence - target.turbulence) * 0.02;

      uniforms.uTime.value = performance.now() * 0.001;
      uniforms.uScroll.value = current.scroll;
      uniforms.uCursor.value.set(current.cursorX, current.cursorY);
      uniforms.uFlow.value.set(current.flowX, current.flowY);
      uniforms.uState.value = current.state;
      uniforms.uTurbulence.value = current.turbulence;
      uniforms.uDepth.value = current.depth;
      uniforms.uLight.value = current.light;

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

    applySectionProfile(activeSectionRef.current);
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
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (sectionObserver) {
        sectionObserver.disconnect();
      }
      scene.clear();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);
}
