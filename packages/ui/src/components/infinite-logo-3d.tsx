'use client';

import * as THREE from 'three';
import { Box, useColorScheme } from '@mui/material';
import { InfiniteLogo } from './infinite-logo';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

export type InfiniteLogo3DProps = {
  className?: string;
  interactive?: boolean;
  ariaLabel?: string;
};

const LOGO_VIEWBOX = '0 0 34 34';
const LOGO_PATHS = [
  'M15.03 11.043H6.672c-.167.07-.09.01-.218.206l-4.185 7.296c-.037.205 2.854 5.09 3.2 5.67.218.363.888 1.652 1.105 1.86l8.598.001c.228-.24 2.756-4.846 3.05-5.333.26-.43.494-.898.758-1.342.554-.931.63-.926.465-1.403-.337-.97-.766-2.201-1.017-3.167l-2.524 4c-.182.288-2.368 3.79-2.447 4.037l-5.046-.007-1.283-2.228c-.163-.271-1.245-2.058-1.283-2.209-.05-.197 1.019-1.881 1.202-2.208.204-.363.42-.72.644-1.107.13-.223.462-.919.672-1.034h5.06l1.609-3.031Z',
  'M14.952 18.485c.06-.067.12-.14.186-.244.057-.088.084-.143.15-.256l4.602-7.526 5.034.011 2.57 4.425c.052.172-.427.886-.553 1.094-.22.365-.424.727-.64 1.11-.178.314-1.113 2.024-1.318 2.153l-5.06-.009-1.605 3.041 8.415-.007c.226-.257.396-.646.582-.956l1.62-2.812c.24-.428 2.12-3.597 2.14-3.737.023-.158-1.895-3.388-2.12-3.778-.372-.64-.718-1.266-1.089-1.888l-1.052-1.838-8.702.01-4.142 7.349c-.225.385-.221.278-.065.743.208.618.798 2.742 1.047 3.115Z',
] as const;

const REST_ROT_X = 0.2;
const REST_ROT_Y = -0.38;
const REST_ROT_Z = -0.04;
const TWO_PI = Math.PI * 2;

type ScenePaletteRefs = {
  scene: THREE.Scene;
  faceMat: THREE.MeshPhysicalMaterial;
  sideMat: THREE.MeshPhysicalMaterial;
  keyLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
  rimLight: THREE.DirectionalLight;
  requestRender: () => void;
};

function applyThemePalette(refs: ScenePaletteRefs, isDark: boolean) {
  if (isDark) {
    refs.scene.environmentIntensity = 0.62;

    refs.faceMat.color.set('#2ad883');
    refs.faceMat.emissive.set('#073822');
    refs.faceMat.emissiveIntensity = 0.24;

    refs.sideMat.color.set('#12603f');
    refs.sideMat.emissive.set('#042415');
    refs.sideMat.emissiveIntensity = 0.18;

    refs.keyLight.color.set('#dcffec');
    refs.keyLight.intensity = 2.6;
    refs.fillLight.color.set('#2ad883');
    refs.fillLight.intensity = 1.15;
    refs.rimLight.color.set('#a5cdde');
    refs.rimLight.intensity = 2.1;
  } else {
    refs.scene.environmentIntensity = 0.78;

    refs.faceMat.color.set('#2d8c61');
    refs.faceMat.emissive.set('#083320');
    refs.faceMat.emissiveIntensity = 0.13;

    refs.sideMat.color.set('#145238');
    refs.sideMat.emissive.set('#041f13');
    refs.sideMat.emissiveIntensity = 0.1;

    refs.keyLight.color.set('#f2fff7');
    refs.keyLight.intensity = 2.8;
    refs.fillLight.color.set('#589e7d');
    refs.fillLight.intensity = 1.25;
    refs.rimLight.color.set('#8ed5b1');
    refs.rimLight.intensity = 1.75;
  }

  refs.requestRender();
}

