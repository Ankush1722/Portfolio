"use client";

import { useMemo, useRef } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeElements,
} from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { MathUtils, type Group, type Mesh } from "three";
import { useTheme } from "@/components/utils/useTheme";
import {
  useHasFinePointer,
  usePrefersReducedMotion,
} from "@/components/utils/useMediaQuery";
import { getScenePalette, type ScenePalette } from "./scene.palette";

/**
 * Four slabs, fanned and floating apart — an exploded view of a software
 * stack. The geometry is procedural (no model to download) and the whole
 * scene is four rounded boxes plus three small cubes, which keeps the draw
 * call count trivial and the first frame cheap.
 */

type LayerConfig = {
  y: number;
  rotation: number;
  /** Phase offset so the slabs drift independently rather than as one block. */
  phase: number;
  speed: number;
  scale: number;
};

const LAYERS: LayerConfig[] = [
  { y: 1.08, rotation: 0.16, phase: 0, speed: 0.62, scale: 0.86 },
  { y: 0.36, rotation: -0.09, phase: 1.4, speed: 0.54, scale: 0.93 },
  { y: -0.36, rotation: 0.07, phase: 2.7, speed: 0.58, scale: 1.0 },
  { y: -1.08, rotation: -0.14, phase: 4.1, speed: 0.5, scale: 1.07 },
];

const SLAB_WIDTH = 2.5;
const SLAB_DEPTH = 1.85;
const SLAB_HEIGHT = 0.17;

type SlabProps = {
  config: LayerConfig;
  color: string;
  palette: ScenePalette;
  animate: boolean;
};

const Slab = ({ config, color, palette, animate }: SlabProps) => {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || !animate) return;

    const t = clock.getElapsedTime();
    mesh.position.y = config.y + Math.sin(t * config.speed + config.phase) * 0.06;
    mesh.rotation.y =
      config.rotation + Math.sin(t * config.speed * 0.7 + config.phase) * 0.05;
  });

  return (
    <RoundedBox
      ref={ref}
      args={[
        SLAB_WIDTH * config.scale,
        SLAB_HEIGHT,
        SLAB_DEPTH * config.scale,
      ]}
      radius={0.045}
      smoothness={4}
      position={[0, config.y, 0]}
      rotation={[0, config.rotation, 0]}
      castShadow
      receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={palette.material.roughness}
        metalness={palette.material.metalness}
      />
    </RoundedBox>
  );
};

/** The accent sliver riding the top slab — the one spot of colour in the scene. */
const AccentEdge = ({
  palette,
  animate,
}: {
  palette: ScenePalette;
  animate: boolean;
}) => {
  const ref = useRef<Mesh>(null);
  const config = LAYERS[0];

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || !animate) return;

    const t = clock.getElapsedTime();
    mesh.position.y =
      config.y + SLAB_HEIGHT / 2 + 0.035 + Math.sin(t * config.speed) * 0.06;
    mesh.rotation.y = config.rotation + Math.sin(t * config.speed * 0.7) * 0.05;
  });

  return (
    <mesh
      ref={ref}
      position={[0, config.y + SLAB_HEIGHT / 2 + 0.035, 0]}
      rotation={[0, config.rotation, 0]}
      castShadow>
      <boxGeometry args={[SLAB_WIDTH * config.scale * 0.42, 0.045, 0.14]} />
      <meshStandardMaterial
        color={palette.accent}
        roughness={0.3}
        metalness={0.1}
        emissive={palette.accent}
        emissiveIntensity={0.35}
      />
    </mesh>
  );
};

/** The pixel motif from the original hero, promoted to real geometry. */
/* Kept inside |x|,|y| < 1.6 so they stay clear of the frustum edge at the
   closest camera distance, including the ±0.22 float travel. */
const DRIFTERS: { position: [number, number, number]; size: number; speed: number }[] =
  [
    { position: [-1.7, 1.35, -0.6], size: 0.2, speed: 0.44 },
    { position: [1.62, -1.3, 0.45], size: 0.26, speed: 0.36 },
    { position: [1.45, 1.42, -1.0], size: 0.15, speed: 0.52 },
  ];

