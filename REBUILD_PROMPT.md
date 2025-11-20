# Sacred Voxel Recursion - AI Agent Rebuild Prompt

## Project Overview

You are tasked with recreating **Sacred Voxel Recursion**, a 16-bit style generative art engine that renders real-time 3D sacred geometry patterns in the browser. This is an experimental, proof-of-concept project emphasizing:

- Modular architecture with reusable geometric components
- Smooth scene transitions with visual "imprints" (layering effects)
- Centralized time management system ("float.dispatch" concept)
- Retro aesthetic with limited color palette and pixelated rendering
- Performance-optimized real-time rendering

## Technical Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **3D Rendering**: Three.js, React Three Fiber, @react-three/drei
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Core Concepts to Implement

### 1. Float.Dispatch System
A centralized animation timing system that:
- Manages global time state using React Context
- Dispatches time updates from a single `useFrame` hook in the Canvas
- Provides time to all components via `useAnimation()` custom hook
- Maintains frame counter (15fps for retro UI updates)
- Handles scene transition timing (10s per scene, 2.5s transitions)

**Key Features**:
- Single source of truth for animation time
- Deterministic, synchronized animations across all components
- Scene transition state management (currentScene, previousScene, transitioning, transitionProgress)
- Manual scene change capability

### 2. Imprints Concept
Visual layering and transition effects:
- Fading transitions where previous scene "ghosts" remain visible
- Opacity-based crossfades between scenes
- Particles following parametric curves (torus knots, spirals)
- Recursive patterns that build complexity over time

**Implementation**:
- Calculate scene opacity based on transition state
- Apply opacity to all materials in scene graph
- Use easeInOutCubic for smooth transitions
- Track previous scene to render both during transition

## Architecture Requirements

