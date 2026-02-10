import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
uniform float uTime;
uniform float uScroll;
uniform float uMorph;
uniform float uTurbulence;
uniform float uBlobId;
uniform vec2 uCursor;
uniform float uCursorInfluence;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vFlow;
varying float vRidge;

float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = hash(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);
  return mix(nxy0, nxy1, f.z);
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.54;
  float frequency = 1.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.06;
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  vec3 p = position;
  float t = uTime * (0.12 + uBlobId * 0.03);

  // Directional flow creates injection-mould style striations.
  vec3 flowAxis = normalize(vec3(0.85, 0.2, -0.3 + uBlobId * 0.07));
  float band = sin(dot(position, flowAxis) * 8.5 + t * 3.2 + uScroll * 5.5);
  float bodyNoise = fbm(normal * 2.4 + vec3(t * 0.6, -t * 0.45, t * 0.25));
  float pressure = fbm(position * 1.5 + flowAxis * (uScroll * 2.2 + t));

  vec4 worldBase = modelMatrix * vec4(position, 1.0);
  vec2 cursorDelta = worldBase.xy - uCursor;
  float cursorField = exp(-dot(cursorDelta, cursorDelta) * 0.42) * uCursorInfluence;

  // Viscous deformation: compression/release with restrained amplitude.
  float displacement = (pressure * 0.18 + bodyNoise * 0.12 + band * 0.06) *
    (0.28 + uMorph * 0.44 + uTurbulence * 0.24);
  displacement += cursorField * 0.08;

  p += normal * displacement;
  p += flowAxis * band * 0.03 * (0.35 + uTurbulence);

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vFlow = bodyNoise + pressure * 0.7 + band * 0.3;
  vRidge = band;

  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float uLight;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vFlow;
