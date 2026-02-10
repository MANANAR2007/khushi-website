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
varying float vSignal;

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
  float amplitude = 0.55;
  float frequency = 1.0;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.03;
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  vec3 p = position;
  float t = uTime * (0.3 + uBlobId * 0.07);
  float organic = fbm(normal * 2.7 + vec3(t, t * 0.8, -t * 0.6));
  float wave = sin((p.x + p.y + p.z) * (3.2 + uBlobId) + t * 3.0 + uScroll * 5.0);

  vec4 worldBase = modelMatrix * vec4(position, 1.0);
  vec2 cursorDelta = worldBase.xy - uCursor;
  float cursorField = exp(-dot(cursorDelta, cursorDelta) * 0.35) * uCursorInfluence;

  float displacement = (organic * 0.34 + wave * 0.11) * (0.16 + uMorph * 0.9 + uTurbulence * 0.4);
  displacement += cursorField * 0.18;
  p += normal * displacement;

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vSignal = organic + cursorField * 0.6;

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
varying float vSignal;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 L = normalize(vec3(0.38, 0.74, 0.56));

  float diffuse = max(dot(N, L), 0.0);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 28.0);
  float signal = smoothstep(0.08, 0.92, vSignal);

  vec3 base = mix(uColorA, uColorB, signal);
  base = mix(base, uColorC, fresnel * 0.5);

  vec3 color = base * (0.35 + diffuse * (0.88 + uLight * 0.55));
  color += vec3(0.92, 0.96, 1.0) * spec * (0.18 + uLight * 0.38);
  color += vec3(0.4, 0.65, 0.92) * fresnel * 0.22;

  float alpha = clamp(uOpacity * (0.46 + fresnel * 0.45 + signal * 0.2), 0.12, 0.75);
  gl_FragColor = vec4(color, alpha);
}
`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const STAGES = {
  calm: {
    light: 0.42,
    turbulence: 0.22,
    morph: 0.34,
    opacity: 0.42,
    positions: [
      [-3.0, 1.9, -4.2],
      [2.9, 0.8, -4.7],
      [-1.7, -2.2, -5.4],
      [3.5, -1.6, -6.0]
    ],
    scales: [1.6, 1.2, 1.4, 1.1]
  },
  active: {
    light: 0.72,
    turbulence: 0.4,
    morph: 0.62,
    opacity: 0.5,
    positions: [
      [-2.1, 1.2, -3.2],
      [2.0, 0.2, -3.6],
      [-0.8, -1.4, -4.1],
      [2.5, -1.0, -4.6]
    ],
    scales: [2.0, 1.45, 1.7, 1.25]
  },
  stabilized: {
    light: 0.54,
    turbulence: 0.28,
    morph: 0.44,
    opacity: 0.45,
    positions: [
      [-2.6, 1.5, -3.8],
      [2.7, 0.5, -4.3],
      [-1.2, -1.8, -4.9],
      [2.9, -1.3, -5.5]
    ],
    scales: [1.7, 1.32, 1.5, 1.15]
  }
};

const SECTION_STAGE_BY_ID = {
  home: 'calm',
  about: 'calm',
  products: 'active',
  manufacturing: 'active',
  sustainability: 'stabilized',
  contact: 'stabilized'
};

const inferStageByIndex = (index, total) => {
  if (index < total * 0.34) return 'calm';
  if (index < total * 0.68) return 'active';
  return 'stabilized';
};

const BLOB_COLORS = [
  ['#1e4f73', '#56a1cd', '#c0d8ea'],
  ['#174764', '#5a95ba', '#b6cde3'],
  ['#21566f', '#4f8ca3', '#b8d0db'],
  ['#24445f', '#537eab', '#b7c8da']
];

const toColor = (hex) => new THREE.Color(hex);

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
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'immersive-webgl-canvas';
    document.body.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.8);

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
        phase: i * 1.41,
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

    const maxScroll = () =>
      Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

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
        blob.target.position.set(
          profile.positions[index][0],
          profile.positions[index][1],
          profile.positions[index][2]
        );
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
          const byIndex = inferStageByIndex(
            sectionElements.indexOf(bestSection),
            sectionElements.length
          );
          const nextStage = byId || byIndex;
          if (nextStage !== stage) {
            applyStage(nextStage);
          }
        },
        { threshold: [0, 0.2, 0.4, 0.6, 0.8] }
      );

      sectionElements.forEach((el) => sectionObserver.observe(el));
    }

    const onScroll = () => {
      const now = performance.now();
      const deltaY = Math.abs(window.scrollY - lastScrollY);
      const deltaT = Math.max(now - lastScrollTime, 16);
      const velocity = clamp(deltaY / deltaT, 0, 2.2);

      target.scroll = clamp(window.scrollY / maxScroll(), 0, 1);
      target.scrollVelocity = velocity;

      const profile = STAGES[stage];
      target.turbulence = clamp(profile.turbulence + velocity * 0.2 + target.scroll * 0.08, 0.15, 1.1);
      target.morph = clamp(profile.morph + target.scroll * 0.12 + velocity * 0.09, 0.2, 1.2);
      target.light = clamp(profile.light + target.scroll * 0.14 + velocity * 0.1, 0.2, 1.3);

      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };

    const onPointerMove = (event) => {
      const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
      const ndcY = 1 - (event.clientY / window.innerHeight) * 2;
      target.cursorNdcX = clamp(ndcX, -1, 1);
      target.cursorNdcY = clamp(ndcY, -1, 1);
      target.cursorWorldX = target.cursorNdcX * 3.2;
      target.cursorWorldY = target.cursorNdcY * 2.0;
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
        const fallbackStage = SECTION_STAGE_BY_ID[activeSectionRef.current] || 'calm';
        if (fallbackStage !== stage) {
          applyStage(fallbackStage);
        }
      }

      const smooth = prefersReducedMotion ? 0.025 : 0.08;
      const cursorSmooth = prefersReducedMotion ? 0.02 : 0.12;

      current.scroll += (target.scroll - current.scroll) * smooth;
      current.scrollVelocity += (target.scrollVelocity - current.scrollVelocity) * cursorSmooth;
      current.cursorNdcX += (target.cursorNdcX - current.cursorNdcX) * cursorSmooth;
      current.cursorNdcY += (target.cursorNdcY - current.cursorNdcY) * cursorSmooth;
      current.cursorWorldX += (target.cursorWorldX - current.cursorWorldX) * cursorSmooth;
      current.cursorWorldY += (target.cursorWorldY - current.cursorWorldY) * cursorSmooth;
      current.cursorInfluence +=
        (target.cursorInfluence - current.cursorInfluence) * cursorSmooth;
      current.light += (target.light - current.light) * smooth;
      current.turbulence += (target.turbulence - current.turbulence) * smooth;
      current.morph += (target.morph - current.morph) * smooth;
      current.opacity += (target.opacity - current.opacity) * smooth;

      target.scrollVelocity *= 0.88;
      target.cursorInfluence *= 0.985;

      const time = performance.now() * 0.001;
      const scrollDepthShift = current.scroll * 0.8;

      blobs.forEach((blob, index) => {
        const driftAmp = 0.26 + current.turbulence * 0.2;
        const driftX = Math.sin(time * (0.28 + index * 0.08) + blob.phase) * driftAmp;
        const driftY = Math.cos(time * (0.24 + index * 0.05) + blob.phase * 1.3) * driftAmp;
        const driftZ = Math.sin(time * (0.21 + index * 0.04) + blob.phase * 1.8) * 0.35;

        const targetX = blob.target.position.x + driftX + current.cursorNdcX * (0.2 + index * 0.03);
        const targetY = blob.target.position.y + driftY + current.cursorNdcY * (0.15 + index * 0.03);
        const targetZ = blob.target.position.z + driftZ + scrollDepthShift;

        blob.current.position.x += (targetX - blob.current.position.x) * smooth;
        blob.current.position.y += (targetY - blob.current.position.y) * smooth;
        blob.current.position.z += (targetZ - blob.current.position.z) * smooth;
        blob.current.scale += (blob.target.scale - blob.current.scale) * smooth;

        blob.mesh.position.copy(blob.current.position);
        blob.mesh.scale.setScalar(blob.current.scale);
        blob.mesh.rotation.y += 0.0018 + index * 0.00025;
        blob.mesh.rotation.x += 0.0009 + index * 0.0002;

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
      if (sectionObserver) {
        sectionObserver.disconnect();
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

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