const Drifters = ({
  palette,
  animate,
}: {
  palette: ScenePalette;
  animate: boolean;
}) => {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group || !animate) return;

    const t = clock.getElapsedTime();
    group.children.forEach((child, index) => {
      const drifter = DRIFTERS[index];
      child.position.y =
        drifter.position[1] + Math.sin(t * drifter.speed + index * 2) * 0.22;
      child.rotation.x = t * drifter.speed * 0.3;
      child.rotation.y = t * drifter.speed * 0.42;
    });
  });

  return (
    <group ref={ref}>
      {DRIFTERS.map((drifter, index) => (
        <mesh key={index} position={drifter.position} castShadow>
          <boxGeometry args={[drifter.size, drifter.size, drifter.size]} />
          <meshStandardMaterial
            color={palette.layers[index % palette.layers.length]}
            roughness={palette.material.roughness}
            metalness={palette.material.metalness}
          />
        </mesh>
      ))}
    </group>
  );
};

type StackProps = {
  palette: ScenePalette;
  animate: boolean;
  trackPointer: boolean;
};

const Stack = ({ palette, animate, trackPointer }: StackProps) => {
  const ref = useRef<Group>(null);
  const outer = useRef<Group>(null);
  const { viewport } = useThree();

  /**
   * The canvas is full-bleed behind the glass panel, so the stack has to place
   * itself relative to the frame rather than sit at the origin: pushed right
   * and scaled up on wide screens where the panel occupies the left, pulled
   * back to centre and scaled down when the panel spans the full width.
   */
  const { offsetX, offsetY, scale } = useMemo(() => {
    const halfWidth = viewport.width / 2;
    const wide = viewport.aspect >= 1.1;

    if (!wide) {
      /*
       * One-column layout: the panel spans the frame, so the stack sits
       * behind it and is seen *through* the glass. It is lifted towards the
       * top and kept small — at tablet widths the frame is wide enough that
       * a full-size stack would drive a slab straight through the headline.
       */
      return {
        offsetX: 0,
        offsetY: 0.7,
        scale: MathUtils.clamp(halfWidth / 2.3, 0.4, 0.66),
      };
    }

    /*
     * Held well short of the right edge: the stack's near slabs project about
     * 1.93 units of half-width at scale 1 (depth × perspective), so pushing it
     * further out clips them. The placement is a balance — far enough right
     * that it reads as the right-hand subject and never crowds the headline,
     * but with its leading edge still crossing behind the glass panel, which
     * is what gives the pane something real to refract.
     */
    return {
      // 0.45 lands the stack's right edge about as far from the frame as the
      // glass panel sits from the left, so the two read as a balanced pair.
      offsetX: MathUtils.clamp(halfWidth * 0.45, 0.6, 1.9),
      // Lifted a touch so the stack's optical centre lines up with the glass
      // panel's rather than sitting below it — the camera's own 0.6 rise
      // otherwise reads as the object hanging low.
      offsetY: 0.12,
      scale: MathUtils.clamp(halfWidth / 4.3, 0.55, 0.95),
    };
  }, [viewport.width, viewport.aspect]);

  // Damped pointer parallax: the group leans towards the cursor and settles
  // back when it leaves. Framerate-independent via MathUtils.damp.
  useFrame(({ pointer }, delta) => {
    const group = ref.current;
    if (!group) return;

    const targetY = trackPointer ? pointer.x * 0.34 : 0;
    const targetX = trackPointer ? -pointer.y * 0.2 : 0;

    group.rotation.y = MathUtils.damp(group.rotation.y, targetY, 3, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, targetX, 3, delta);

    // A little lateral drift as well, so the whole composition responds
    // rather than only the object's own spin.
    const drift = outer.current;
    if (drift && trackPointer) {
      drift.position.x = MathUtils.damp(
        drift.position.x,
        offsetX + pointer.x * 0.18,
        3,
        delta,
      );
      drift.position.y = MathUtils.damp(
        drift.position.y,
        offsetY + pointer.y * 0.12,
        3,
        delta,
      );
    }
  });

  return (
    <group ref={outer} position={[offsetX, offsetY, 0]} scale={scale}>
      <group ref={ref} rotation={[0.12, -0.5, 0]}>
        {LAYERS.map((config, index) => (
          <Slab
            key={index}
            config={config}
            color={palette.layers[index]}
            palette={palette}
            animate={animate}
          />
        ))}
        <AccentEdge palette={palette} animate={animate} />
        <Drifters palette={palette} animate={animate} />
      </group>
    </group>
  );
};