varying float vRidge;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 L = normalize(vec3(0.34, 0.72, 0.55));

  float diffuse = max(dot(N, L), 0.0);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.0);
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 34.0);

  float flowMask = smoothstep(-0.2, 0.95, vFlow);
  float striation = abs(vRidge);
  striation = smoothstep(0.25, 0.85, striation);

  vec3 base = mix(uColorA, uColorB, flowMask);
  base = mix(base, uColorC, striation * 0.28);

  vec3 color = base * (0.4 + diffuse * (0.64 + uLight * 0.28));
  color += vec3(0.90, 0.95, 1.0) * spec * (0.08 + uLight * 0.24);
  color += vec3(0.72, 0.79, 0.86) * fresnel * 0.16;

  float alpha = clamp(uOpacity * (0.46 + fresnel * 0.22 + flowMask * 0.16), 0.1, 0.56);
  gl_FragColor = vec4(color, alpha);
}
`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const STAGES = {
  calm: {
    light: 0.4,
    turbulence: 0.18,
    morph: 0.3,
    opacity: 0.38,
    positions: [
      [-5.2, 2.9, -5.6],
      [5.4, 1.3, -6.2],
      [-4.6, -3.1, -7.0],
      [4.8, -2.7, -7.6]
    ],
    scales: [1.8, 1.45, 1.6, 1.35]
  },
  products: {
    light: 0.52,
    turbulence: 0.24,
    morph: 0.4,
    opacity: 0.42,
    positions: [
      [-4.8, 2.5, -4.9],
      [5.0, 1.0, -5.4],
      [-4.2, -2.7, -6.0],
      [4.4, -2.3, -6.6]
    ],
    scales: [1.95, 1.5, 1.7, 1.4]
  },
  manufacturing: {
    light: 0.46,
    turbulence: 0.14,
    morph: 0.24,
    opacity: 0.4,
    positions: [
      [-5.4, 2.8, -5.2],
      [5.6, 1.2, -5.9],
      [-5.0, -3.2, -6.8],
      [5.1, -2.5, -7.4]
    ],
    scales: [2.05, 1.56, 1.78, 1.42]
  },
  quality: {
    light: 0.42,
    turbulence: 0.1,
    morph: 0.2,
    opacity: 0.36,
    positions: [
      [-5.0, 2.6, -5.4],
      [5.2, 1.1, -6.0],
      [-4.7, -2.9, -6.9],
      [4.9, -2.5, -7.4]
    ],
    scales: [1.92, 1.5, 1.72, 1.38]
  }
};

const SECTION_STAGE_BY_ID = {
  home: 'calm',
  about: 'calm',
  products: 'products',
  manufacturing: 'manufacturing',
  sustainability: 'quality',
  contact: 'quality'
};

const inferStageByIndex = (index, total) => {
  if (index < total * 0.34) return 'calm';
  if (index < total * 0.5) return 'products';
  if (index < total * 0.74) return 'manufacturing';
  return 'quality';
};

const BLOB_COLORS = [
  ['#173a4d', '#2e6178', '#7f99a8'],
  ['#1a3548', '#305b72', '#8ba0ad'],
  ['#1b3d50', '#335f76', '#89a1ae'],
  ['#1f3a4d', '#325970', '#8398a6']
];

const toColor = (hex) => new THREE.Color(hex);

export default function useImmersiveBackground(activeSection) {
  const activeSectionRef = useRef(activeSection);
  activeSectionRef.current = activeSection;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const existingCanvas = document.querySelector('.immersive-webgl-canvas');
    if (existingCanvas) existingCanvas.remove();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'immersive-webgl-canvas';
    document.body.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const blobGeometry = new THREE.IcosahedronGeometry(1, 4);
    const blobs = [];

    for (let i = 0; i < 4; i += 1) {
      const [a, b, c] = BLOB_COLORS[i];
      const uniforms = {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMorph: { value: STAGES.calm.morph },
        uTurbulence: { value: STAGES.calm.turbulence },
        uBlobId: { value: i + 1 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uCursorInfluence: { value: 0 },
        uLight: { value: STAGES.calm.light },
        uOpacity: { value: STAGES.calm.opacity },
        uColorA: { value: toColor(a) },
        uColorB: { value: toColor(b) },
        uColorC: { value: toColor(c) }
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide
      });

      const mesh = new THREE.Mesh(blobGeometry, material);
      mesh.position.set(...STAGES.calm.positions[i]);
      mesh.scale.setScalar(STAGES.calm.scales[i]);
      scene.add(mesh);

      blobs.push({
        mesh,
        uniforms,
        phase: i * 1.37,
        current: {
          position: new THREE.Vector3(...STAGES.calm.positions[i]),
          scale: STAGES.calm.scales[i]
        },
        target: {
          position: new THREE.Vector3(...STAGES.calm.positions[i]),
          scale: STAGES.calm.scales[i]
        }
      });
    }

    const maxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

    const target = {
      scroll: clamp(window.scrollY / maxScroll(), 0, 1),
      scrollVelocity: 0,
      cursorNdcX: 0,
      cursorNdcY: 0,
      cursorWorldX: 0,
      cursorWorldY: 0,
      cursorInfluence: 0,
      light: STAGES.calm.light,
      turbulence: STAGES.calm.turbulence,
      morph: STAGES.calm.morph,
      opacity: STAGES.calm.opacity
    };

    const current = { ...target };
    let stage = SECTION_STAGE_BY_ID[activeSectionRef.current] || 'calm';
    let sectionObserver;
    let rafId = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const applyStage = (nextStage) => {
      const profile = STAGES[nextStage] || STAGES.calm;
      stage = nextStage;
      target.light = profile.light;
      target.turbulence = profile.turbulence;
      target.morph = profile.morph;
      target.opacity = profile.opacity;
      blobs.forEach((blob, index) => {
        blob.target.position.set(...profile.positions[index]);
        blob.target.scale = profile.scales[index];
      });
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

          const byId = SECTION_STAGE_BY_ID[bestSection.id];
          const byIndex = inferStageByIndex(sectionElements.indexOf(bestSection), sectionElements.length);
          const nextStage = byId || byIndex;
          if (nextStage !== stage) applyStage(nextStage);
        },
        { threshold: [0, 0.2, 0.4, 0.6, 0.8] }
      );
      sectionElements.forEach((el) => sectionObserver.observe(el));
    }

    const onScroll = () => {
      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaT = Math.max(now - lastScrollTime, 16);
      const velocity = clamp(deltaY / deltaT, 0, 1.8);
      target.scroll = clamp(window.scrollY / maxScroll(), 0, 1);
      target.scrollVelocity = velocity;

      const profile = STAGES[stage];
      target.turbulence = clamp(profile.turbulence + velocity * 0.12 + target.scroll * 0.05, 0.08, 0.7);
      target.morph = clamp(profile.morph + target.scroll * 0.08 + velocity * 0.05, 0.16, 0.9);
      target.light = clamp(profile.light + target.scroll * 0.08 + velocity * 0.05, 0.2, 1.0);

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    const onPointerMove = (event) => {
      const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
      const ndcY = 1 - (event.clientY / window.innerHeight) * 2;
      target.cursorNdcX = clamp(ndcX, -1, 1);
      target.cursorNdcY = clamp(ndcY, -1, 1);
      target.cursorWorldX = target.cursorNdcX * 3.4;
      target.cursorWorldY = target.cursorNdcY * 2.2;
      target.cursorInfluence = 1;
    };

    const onPointerLeave = () => {
      target.cursorNdcX = 0;
      target.cursorNdcY = 0;
      target.cursorWorldX = 0;
      target.cursorWorldY = 0;
      target.cursorInfluence = 0;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      onScroll();
    };

    const animate = () => {
      if (!sectionObserver) {
        const fallback = SECTION_STAGE_BY_ID[activeSectionRef.current] || 'calm';
        if (fallback !== stage) applyStage(fallback);
      }

      const smooth = prefersReducedMotion ? 0.02 : 0.065;
      const cursorSmooth = prefersReducedMotion ? 0.018 : 0.095;

      current.scroll += (target.scroll - current.scroll) * smooth;
      current.scrollVelocity += (target.scrollVelocity - current.scrollVelocity) * cursorSmooth;
      current.cursorNdcX += (target.cursorNdcX - current.cursorNdcX) * cursorSmooth;
      current.cursorNdcY += (target.cursorNdcY - current.cursorNdcY) * cursorSmooth;
      current.cursorWorldX += (target.cursorWorldX - current.cursorWorldX) * cursorSmooth;
      current.cursorWorldY += (target.cursorWorldY - current.cursorWorldY) * cursorSmooth;
      current.cursorInfluence += (target.cursorInfluence - current.cursorInfluence) * cursorSmooth;
      current.light += (target.light - current.light) * smooth;
      current.turbulence += (target.turbulence - current.turbulence) * smooth;
      current.morph += (target.morph - current.morph) * smooth;
      current.opacity += (target.opacity - current.opacity) * smooth;

      target.scrollVelocity *= 0.9;
      target.cursorInfluence *= 0.986;

      const time = performance.now() * 0.001;
      const depthShift = current.scroll * 0.55;

      blobs.forEach((blob, index) => {
        const driftBase = 0.14 + current.turbulence * 0.1;
        const driftX = Math.sin(time * (0.11 + index * 0.03) + blob.phase) * driftBase;
        const driftY = Math.cos(time * (0.09 + index * 0.025) + blob.phase * 1.2) * driftBase;
        const driftZ = Math.sin(time * (0.07 + index * 0.02) + blob.phase * 1.8) * 0.22;

        const compress = 1.0 + Math.sin(time * (0.17 + index * 0.04) + blob.phase) * (0.02 + current.morph * 0.035);

        const targetX = blob.target.position.x + driftX + current.cursorNdcX * (0.08 + index * 0.015);
        const targetY = blob.target.position.y + driftY + current.cursorNdcY * (0.06 + index * 0.014);
        const targetZ = blob.target.position.z + driftZ + depthShift;

        blob.current.position.x += (targetX - blob.current.position.x) * smooth;
        blob.current.position.y += (targetY - blob.current.position.y) * smooth;
        blob.current.position.z += (targetZ - blob.current.position.z) * smooth;
        blob.current.scale += ((blob.target.scale * compress) - blob.current.scale) * smooth;

        blob.mesh.position.copy(blob.current.position);
        blob.mesh.scale.setScalar(blob.current.scale);
        blob.mesh.rotation.y += 0.0009 + index * 0.00016;
        blob.mesh.rotation.x += 0.00045 + index * 0.0001;

        blob.uniforms.uTime.value = time;
        blob.uniforms.uScroll.value = current.scroll;
        blob.uniforms.uMorph.value = current.morph;
        blob.uniforms.uTurbulence.value = current.turbulence;
        blob.uniforms.uCursor.value.set(current.cursorWorldX, current.cursorWorldY);
        blob.uniforms.uCursorInfluence.value = current.cursorInfluence;
        blob.uniforms.uLight.value = current.light;
        blob.uniforms.uOpacity.value = current.opacity;
      });

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

    applyStage(stage);
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
      if (sectionObserver) sectionObserver.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);

      blobs.forEach((blob) => {
        blob.mesh.material.dispose();
      });
      blobGeometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);
}