### File Structure
\`\`\`
app/
  page.tsx                              # Server component, imports client wrapper
  layout.tsx                            # Root layout with metadata
  globals.css                           # Color tokens, retro styling
  not-found.tsx                         # 404 page

components/
  animation-context.tsx                 # Central state (Float.Dispatch)
  sacred-geometry-animation.tsx         # Canvas and 3D environment setup
  sacred-geometry-client.tsx            # Client wrapper with dynamic imports
  scene-renderer.tsx                    # Scene orchestration
  scene-indicator.tsx                   # UI dots for scene navigation
  ui-overlay.tsx                        # HUD (frame counter, scene name)
  error-boundary.tsx                    # Error handling
  
  scenes/
    index.tsx                           # Scene exports
    scene-one.tsx                       # Sacred Geometry Basics
    scene-two.tsx                       # Vector Field Minimalism
    scene-three.tsx                     # Oscillating Gradients
    scene-four.tsx                      # Voxel Sigil Interface
    scene-five.tsx                      # Recursive Collapse
    
    scene-components/
      circle-geometry.tsx               # Basic circle
      flower-of-life.tsx                # 7 overlapping circles
      sri-yantra.tsx                    # Interlocking triangles
      merkaba-stars.tsx                 # Counter-rotating stars
      star.tsx                          # N-pointed star
      pixelated-particles.tsx           # Torus knot particle system
      simple-vector-field.tsx           # Arrow grid
      simple-gradient.tsx               # Layered gradient planes
      simple-voxel-grid.tsx             # 3D cube grid
      simple-recursive-pattern.tsx      # Spiral point cloud
\`\`\`

### Component Patterns

#### Animation Context (`animation-context.tsx`)
Create a React Context that manages:

**State**:
- `time`: number (elapsed seconds)
- `frame`: number (0-59, 15fps counter)
- `currentScene`: number (0-4)
- `previousScene`: number | null
- `transitioning`: boolean
- `transitionProgress`: number (0-1)

**Constants**:
\`\`\`typescript
export const COLORS = {
  cyan: ["#00ffff", "#00ccff", "#0099ff", "#0066ff", "#0033ff"],
  magenta: ["#ff00ff", "#ff0099", "#ff0066", "#ff0033", "#cc0066"],
  gold: ["#ffcc00", "#ffaa00", "#ff9900", "#ff6600", "#cc9900"],
  white: ["#ffffff", "#eeeeee", "#cccccc", "#aaaaaa", "#888888"],
  black: "#000000",
  grid: "#001122",
}

export const SCENES = [
  { id: 0, name: "SACRED GEOMETRY BASICS" },
  { id: 1, name: "VECTOR FIELD MINIMALISM" },
  { id: 2, name: "OSCILLATING GRADIENTS" },
  { id: 3, name: "VOXEL SIGIL INTERFACE" },
  { id: 4, name: "RECURSIVE COLLAPSE" },
]

export const SCENE_DURATION = 10 // seconds
export const TRANSITION_DURATION = 2.5 // seconds
\`\`\`

**Timers** (all with browser check):
1. Frame counter: updates every 1000/15 ms
2. Scene transition: triggers every SCENE_DURATION * 1000 ms
3. Transition animation: updates every 25ms with 0.025 increments

**Functions**:
- `manuallyChangeScene(sceneId: number)`: Trigger scene change
- `hexToRgb(hex: string)`: Convert hex to {r, g, b}
- `easeInOutCubic(x: number)`: Cubic easing function

**Hook**:
\`\`\`typescript
export function useAnimation() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider")
  }
  return context
}
\`\`\`

**Critical**: All timers must check `isBrowser` state before running to prevent SSR errors.

#### Canvas Setup (`sacred-geometry-animation.tsx`)

\`\`\`typescript
"use client"
import { useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useAnimation } from "./animation-context"
import SceneRenderer from "./scene-renderer"

export default function SacredGeometryAnimation() {
  const [pixelRatio, setPixelRatio] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPixelRatio(Math.min(window.devicePixelRatio, 2))
      setMounted(true)
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          pixelRatio: pixelRatio,
        }}
        performance={{ min: 0.5 }}
        shadows={false}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
        <AnimationLoop />
        <SceneRenderer />
      </Canvas>
    </div>
  )
}

function AnimationLoop() {
  const { setTime } = useAnimation()
  useFrame((state) => {
    setTime(state.clock.getElapsedTime())
  })
  return null
}
\`\`\`

**Critical**: 
- Shadows must be disabled (`shadows={false}`)
- Must check for window before accessing browser APIs
- Only render after component mounts

#### Scene Renderer (`scene-renderer.tsx`)

Responsibilities:
1. Determine which scenes to render (active + transitioning)
2. Calculate scale/opacity for each scene
3. Force material updates when transitioning state changes
4. Conditionally render only necessary scenes

**Helper Functions**:
\`\`\`typescript
const getSceneScale = (sceneId) => {
  if (transitioning) {
    if (previousScene === sceneId) return 1 - transitionProgress
    if (currentScene === sceneId) return transitionProgress
  }
  return 1
}

const getSceneOpacity = (sceneId) => {
  if (transitioning) {
    if (previousScene === sceneId) return 1 - transitionProgress
    if (currentScene === sceneId) return transitionProgress
  }
  return 1
}
\`\`\`

**Render Logic**:
\`\`\`typescript
const renderScene0 = currentScene === 0 || (transitioning && previousScene === 0)

// In JSX:
{renderScene0 && (
  <SceneOne scale={getSceneScale(0)} opacity={getSceneOpacity(0)} visible={true} />
)}
\`\`\`

**Material Update useEffect**:
\`\`\`typescript
useEffect(() => {
  if (transitioning !== prevTransitionRef.current) {
    scene.traverse((object) => {
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => {
            if (mat.opacity !== undefined) {
              mat.transparent = true
              mat.needsUpdate = true
            }
          })
        } else if (object.material.opacity !== undefined) {
          object.material.transparent = true
          object.material.needsUpdate = true
        }
      }
    })
    prevTransitionRef.current = transitioning
  }
}, [transitioning, scene])
\`\`\`

**Critical**: Do NOT attempt to modify read-only properties like `customDepthMaterial`, `castShadow`, or `receiveShadow`.

#### Scene Template

Every scene should follow this pattern:

\`\`\`typescript
"use client"
import { memo, useRef, useEffect } from "react"
import { Text } from "@react-three/drei"
import { useAnimation, COLORS } from "../animation-context"
import { /* child components */ } from "./scene-components/"

const SceneX = ({ scale = 1, opacity = 1, visible = true }) => {
  const { time } = useAnimation()
  const groupRef = useRef()

  // Force material updates when opacity changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((object) => {
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              if (mat.opacity !== undefined) {
                mat.transparent = true
                mat.opacity = opacity
                mat.needsUpdate = true
              }
            })
          } else if (object.material.opacity !== undefined) {
            object.material.transparent = true
            object.material.opacity = opacity
            object.material.needsUpdate = true
          }
        }
      })
    }
  }, [opacity])

  return (
    <group 
      ref={groupRef} 
      scale={typeof scale === "number" ? [scale, scale, scale] : scale} 
      visible={visible}
    >
      {/* Child geometric components */}
      
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color={COLORS.white[0]}
        anchorX="center"
        anchorY="middle"
        backgroundColor={COLORS.black}
        backgroundOpacity={0.5 * opacity}
        padding={0.1}
        opacity={opacity}
      >
        SCENE NAME
      </Text>
    </group>
  )
}

export default memo(SceneX)
\`\`\`

#### Geometric Primitive Template

All geometric components should follow:

\`\`\`typescript
"use client"
import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"

export function GeometricComponent({ 
  position = [0, 0, 0], 
  time, 
  opacity = 1,
  ...otherProps 
}) {
  const meshRef = useRef()

  // Expensive calculations in useMemo
  const geometryData = useMemo(() => {
    const points = []
    const colors = []
    
    // Generate geometry data
    for (let i = 0; i < count; i++) {
      // Calculate positions
      points.push(x, y, z)
      
      // Calculate colors
      colors.push(r / 255, g / 255, b / 255)
    }
    
    return { points, colors }
  }, [count, /* other dependencies */])

  // Per-frame animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.2
      
      // Update buffer attributes if needed
      const positions = meshRef.current.geometry.attributes.position.array
      // ... modify positions
      meshRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={geometryData.points.length / 3}
          array={new Float32Array(geometryData.points)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={geometryData.colors.length / 3}
          array={new Float32Array(geometryData.colors)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={opacity} />
    </mesh>
  )
}
\`\`\`

**Key Patterns**:
- Use `useRef()` for mesh references
- Use `useMemo()` for expensive calculations
- Use `useFrame()` for per-frame updates
- Use `Float32Array` for buffer attributes
- Accept `time`, `position`, `opacity` as props
- Mark buffer attributes with `needsUpdate = true` after modifications

## Scene Descriptions

### Scene 1: Sacred Geometry Basics
**Components**:
- Flower of Life: 7 overlapping circles in radial pattern
- Sri Yantra: 5 upward triangles (magenta), 4 downward triangles (gold), center eye (white/black circles)
- Merkaba Stars: Two 6-pointed stars counter-rotating
- Pixelated Particles: 200 points following torus knot curve

**Animation**:
- Flower: Rotate, pulse scale with sin wave
- Sri Yantra: Oscillate rotation, translate z-axis
- Merkaba: Rotate on y and z axes, pulse scale
- Particles: Rotate group, update positions along torus knot with time offset

### Scene 2: Vector Field Minimalism
**Components**:
- Arrow grid: 5x5 sparse grid (70% sparsity)
- Each arrow: Line (box geometry) + cone head
- Dynamic rotation based on position and time

**Animation**:
- Group rotation
- Individual arrow rotation with sin wave based on index

### Scene 3: Oscillating Gradients
**Components**:
- 5 layered planes with decreasing size
- Each plane uses different cyan shade
- Transparency: 0.3 opacity

**Animation**:
- Rotate on z-axis

### Scene 4: Voxel Sigil Interface
**Components**:
- 4x4 grid of cubes (checkerboard pattern)
- Random heights (0.1-0.3)
- Random cyan shades

**Animation**:
- Group y-position oscillates with sin wave
- Individual cube y-position oscillates with offset

### Scene 5: Recursive Collapse
**Components**:
- Spiral point cloud (100 points)
- Points follow logarithmic spiral
- Alternating cyan/magenta colors

**Animation**:
- Rotate on z-axis

## Styling Requirements

### Global CSS (`app/globals.css`)
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cyan-100: #e0ffff;
  --cyan-200: #00ffff;
  --cyan-300: #00ccff;
  --cyan-400: #0099ff;
  --cyan-500: #0066ff;

  --magenta-100: #ffe0ff;
  --magenta-200: #ff00ff;
  --magenta-300: #ff0099;
  --magenta-400: #ff0066;
  --magenta-500: #cc0066;

  --gold-100: #ffffd0;
  --gold-200: #ffcc00;
  --gold-300: #ffaa00;
  --gold-400: #ff9900;
  --gold-500: #cc9900;
}

body {
  background-color: #000000;
  color: #ffffff;
  font-family: monospace;
  overflow: hidden;
}

canvas {
  image-rendering: pixelated;
}
\`\`\`

### Tailwind Config
Extend theme with custom colors matching CSS variables.

### UI Overlay Styling
\`\`\`typescript
<div className="absolute inset-0 pointer-events-none z-10 p-4 font-mono text-xs text-cyan-400 flex flex-col justify-between">
  {/* Top bar */}
  <div className="flex justify-between">
    <div className="border border-cyan-500 bg-black/50 p-2">
      SACRED GEOMETRY ENGINE v2.0
    </div>
    <div className="border border-magenta-500 bg-black/50 p-2">
      FRAME: {frame.toString().padStart(2, "0")}/60
    </div>
  </div>

  {/* Center */}
  <div className="absolute bottom-16 left-0 right-0 flex justify-center">
    <div className="border border-gold-500 bg-black/50 p-2">
      SCENE: {sceneNames[currentScene]}
      {transitioning && ` (${Math.round(transitionProgress * 100)}%)`}
    </div>
  </div>

  {/* Bottom bar */}
  <div className="flex justify-between">
    <div className="border border-cyan-500 bg-black/50 p-2">SYSTEM: ACTIVE</div>
    <div className="border border-gold-500 bg-black/50 p-2">DEBUGGING MODE</div>
  </div>
</div>
\`\`\`

## Configuration Requirements

### next.config.js
\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
\`\`\`

### package.json
\`\`\`json
{
  "name": "sacred-voxel-recursion",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@react-three/drei": "^9.92.7",
    "@react-three/fiber": "^8.15.12",
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "three": "^0.160.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/three": "^0.160.0",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
\`\`\`

## Critical Implementation Notes

### SSR Prevention
1. All Three.js components must be client components (`"use client"`)
2. Use dynamic imports with `ssr: false` for Canvas wrapper
3. Check for window before accessing browser APIs
4. Use mounted state to prevent hydration mismatches

### Shadow Errors
- NEVER enable shadows on Canvas (`shadows={false}`)
- NEVER set `castShadow` or `receiveShadow` on lights
- NEVER attempt to modify `customDepthMaterial` property

### Performance
- Use `React.memo()` on scene components
- Use `useMemo()` for expensive geometry calculations
- Only render active and transitioning scenes
- Limit particle counts to 500 max
- Use Float32Array for buffer attributes
- Set `needsUpdate = true` on modified buffer attributes

### Material Updates
- Force material transparency when using opacity
- Set `material.needsUpdate = true` when changing properties
- Traverse scene graph when opacity changes
- Handle both single materials and material arrays

## Testing Checklist

After implementation, verify:

- [ ] Canvas renders without console errors
- [ ] Scenes transition every 10 seconds
- [ ] Transitions are smooth (2.5 seconds)
- [ ] UI overlay displays and updates
- [ ] Frame counter increments at 15fps
- [ ] Scene indicator dots update correctly
- [ ] OrbitControls work (drag to rotate)
- [ ] All 5 scenes render correctly
- [ ] No "window is not defined" errors
- [ ] No Three.js shadow errors
- [ ] Production build succeeds (`npm run build`)
- [ ] Deployed version works on Vercel
- [ ] Error boundary catches and displays errors
- [ ] Mobile-responsive (touch gestures work)

## Deployment

1. Push to GitHub repository
2. Connect to Vercel
3. Ensure Node.js 18+ is selected
4. Deploy with default settings
5. Verify production build works without errors

## Extensions (Optional)

If time permits, consider adding:

1. **Keyboard Navigation**: Arrow keys to change scenes
2. **Click Interaction**: Spawn patterns at cursor position
3. **Audio Reactivity**: Sync to music (Web Audio API)
4. **Export**: Screenshot or GIF recording
5. **Parameter Controls**: UI sliders for animation speed, colors
6. **Additional Scenes**: Create more geometric patterns
7. **Mobile Optimization**: Reduce particles on mobile devices

## Success Criteria

The project is complete when:

1. All 5 scenes render correctly
2. Smooth transitions between scenes (10s duration, 2.5s transition)
3. UI overlay displays frame count and scene names
4. Retro 16-bit aesthetic is maintained
5. No console errors in development or production
6. Deploys successfully to Vercel
7. Code follows documented patterns and architecture
8. Performance maintains 30+ FPS on modern browsers

## References

- **Float.Dispatch**: Centralized time management via React Context
- **Imprints**: Visual layering through opacity-based transitions
- **Three.js Docs**: https://threejs.org/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Next.js App Router**: https://nextjs.org/docs/app

---

**Good luck! The sacred patterns await your implementation.**