/**
 * Procedural studio lighting. Lightformers build the environment map in-engine,
 * so the slabs get real reflections without fetching an HDR file at runtime.
 */
const Studio = ({ palette }: { palette: ScenePalette }) => {
  const directional: ThreeElements["directionalLight"] = useMemo(
    () => ({
      position: [4, 6, 4],
      intensity: palette.keyLight.intensity,
      color: palette.keyLight.color,
      castShadow: true,
      "shadow-mapSize": [1024, 1024],
      "shadow-bias": -0.0012,
      "shadow-normalBias": 0.02,
    }),
    [palette],
  );

  return (
    <>
      <ambientLight
        color={palette.ambient.color}
        intensity={palette.ambient.intensity}
      />
      <directionalLight {...directional}>
        <orthographicCamera
          attach="shadow-camera"
          args={[-5, 5, 5, -5, 0.1, 20]}
        />
      </directionalLight>
      <directionalLight
        position={[-5, 1, -3]}
        intensity={palette.fillLight.intensity}
        color={palette.fillLight.color}
      />
      <pointLight
        position={[-2.6, -2.2, 2.4]}
        intensity={palette.rimLight.intensity}
        color={palette.rimLight.color}
        distance={9}
        decay={2}
      />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={palette.lightformer.intensity}
          color={palette.lightformer.color}
          position={[0, 4, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[8, 8, 1]}
        />
        <Lightformer
          form="rect"
          intensity={palette.lightformer.intensity * 0.5}
          color={palette.accent}
          position={[-4, -1, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[4, 4, 1]}
        />
      </Environment>
    </>
  );
};

type StackSceneProps = {
  /**
   * Element whose pointer events drive the scene. The canvas sits behind the
   * glass panel and is `pointer-events: none`, so without this the parallax
   * would freeze the moment the cursor crossed onto the panel.
   */
  eventSource?: React.RefObject<HTMLElement | null>;
};

const StackScene = ({ eventSource }: StackSceneProps) => {
  const theme = useTheme();
  const reduceMotion = usePrefersReducedMotion();
  const finePointer = useHasFinePointer();

  const palette = useMemo(() => getScenePalette(theme), [theme]);
  const animate = !reduceMotion;

  return (
    <Canvas
      // A static pose still needs a couple of frames for the environment map
      // and shadows to resolve, so demand-driven rendering is not used here;
      // the loop is simply idle when nothing animates.
      frameloop={animate || finePointer ? "always" : "demand"}
      shadows
      dpr={[1, finePointer ? 2 : 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // Close enough that the stack fills the frame instead of floating in a
      // pool of empty canvas; see DRIFTERS for the matching frustum budget.
      camera={{ position: [0, 0.6, 6.3], fov: 34 }}
      eventSource={eventSource ?? undefined}
      eventPrefix="client"
      // The canvas is decorative; the meaning is carried by the HTML legend.
      aria-hidden
      className="pointer-events-none"
      style={{ touchAction: "pan-y" }}>
      <Studio palette={palette} />
      <Stack
        palette={palette}
        animate={animate}
        trackPointer={finePointer && !reduceMotion}
      />
    </Canvas>
  );
};

export default StackScene;
