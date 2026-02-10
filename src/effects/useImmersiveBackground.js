import { useEffect } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = `
uniform float uTime;
uniform float uMorph;
uniform float uFlow;
uniform float uCursorInfluence;
uniform vec2 uCursor;
uniform float uHeroVisibility;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vBand;

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
  float t = uTime * 0.12;

  vec3 flowAxis = normalize(vec3(0.9, 0.2, -0.32));
  float striation = sin(dot(position, flowAxis) * 8.0 + t * 2.8);
  float body = fbm(normal * 2.5 + vec3(t * 0.7, -t * 0.5, t * 0.3));
  float pressure = fbm(position * 1.6 + flowAxis * t);

  vec4 worldBase = modelMatrix * vec4(position, 1.0);
  vec2 delta = worldBase.xy - uCursor;
  float cursorField = exp(-dot(delta, delta) * 0.46) * uCursorInfluence;

  float displacement = (pressure * 0.16 + body * 0.1 + striation * 0.05) *
    (0.22 + uMorph * 0.45 + uFlow * 0.28);
  displacement += cursorField * 0.07;
  displacement *= uHeroVisibility;

  p += normal * displacement;
  p += flowAxis * striation * 0.02 * (0.2 + uFlow);

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vBand = body + pressure * 0.7 + striation * 0.28;

  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uLight;
uniform float uOpacity;
uniform float uHeroVisibility;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying float vBand;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 L = normalize(vec3(0.32, 0.74, 0.56));

  float diffuse = max(dot(N, L), 0.0);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.1);
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 36.0);

  float band = smoothstep(-0.2, 0.95, vBand);
  vec3 base = mix(uColorA, uColorB, band);
  base = mix(base, uColorC, smoothstep(0.25, 0.9, abs(vBand)) * 0.24);

  vec3 color = base * (0.42 + diffuse * (0.56 + uLight * 0.24));
  color += vec3(0.92, 0.95, 1.0) * spec * (0.08 + uLight * 0.22);
  color += vec3(0.70, 0.76, 0.83) * fresnel * 0.14;

  float alpha = clamp(uOpacity * uHeroVisibility * (0.48 + fresnel * 0.2 + band * 0.14), 0.0, 0.5);
  gl_FragColor = vec4(color, alpha);
}
`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const BLOB_CONFIG = [
  {
    position: [-6.2, 2.7, -5.3],
    offscreenPosition: [-8.8, 3.8, -6.6],
    scale: 2.25,
    colors: ['#1a374a', '#315e73', '#7f95a4']
  },
  {
    position: [6.0, -2.6, -6.0],
    offscreenPosition: [8.5, -4.1, -7.2],
    scale: 1.95,
    colors: ['#1d394c', '#345e73', '#8599a6']
  },
  {
    position: [5.2, 2.8, -6.8],
    offscreenPosition: [7.6, 4.0, -7.9],
    scale: 1.35,
    colors: ['#203d4f', '#3a6278', '#8c9ca8']
  }
];

const toColor = (hex) => new THREE.Color(hex);