export function InfiniteLogo3D({
  className = '',
  interactive = true,
  ariaLabel = 'Logo 3D interaktif INFINITE',
}: InfiniteLogo3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const paletteRefs = useRef<ScenePaletteRefs | null>(null);
  const keyboardControlRef = useRef<{
    nudge: (dx: number, dy: number) => void;
    reset: () => void;
  } | null>(null);

  const [webglReady, setWebglReady] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = mode === 'system' ? systemMode : mode;
  const isDark = resolvedMode === 'dark';
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
    if (paletteRefs.current) {
      applyThemePalette(paletteRefs.current, isDark);
    }
  }, [isDark]);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) {
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      THREE.ColorManagement.enabled = true;
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const initialWidth = mountEl.clientWidth || 380;
    const initialHeight = mountEl.clientHeight || 380;
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mountEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, 7.1);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envMapTarget = pmremGenerator.fromScene(roomEnv, 0.045);
    scene.environment = envMapTarget.texture;

    const keyLight = new THREE.DirectionalLight('#dcffec', 2.6);
    keyLight.position.set(-4.8, 5.6, 6.2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#2ad883', 1.15);
    fillLight.position.set(-3.2, -4.4, 3.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#a5cdde', 2.1);
    rimLight.position.set(5.2, 3.4, -4.8);
    scene.add(rimLight);

    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}">
      <g transform="scale(1, -1)">
        <path fill="#ffffff" d="${LOGO_PATHS[0]}" />
        <path fill="#ffffff" d="${LOGO_PATHS[1]}" />
      </g>
    </svg>`;

    const parsedSvg = new SVGLoader().parse(svgMarkup);
    const extrudeOptions: THREE.ExtrudeGeometryOptions = {
      depth: 3.15,
      curveSegments: 24,
      bevelEnabled: true,
      bevelThickness: 0.24,
      bevelSize: 0.18,
      bevelOffset: 0,
      bevelSegments: 4,
    };

    const allShapes = parsedSvg.paths.flatMap((shapePath) => shapePath.toShapes());
    const logoGeometry = new THREE.ExtrudeGeometry(allShapes, extrudeOptions);

    logoGeometry.computeBoundingBox();
    const boundingBox = logoGeometry.boundingBox ?? new THREE.Box3();
    const center = boundingBox.getCenter(new THREE.Vector3());
    const sizeVec = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(sizeVec.x, sizeVec.y, 1);

    logoGeometry.translate(-center.x, -center.y, -center.z);
    logoGeometry.computeVertexNormals();

    const faceMat = new THREE.MeshPhysicalMaterial({
      metalness: 0.22,
      roughness: 0.27,
      clearcoat: 0.55,
      clearcoatRoughness: 0.2,
    });
    const sideMat = new THREE.MeshPhysicalMaterial({
      metalness: 0.38,
      roughness: 0.22,
      clearcoat: 0.7,
      clearcoatRoughness: 0.16,
    });

    const logoMesh = new THREE.Mesh(logoGeometry, [faceMat, sideMat]);

    const normalizedScale = 3.55 / maxDim;
    const floatGroup = new THREE.Group();
    const pivotGroup = new THREE.Group();
    pivotGroup.scale.setScalar(normalizedScale);
    pivotGroup.add(logoMesh);
    floatGroup.add(pivotGroup);
    scene.add(floatGroup);

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    let isVisible = true;
    let isDocumentVisible = !document.hidden;
    let rafId: number | null = null;

    let pointerParallaxX = 0;
    let pointerParallaxY = 0;

    let dragging = false;
    let activePointerId: number | null = null;
    let lastPointerX = 0;
    let lastPointerY = 0;

    let manualOffsetX = 0;
    let manualOffsetY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastManualInteractionAt = 0;

    let currentRotX = prefersReducedMotion ? REST_ROT_X : REST_ROT_X + 0.12;
    let currentRotY = prefersReducedMotion ? REST_ROT_Y : REST_ROT_Y - 0.32;
    let entranceScale = prefersReducedMotion ? 1 : 0.92;

    pivotGroup.rotation.set(currentRotX, currentRotY, REST_ROT_Z);
    pivotGroup.scale.setScalar(normalizedScale * entranceScale);

    const startTime = performance.now();
    let prevFrameTime = startTime;

    const renderSingleFrame = () => {
      renderer.render(scene, camera);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const tick = (now: number) => {
      rafId = null;

      const dt = Math.min((now - prevFrameTime) / 1000, 0.05);
      prevFrameTime = now;
      const elapsed = (now - startTime) / 1000;

      if (entranceScale < 0.999) {
        entranceScale += (1 - entranceScale) * Math.min(1, dt * 5.5);
        if (entranceScale > 0.999) {
          entranceScale = 1;
        }
        pivotGroup.scale.setScalar(normalizedScale * entranceScale);
      }

      if (!dragging) {
        if (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001) {
          const damping = Math.pow(0.06, dt);
          manualOffsetX = THREE.MathUtils.clamp(
            manualOffsetX + velocityX * dt,
            -Math.PI * 0.45,
            Math.PI * 0.45,
          );
          manualOffsetY += velocityY * dt;
          velocityX *= damping;
          velocityY *= damping;
        } else {
          velocityX = 0;
          velocityY = 0;
        }

        const idleSinceManual = (now - lastManualInteractionAt) / 1000;
        if (
          lastManualInteractionAt > 0 &&
          idleSinceManual > 1.5 &&
          (Math.abs(manualOffsetX) > 0.0005 || Math.abs(manualOffsetY % TWO_PI) > 0.0005)
        ) {
          const nearestTurnY = Math.round(manualOffsetY / TWO_PI) * TWO_PI;
          const settleFactor = Math.min(1, dt * 2.6);
          manualOffsetX += (0 - manualOffsetX) * settleFactor;
          manualOffsetY += (nearestTurnY - manualOffsetY) * settleFactor;

          if (
            Math.abs(manualOffsetX) <= 0.0005 &&
            Math.abs(manualOffsetY - nearestTurnY) <= 0.0005
          ) {
            manualOffsetX = 0;
            manualOffsetY = 0;
            lastManualInteractionAt = 0;
          }
        }
      }

      const idleFloatY = prefersReducedMotion ? 0 : Math.sin(elapsed * 1.45) * 0.095;
      const idleBreathX = prefersReducedMotion ? 0 : Math.cos(elapsed * 1.05) * 0.028;
      const idleBreathY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.85) * 0.048;

      floatGroup.position.y = idleFloatY;

      if (shadowRef.current) {
        const shadowScale = 1 - idleFloatY * 0.55;
        const shadowOpacity = 0.42 - idleFloatY * 0.6;
        shadowRef.current.style.transform = `translateX(-50%) scale(${shadowScale.toFixed(3)})`;
        shadowRef.current.style.opacity = shadowOpacity.toFixed(3);
      }

      const targetRotX =
        REST_ROT_X + idleBreathX + pointerParallaxX * (dragging ? 0.2 : 1) + manualOffsetX;
      const targetRotY =
        REST_ROT_Y + idleBreathY + pointerParallaxY * (dragging ? 0.2 : 1) + manualOffsetY;

      const rotSmooth = dragging ? Math.min(1, dt * 22) : Math.min(1, dt * 8.5);
      currentRotX += (targetRotX - currentRotX) * rotSmooth;
      currentRotY += (targetRotY - currentRotY) * rotSmooth;

      pivotGroup.rotation.set(currentRotX, currentRotY, REST_ROT_Z + pointerParallaxY * -0.05);

      renderer.render(scene, camera);

      const hasActiveMotion =
        !prefersReducedMotion ||
        dragging ||
        Math.abs(targetRotX - currentRotX) > 0.0005 ||
        Math.abs(targetRotY - currentRotY) > 0.0005 ||
        Math.abs(velocityX) > 0.0005 ||
        Math.abs(velocityY) > 0.0005 ||
        (lastManualInteractionAt > 0 &&
          (Math.abs(manualOffsetX) > 0.0005 || Math.abs(manualOffsetY % TWO_PI) > 0.0005));

      if (isVisible && isDocumentVisible && hasActiveMotion) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const ensureLoop = () => {
      if (!isVisible || !isDocumentVisible) {
        return;
      }
      if (rafId === null) {
        prevFrameTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    paletteRefs.current = {
      scene,
      faceMat,
      sideMat,
      keyLight,
      fillLight,
      rimLight,
      requestRender: () => {
        renderSingleFrame();
        ensureLoop();
      },
    };
    applyThemePalette(paletteRefs.current, isDarkRef.current);

    keyboardControlRef.current = {
      nudge: (dx: number, dy: number) => {
        if (!interactive) {
          return;
        }
        manualOffsetX = THREE.MathUtils.clamp(manualOffsetX + dx, -Math.PI * 0.45, Math.PI * 0.45);
        manualOffsetY += dy;
        lastManualInteractionAt = performance.now();
        ensureLoop();
      },
      reset: () => {
        velocityX = 0;
        velocityY = 0;
        manualOffsetX = 0;
        manualOffsetY = Math.round(manualOffsetY / TWO_PI) * TWO_PI;
        lastManualInteractionAt = 0;
        ensureLoop();
      },
    };

    const handleResize = () => {
      const width = mountEl.clientWidth;
      const height = mountEl.clientHeight;
      if (width <= 0 || height <= 0) {
        return;
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderSingleFrame();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountEl);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) {
          ensureLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(mountEl);

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) {
        ensureLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        pointerParallaxX = 0;
        pointerParallaxY = 0;
        floatGroup.position.y = 0;
        renderSingleFrame();
      } else {
        ensureLoop();
      }
    };
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (!interactive || dragging || prefersReducedMotion || event.pointerType === 'touch') {
        return;
      }
      const rect = mountEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }
      const centerX = rect.left + rect.width * 0.5;
      const centerY = rect.top + rect.height * 0.5;
      const normX = THREE.MathUtils.clamp(
        (event.clientX - centerX) / (window.innerWidth * 0.5),
        -1,
        1,
      );
      const normY = THREE.MathUtils.clamp(
        (event.clientY - centerY) / (window.innerHeight * 0.5),
        -1,
        1,
      );
      pointerParallaxY = normX * 0.2;
      pointerParallaxX = normY * 0.13;
      ensureLoop();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!interactive || (event.pointerType === 'mouse' && event.button !== 0)) {
        return;
      }
      dragging = true;
      setIsDragging(true);
      activePointerId = event.pointerId;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      lastManualInteractionAt = performance.now();

      if (event.pointerType === 'mouse') {
        mountEl.setPointerCapture(event.pointerId);
      }
      ensureLoop();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointerId) {
        return;
      }
      const dx = event.clientX - lastPointerX;
      const dy = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;

      const rotSensitivity = 0.0085;
      const deltaRotY = dx * rotSensitivity;
      const deltaRotX =
        event.pointerType === 'touch' ? dy * rotSensitivity * 0.35 : dy * rotSensitivity;

      manualOffsetY += deltaRotY;
      manualOffsetX = THREE.MathUtils.clamp(
        manualOffsetX + deltaRotX,
        -Math.PI * 0.45,
        Math.PI * 0.45,
      );

      velocityY = deltaRotY * 32;
      velocityX = deltaRotX * 32;
      lastManualInteractionAt = performance.now();
      ensureLoop();
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointerId) {
        return;
      }
      dragging = false;
      setIsDragging(false);
      activePointerId = null;
      lastManualInteractionAt = performance.now();
      if (mountEl.hasPointerCapture(event.pointerId)) {
        mountEl.releasePointerCapture(event.pointerId);
      }
      ensureLoop();
    };

    const handleDoubleClick = () => {
      if (!interactive) {
        return;
      }
      keyboardControlRef.current?.reset();
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true });
    mountEl.addEventListener('pointerdown', handlePointerDown);
    mountEl.addEventListener('pointermove', handlePointerMove);
    mountEl.addEventListener('pointerup', endDrag);
    mountEl.addEventListener('pointercancel', endDrag);
    mountEl.addEventListener('dblclick', handleDoubleClick);

    renderSingleFrame();
    setWebglReady(true);
    ensureLoop();

    return () => {
      stopLoop();
      paletteRefs.current = null;
      keyboardControlRef.current = null;

      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      window.removeEventListener('pointermove', handleWindowPointerMove);

      mountEl.removeEventListener('pointerdown', handlePointerDown);
      mountEl.removeEventListener('pointermove', handlePointerMove);
      mountEl.removeEventListener('pointerup', endDrag);
      mountEl.removeEventListener('pointercancel', endDrag);
      mountEl.removeEventListener('dblclick', handleDoubleClick);

      scene.remove(floatGroup);
      logoGeometry.dispose();
      faceMat.dispose();
      sideMat.dispose();

      scene.environment = null;
      envMapTarget.dispose();
      roomEnv.dispose();
      pmremGenerator.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !keyboardControlRef.current) {
      return;
    }

    const step = 0.22;
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        keyboardControlRef.current.nudge(0, -step);
        break;
      case 'ArrowRight':
        event.preventDefault();
        keyboardControlRef.current.nudge(0, step);
        break;
      case 'ArrowUp':
        event.preventDefault();
        keyboardControlRef.current.nudge(-step * 0.75, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        keyboardControlRef.current.nudge(step * 0.75, 0);
        break;
      case 'Home':
      case '0':
      case 'Escape':
        event.preventDefault();
        keyboardControlRef.current.reset();
        break;
      default:
        break;
    }
  };

  return (
    <Box
      role="img"
      aria-label={ariaLabel}
      tabIndex={interactive && !webglFailed ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={`relative aspect-square w-full max-w-[420px] rounded-3xl outline-none select-none focus-visible:ring-2 focus-visible:ring-(--m3-palette-primary-main) focus-visible:ring-offset-4 ${
        interactive && !webglFailed
          ? isDragging
            ? 'cursor-grabbing touch-pan-y'
            : 'cursor-grab touch-pan-y'
          : ''
      } ${className}`}
    >
      <Box
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-full bg-radial from-[#2ad883]/18 via-[#338361]/6 to-transparent blur-2xl dark:from-[#2ad883]/24 dark:via-[#226a4d]/10"
      />

      <Box
        ref={shadowRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[8%] left-1/2 h-5 w-[56%] -translate-x-1/2 rounded-full bg-[#003825]/25 blur-xl dark:bg-black/55"
      />

      <Box
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center p-10 transition-opacity duration-500 ${
          webglReady && !webglFailed ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <InfiniteLogo className="fill-infinite-light-green dark:fill-infinite-dark-green h-full w-full drop-shadow-lg" />
      </Box>

      {!webglFailed && <Box ref={mountRef} className="relative z-10 h-full w-full" />}
    </Box>
  );
}