export default function useImmersiveBackground() {
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
    camera.position.set(0, 0, 8.8);

    const geometry = new THREE.IcosahedronGeometry(1, 4);
    const blobs = [];

    BLOB_CONFIG.forEach((config, index) => {
      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0.28 },
        uFlow: { value: 0.2 },
        uCursorInfluence: { value: 0 },
        uCursor: { value: new THREE.Vector2(0, 0) },
        uHeroVisibility: { value: 1 },
        uColorA: { value: toColor(config.colors[0]) },
        uColorB: { value: toColor(config.colors[1]) },
        uColorC: { value: toColor(config.colors[2]) },
        uLight: { value: 0.4 },
        uOpacity: { value: 0.42 }
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...config.position);
      mesh.scale.setScalar(config.scale);
      scene.add(mesh);

      blobs.push({
        mesh,
        uniforms,
        phase: index * 1.58,
        baseScale: config.scale,
        current: {
          position: new THREE.Vector3(...config.position),
          scale: config.scale
        },
        anchor: new THREE.Vector3(...config.position),
        retreat: new THREE.Vector3(...config.offscreenPosition)
      });
    });

    let heroRatio = 1;
    let rafId = 0;
    let heroObserver;

    const target = {
      scroll: 0,
      heroVisibility: 1,
      cursorNdcX: 0,
      cursorNdcY: 0,
      cursorWorldX: 0,
      cursorWorldY: 0,
      cursorInfluence: 0,
      light: 0.42,
      flow: 0.22,
      morph: 0.3,
      opacity: 0.42
    };

    const current = { ...target };

    const onScroll = () => {
      const hero = document.getElementById('home');
      const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
      const progress = clamp(window.scrollY / Math.max(heroHeight, 1), 0, 1.4);
      target.scroll = progress;
      target.heroVisibility = clamp(1.0 - progress * 1.08, 0, 1);

      target.flow = clamp(0.22 + progress * 0.08, 0.18, 0.36);
      target.morph = clamp(0.3 + progress * 0.05, 0.26, 0.45);
      target.light = clamp(0.42 - progress * 0.05, 0.32, 0.46);
      target.opacity = clamp(0.42 - progress * 0.18, 0.0, 0.42);
    };

    const onPointerMove = (event) => {
      const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
      const ndcY = 1 - (event.clientY / window.innerHeight) * 2;
      target.cursorNdcX = clamp(ndcX, -1, 1);
      target.cursorNdcY = clamp(ndcY, -1, 1);
      target.cursorWorldX = target.cursorNdcX * 3.6;
      target.cursorWorldY = target.cursorNdcY * 2.3;
      target.cursorInfluence = target.heroVisibility > 0.02 ? 1 : 0;
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

    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          heroRatio = entry.intersectionRatio;
          target.heroVisibility = clamp(heroRatio, 0, 1);
        },
        { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] }
      );
      heroObserver.observe(heroSection);
    }

    const animate = () => {
      const smooth = prefersReducedMotion ? 0.02 : 0.07;
      const cursorSmooth = prefersReducedMotion ? 0.018 : 0.095;

      current.scroll += (target.scroll - current.scroll) * smooth;
      current.heroVisibility += (target.heroVisibility - current.heroVisibility) * smooth;
      current.cursorNdcX += (target.cursorNdcX - current.cursorNdcX) * cursorSmooth;
      current.cursorNdcY += (target.cursorNdcY - current.cursorNdcY) * cursorSmooth;
      current.cursorWorldX += (target.cursorWorldX - current.cursorWorldX) * cursorSmooth;
      current.cursorWorldY += (target.cursorWorldY - current.cursorWorldY) * cursorSmooth;
      current.cursorInfluence += (target.cursorInfluence - current.cursorInfluence) * cursorSmooth;
      current.light += (target.light - current.light) * smooth;
      current.flow += (target.flow - current.flow) * smooth;
      current.morph += (target.morph - current.morph) * smooth;
      current.opacity += (target.opacity - current.opacity) * smooth;

      target.cursorInfluence *= 0.985;

      const time = performance.now() * 0.001;

      blobs.forEach((blob, index) => {
        const heaviness = 0.06 + current.flow * 0.08;
        const driftX = Math.sin(time * (0.08 + index * 0.015) + blob.phase) * heaviness;
        const driftY = Math.cos(time * (0.07 + index * 0.012) + blob.phase * 1.2) * heaviness;
        const driftZ = Math.sin(time * (0.05 + index * 0.01) + blob.phase * 1.7) * 0.12;

        const visibility = clamp(current.heroVisibility, 0, 1);
        const retreatMix = 1 - visibility;
        const base = blob.anchor.clone().lerp(blob.retreat, retreatMix);

        const tx = base.x + driftX + current.cursorNdcX * 0.06;
        const ty = base.y + driftY + current.cursorNdcY * 0.05;
        const tz = base.z + driftZ + current.scroll * 0.25;

        blob.current.position.x += (tx - blob.current.position.x) * smooth;
        blob.current.position.y += (ty - blob.current.position.y) * smooth;
        blob.current.position.z += (tz - blob.current.position.z) * smooth;
        const settle = 1.0 + Math.sin(time * (0.11 + index * 0.016) + blob.phase) * (0.01 + current.flow * 0.016);
        const targetScale = blob.baseScale * settle * (0.88 + visibility * 0.12);
        blob.current.scale += (targetScale - blob.current.scale) * smooth;

        blob.mesh.position.copy(blob.current.position);
        blob.mesh.scale.setScalar(blob.current.scale);
        blob.mesh.rotation.y += 0.00055 + index * 0.00011;
        blob.mesh.rotation.x += 0.00028 + index * 0.00008;

        blob.uniforms.uTime.value = time;
        blob.uniforms.uMorph.value = current.morph;
        blob.uniforms.uFlow.value = current.flow;
        blob.uniforms.uCursor.value.set(current.cursorWorldX, current.cursorWorldY);
        blob.uniforms.uCursorInfluence.value = current.cursorInfluence * visibility;
        blob.uniforms.uHeroVisibility.value = visibility;
        blob.uniforms.uLight.value = current.light;
        blob.uniforms.uOpacity.value = current.opacity;
      });

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

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
      if (heroObserver) heroObserver.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);

      blobs.forEach((blob) => {
        blob.mesh.material.dispose();
      });
      geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);
}
