# Sacred Voxel Recursion - Comprehensive Project Documentation

## Table of Contents
1. [Project Vision](#project-vision)
2. [Core Concepts](#core-concepts)
3. [Architecture Overview](#architecture-overview)
4. [Current Implementation](#current-implementation)
5. [Pending Features](#pending-features)
6. [Rebuild Guide](#rebuild-guide)
7. [Technical Reference](#technical-reference)

---

## Project Vision

**Sacred Voxel Recursion** is an experimental, 16-bit style generative art engine that explores the intersection of sacred geometry, computational aesthetics, and real-time 3D rendering. The project embodies a "shacks not cathedrals" philosophy - emphasizing modularity, sound architecture, and rapid prototyping while maintaining flexibility for future expansion.

### Design Philosophy
- **Experimental First**: A proof-of-concept exploring emergent patterns and recursive visual systems
- **Retro-Futuristic Aesthetic**: 16-bit color palette (65,536 colors) with pixelated rendering
- **Modular Architecture**: Component-based design allowing easy scene composition and experimentation
- **Performance-Conscious**: Optimized for real-time browser rendering using WebGL

### Artistic Goals
- Create mesmerizing, mathematically-driven visual experiences
- Explore the relationship between ancient sacred geometry and modern computational graphics
- Build a foundation for interactive generative art experiences
- Demonstrate real-time 3D rendering capabilities in the browser

---

## Core Concepts

### 1. Float.Dispatch Concept

**Float.Dispatch** represents the animation timing and state management system that "dispatches" time-based transformations to geometric primitives throughout the scene hierarchy.

#### Key Aspects:
- **Centralized Time Management**: A single source of truth for animation time (`time` state) that flows through all components
- **Frame-Based Updates**: 15fps retro frame counter for UI synchronization
- **State Dispatch Pattern**: React's `useState` with `setTime` dispatcher manages the global animation clock
- **Deterministic Animation**: All components receive the same time value, ensuring synchronized transformations

#### Implementation:
\`\`\`typescript
// In AnimationContext
const [time, setTime] = useState(0)

// In AnimationLoop (inside Canvas)
useFrame((state) => {
  setTime(state.clock.getElapsedTime())
})

// Components consume time
const { time } = useAnimation()
useFrame(() => {
  meshRef.current.rotation.z = time * 0.2
})
\`\`\`

**Why "Float"?**
- The time value is a floating-point number representing elapsed seconds
- Geometric transformations use Float32Array for performance
- "Floating" also evokes the ethereal, weightless quality of the animations

**Why "Dispatch"?**
- Inspired by React's dispatch pattern (actions → state updates)
- Time is "dispatched" from the central clock to all components
- Enables predictable, testable animation logic

### 2. Imprints Concept

**Imprints** refers to the visual persistence and layering system where geometric patterns leave "traces" or "impressions" that build upon each other through:

#### Visual Imprinting:
- **Scene Transitions**: Previous scenes fade out while new ones fade in, creating layered visual echoes
- **Opacity Modulation**: Transparency allows patterns to overlay and interact visually
- **Memory in Motion**: Particles and points follow paths that "remember" previous states
- **Recursive Patterns**: Each iteration builds upon the last, creating emergent complexity

#### Mathematical Imprinting:
- **Parametric Curves**: Points follow torus knots, spirals, and other curves defined by equations
- **State Persistence**: Position, rotation, and scale transformations accumulate over time
- **Color Gradation**: Colors interpolate between palette values, creating smooth transitions
- **Harmonic Oscillation**: Sin/cos waves create rhythmic patterns that "imprint" on the viewer's perception

#### Implementation Examples:
\`\`\`typescript
// Scene transition creates visual imprints
const getSceneOpacity = (sceneId) => {
  if (transitioning) {
    if (previousScene === sceneId) return 1 - transitionProgress // Fading out
    if (currentScene === sceneId) return transitionProgress // Fading in
  }
  return 1
}

// Particle positions "remember" their parametric curve
positions[i3] = r * Math.cos(p * t) * Math.cos(q * t)
positions[i3 + 1] = r * Math.cos(p * t) * Math.sin(q * t)
positions[i3 + 2] = r * Math.sin(p * t)
\`\`\`

**Conceptual Significance:**
- **Temporal Layers**: The past is visible through fading opacity
- **Emergent Complexity**: Simple rules create complex, evolving patterns
- **Visual Memory**: The system "remembers" previous states through smooth transitions
- **Meditation on Impermanence**: Forms appear, transform, and dissolve - a digital mandala

---

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **3D Rendering**: Three.js + React Three Fiber
- **3D Utilities**: @react-three/drei
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

### Project Structure
\`\`\`
sacred-voxel-recursion/
├── app/
│   ├── page.tsx                    # Main entry point (server component)
│   ├── layout.tsx                  # Root layout with metadata
│   ├── globals.css                 # Global styles, color tokens
│   └── not-found.tsx              # 404 page
├── components/
│   ├── animation-context.tsx       # Central state management (Float.Dispatch)
│   ├── sacred-geometry-animation.tsx  # Canvas setup and 3D environment
│   ├── sacred-geometry-client.tsx  # Client-side wrapper with dynamic imports
│   ├── scene-renderer.tsx          # Scene orchestration and transitions
│   ├── scene-indicator.tsx         # UI dots showing current scene
│   ├── ui-overlay.tsx              # HUD displaying frame count and scene name
│   ├── error-boundary.tsx          # Graceful error handling
│   ├── scenes/
│   │   ├── index.tsx              # Scene exports
│   │   ├── scene-one.tsx          # Scene 1: Sacred Geometry Basics
│   │   ├── scene-two.tsx          # Scene 2: Vector Field Minimalism
│   │   ├── scene-three.tsx        # Scene 3: Oscillating Gradients
│   │   ├── scene-four.tsx         # Scene 4: Voxel Sigil Interface
│   │   ├── scene-five.tsx         # Scene 5: Recursive Collapse
│   │   └── scene-components/      # Reusable geometric primitives
│   │       ├── circle-geometry.tsx
│   │       ├── flower-of-life.tsx
│   │       ├── merkaba-stars.tsx
│   │       ├── pixelated-particles.tsx
│   │       ├── simple-gradient.tsx
│   │       ├── simple-recursive-pattern.tsx
│   │       ├── simple-vector-field.tsx
│   │       ├── simple-voxel-grid.tsx
│   │       ├── sri-yantra.tsx
│   │       └── star.tsx
│   └── ui/                        # shadcn/ui components (various)
├── hooks/
│   └── use-toast.ts               # Toast notification hook
├── lib/
│   └── utils.ts                   # Utility functions (cn for classnames)
└── next.config.js                 # Next.js configuration
\`\`\`

### Key Architectural Patterns

#### 1. Context-Based State Management
- **AnimationContext**: Provides global animation state to all components
- **Provider Pattern**: Wraps the entire 3D scene to share time, scene state, and transitions
- **Custom Hook**: `useAnimation()` for consuming context in any component

#### 2. Scene-Based Composition
- Each scene is a self-contained React component
- Scenes receive `scale`, `opacity`, and `visible` props for transitions
- Scene components compose reusable geometric primitives

#### 3. Separation of Concerns
- **Server Components**: Page routing and metadata (app/page.tsx)
- **Client Components**: Interactive 3D rendering (marked with "use client")
- **Dynamic Imports**: `ssr: false` prevents server-side rendering of Three.js code

#### 4. Performance Optimizations
- **Memoization**: `React.memo()` prevents unnecessary re-renders
- **useMemo**: Expensive calculations (particle positions, colors) computed once
- **Conditional Rendering**: Only active/transitioning scenes are rendered
- **Buffer Attributes**: Direct Float32Array buffers for efficient GPU data transfer

---

## Current Implementation

### Implemented Features

#### 1. Five Complete Scenes
1. **Sacred Geometry Basics**
   - Flower of Life (7 overlapping circles)
   - Sri Yantra (interlocking triangles)
   - Merkaba (3D star tetrahedron)
   - Torus Knot Particles (200 animated points)

2. **Vector Field Minimalism**
   - Sparse arrow grid showing directional flow
   - Dynamic rotation based on position
   - Pulsing animation synced to time

3. **Oscillating Gradients**
   - Layered planes with gradient colors
   - Rotating and pulsing effects
   - Transparency-based depth

4. **Voxel Sigil Interface**
   - 3D grid of cubes
   - Height variation based on position
   - Oscillating y-position animation

5. **Recursive Collapse**
   - Spiral point cloud
   - Parametric curve (Fibonacci-inspired)
   - Color alternation (cyan/magenta)

#### 2. Animation System
- **Automatic Scene Transitions**: 10-second duration per scene
- **Smooth Crossfades**: 2.5-second transition with easeInOutCubic easing
- **Manual Scene Selection**: Can trigger scene changes via `manuallyChangeScene()`
- **Transition States**: Tracks previous scene, current scene, and progress

#### 3. UI Components
- **HUD Overlay**: Frame counter, scene name, system status
- **Scene Indicator**: Dots showing current scene position (5 total)
- **Retro Aesthetic**: Monospace font, bordered panels, cyan/magenta/gold colors

#### 4. Visual Design
- **16-bit Color Palette**:
  - Cyan: `#00ffff, #00ccff, #0099ff, #0066ff, #0033ff`
  - Magenta: `#ff00ff, #ff0099, #ff0066, #ff0033, #cc0066`
  - Gold: `#ffcc00, #ffaa00, #ff9900, #ff6600, #cc9900`
  - White/Gray scale for UI
  - Pure black background

- **Pixelated Rendering**: `image-rendering: pixelated` CSS on canvas
- **Low-Poly Geometry**: Limited segments for retro feel
- **Wireframe Materials**: Many components use wireframe rendering

#### 5. Technical Features
- **Error Boundary**: Catches and displays Three.js errors gracefully
- **SSR Safety**: Proper client-only rendering with window checks
- **Shadow Disabled**: Prevents production build errors
- **OrbitControls**: Auto-rotation with constrained polar angle
- **Responsive Canvas**: Adapts to window size with pixel ratio optimization

### File-by-File Breakdown

#### `components/animation-context.tsx`
**Purpose**: Central state management for animation timing and scene transitions

**Key Exports**:
- `COLORS`: Global color palette object
- `SCENES`: Array of scene configurations (id, name)
- `AnimationProvider`: Context provider component
- `useAnimation()`: Hook to access animation state
- Helper functions: `hexToRgb()`, `easeInOutCubic()`

**State Management**:
- `time`: Current animation time (seconds)
- `frame`: Frame counter (0-59, 15fps)
- `currentScene`: Active scene index
- `previousScene`: Scene being transitioned from
- `transitioning`: Boolean transition state
- `transitionProgress`: 0-1 transition completion

**Timers**:
- Frame counter: Updates every 1000/15 ms (15fps)
- Scene transition: Every 10 seconds
- Transition animation: 25ms intervals (40fps)

#### `components/sacred-geometry-animation.tsx`
**Purpose**: Sets up the Three.js Canvas and 3D environment

**Key Features**:
- Canvas configuration (camera, renderer, performance)
- Ambient and point lighting
- OrbitControls setup
- AnimationLoop component (updates time via useFrame)
- SSR safety checks (window detection)

**Configuration**:
- Camera: position `[0, 0, 5]`, FOV 75°
- Shadows: Disabled (prevents production errors)
- Background: Pure black `#000000`
- Pixel ratio: Min of device pixel ratio or 2

#### `components/scene-renderer.tsx`
**Purpose**: Orchestrates scene rendering and transitions

**Responsibilities**:
- Determines which scenes to render (active + transitioning)
- Calculates scale and opacity for each scene
- Forces material updates during transitions
- Ensures transparent materials update correctly

**Key Functions**:
- `getSceneScale(sceneId)`: Returns scale based on transition state
- `getSceneOpacity(sceneId)`: Returns opacity based on transition state

**Rendering Logic**:
\`\`\`typescript
renderScene0 = currentScene === 0 || (transitioning && previousScene === 0)
\`\`\`

#### Scene Components (`components/scenes/*.tsx`)
Each scene is structured similarly:

\`\`\`typescript
const SceneX = ({ scale = 1, opacity = 1, visible = true }) => {
  const { time } = useAnimation()
  const groupRef = useRef()

  // Force material updates when opacity changes
  useEffect(() => {
    // Traverse scene graph and update materials
  }, [opacity])

  return (
    <group ref={groupRef} scale={...} visible={visible}>
      {/* Child geometry components */}
      <Text>{/* Scene title */}</Text>
    </group>
  )
}
\`\`\`

#### Geometric Primitives (`components/scenes/scene-components/*.tsx`)
Reusable components with consistent patterns:

- Accept `time`, `position`, `opacity` props
- Use `useRef()` for direct mesh manipulation
- Use `useFrame()` for per-frame animation
- Use `useMemo()` for expensive calculations
- Use Float32Array for buffer geometry

**Example**: `pixelated-particles.tsx`
- Creates torus knot point cloud
- Updates positions every frame
- Uses vertex colors from palette

---

## Pending Features

### Conceptual/Design Enhancements

#### 1. Interactive Imprints System
**Vision**: Allow users to "stamp" or "imprint" geometric patterns onto the canvas through mouse/touch interaction.

**Implementation Ideas**:
- Click to spawn a sacred geometry pattern at cursor position
- Hold and drag to create trails of particles
- Patterns persist for N seconds then fade out
- Multiple users could create collaborative imprints (if networked)

**Technical Approach**:
- Track click events with raycasting
- Store imprint data in state array: `[{position, pattern, timestamp, opacity}]`
- Render imprints with time-based opacity fade
- Limit total imprints to prevent performance issues

#### 2. Float.Dispatch Evolution
**Vision**: Extend the time dispatch system to support multiple independent timelines

**Features**:
- **Time Dilation**: Slow down or speed up individual scenes
- **Reverse Time**: Play scenes backwards
- **Pause/Resume**: Freeze time for a specific scene while others continue
- **Scrubbing**: Manual time control via UI slider

**Implementation**:
\`\`\`typescript
// Multi-timeline context
const [timelines, setTimelines] = useState({
  global: 0,
  scene0: 0,
  scene1: 0,
  // ...
})

// Each scene gets its own time
const sceneTime = timelines[`scene${sceneId}`] || timelines.global
\`\`\`

#### 3. Audio Reactivity
**Vision**: Sync animations to music/audio input

**Features**:
- Microphone input analysis (Web Audio API)
- Beat detection triggers scene transitions
- Frequency bands control different geometric properties
  - Bass → particle size
  - Mids → rotation speed
  - Highs → color brightness

**Technical Approach**:
\`\`\`typescript
const [audioData, setAudioData] = useState({ bass: 0, mid: 0, high: 0 })

// In useFrame:
const scale = 1 + audioData.bass * 0.5
\`\`\`

#### 4. Generative Scene System
**Vision**: Procedurally generate new scenes based on parameters

**Features**:
- Rule-based geometry generation
- L-system fractals
- Cellular automata patterns
- Genetic algorithm for evolving visuals

**Parameters**:
- Symmetry level (3, 4, 5, 6, 8-fold)
- Recursion depth
- Color palette selection
- Animation speed/style

#### 5. Export/Recording
**Vision**: Allow users to capture their experience

**Features**:
- Screenshot (single frame)
- GIF export (loop recording)
- Video export (MP4/WebM)
- SVG export (vector snapshot for 2D scenes)

**Technical Approach**:
- Use `gl.domElement.toDataURL()` for screenshots
- MediaRecorder API for video capture
- Frame-by-frame rendering for GIF

### Technical Improvements

#### 1. Performance Profiling
- Implement FPS counter
- Memory usage tracking
- Draw call optimization
- LOD (Level of Detail) system for complex scenes

#### 2. Mobile Optimization
- Touch gestures for scene selection
- Reduced particle counts on mobile
- Better responsive layout
- Device capability detection

#### 3. Accessibility
- Keyboard navigation (arrow keys for scene selection)
- Screen reader descriptions of scenes
- Reduced motion option (disable transitions)
- High contrast mode

#### 4. Testing
- Unit tests for helper functions
- Integration tests for scene transitions
- Visual regression tests (screenshot comparison)
- Performance benchmarks

#### 5. Developer Tools
- Scene editor UI
- Real-time parameter tweaking
- Timeline scrubber
- Component inspector

---

## Rebuild Guide

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Basic understanding of:
  - React (hooks, context)
  - Three.js / 3D graphics concepts
  - TypeScript
  - Next.js App Router

### Step-by-Step Rebuild Instructions

#### Phase 1: Project Setup (30 minutes)

1. **Initialize Next.js Project**
\`\`\`bash
npx create-next-app@14.0.4 sacred-voxel-recursion
cd sacred-voxel-recursion
\`\`\`

Choose options:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No
- App Router: Yes
- Import alias: Yes (@/*)

2. **Install Dependencies**
\`\`\`bash
npm install three@^0.160.0 @react-three/fiber@^8.15.12 @react-three/drei@^9.92.7
npm install -D @types/three@^0.160.0
\`\`\`

3. **Configure next.config.js**
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

4. **Setup Global Styles** (`app/globals.css`)
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

5. **Update Tailwind Config** (`tailwind.config.ts`)
\`\`\`typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          100: "var(--cyan-100)",
          200: "var(--cyan-200)",
          300: "var(--cyan-300)",
          400: "var(--cyan-400)",
          500: "var(--cyan-500)",
        },
        magenta: {
          100: "var(--magenta-100)",
          200: "var(--magenta-200)",
          300: "var(--magenta-300)",
          400: "var(--magenta-400)",
          500: "var(--magenta-500)",
        },
        gold: {
          100: "var(--gold-100)",
          200: "var(--gold-200)",
          300: "var(--gold-300)",
          400: "var(--gold-400)",
          500: "var(--gold-500)",
        },
      },
    },
  },
  plugins: [],
}
export default config
\`\`\`

#### Phase 2: Core Animation System (1 hour)

6. **Create Animation Context** (`components/animation-context.tsx`)

Key sections to implement:
- Color palette constants
- Scene configuration array
- Timing constants (SCENE_DURATION, TRANSITION_DURATION)
- Context type definition
- AnimationProvider with state management:
  - time, frame, currentScene, previousScene
  - transitioning, transitionProgress
  - Three timers: frame counter, scene transition, transition animation
- useAnimation() custom hook
- Helper functions: hexToRgb(), easeInOutCubic()

**Critical Implementation Details**:
- Use `setIsBrowser(true)` in useEffect to prevent SSR issues
- Only run timers when `isBrowser` is true
- Clear intervals on cleanup
- Memoize context value to prevent unnecessary re-renders

7. **Create Error Boundary** (`components/error-boundary.tsx`)
\`\`\`typescript
"use client"
import { Component, type ReactNode } from "react"

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-black text-cyan-400">
          <div className="border border-cyan-500 p-4">
            <h1 className="text-xl mb-2">SYSTEM ERROR</h1>
            <p>{this.state.error?.message}</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
\`\`\`

#### Phase 3: 3D Canvas Setup (45 minutes)

8. **Create Main Animation Component** (`components/sacred-geometry-animation.tsx`)

Key sections:
- Client component directive: `"use client"`
- State for pixelRatio and mounted
- useEffect to safely access window
- Return null if not mounted
- Canvas setup:
  - Camera position and FOV
  - GL renderer config (antialias, pixelRatio)
  - Shadows disabled: `shadows={false}`
  - Black background
  - Ambient and point lights (no shadows)
  - OrbitControls with constraints
- AnimationLoop component:
  - Single useFrame hook
  - Calls setTime with elapsed time

**Canvas Configuration**:
\`\`\`typescript
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
\`\`\`

9. **Create Client Wrapper** (`components/sacred-geometry-client.tsx`)
\`\`\`typescript
"use client"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { AnimationProvider } from "./animation-context"
import { ErrorBoundary } from "./error-boundary"

const SacredGeometryAnimation = dynamic(
  () => import("./sacred-geometry-animation"),
  { ssr: false }
)

const UIOverlay = dynamic(() => import("./ui-overlay"), { ssr: false })

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="text-cyan-400 font-mono">INITIALIZING...</div>
    </div>
  )
}

export default function SacredGeometryClient() {
  return (
    <ErrorBoundary>
      <AnimationProvider>
        <Suspense fallback={<LoadingFallback />}>
          <SacredGeometryAnimation />
          <UIOverlay />
        </Suspense>
      </AnimationProvider>
    </ErrorBoundary>
  )
}
\`\`\`

10. **Update App Page** (`app/page.tsx`)
\`\`\`typescript
import SacredGeometryClient from "@/components/sacred-geometry-client"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <SacredGeometryClient />
    </main>
  )
}
\`\`\`

#### Phase 4: UI Components (30 minutes)

11. **Create UI Overlay** (`components/ui-overlay.tsx`)
\`\`\`typescript
"use client"
import { memo } from "react"
import { useAnimation } from "./animation-context"

const UIOverlay = () => {
  const { frame, currentScene, sceneNames, transitioning, transitionProgress } = useAnimation()

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-4 font-mono text-xs text-cyan-400 flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="border border-cyan-500 bg-black/50 p-2">
          SACRED GEOMETRY ENGINE v2.0
        </div>
        <div className="border border-magenta-500 bg-black/50 p-2">
          FRAME: {frame.toString().padStart(2, "0")}/60
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="border border-gold-500 bg-black/50 p-2">
          SCENE: {sceneNames[currentScene]}
          {transitioning && ` (${Math.round(transitionProgress * 100)}%)`}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="border border-cyan-500 bg-black/50 p-2">SYSTEM: ACTIVE</div>
        <div className="border border-gold-500 bg-black/50 p-2">DEBUGGING MODE</div>
      </div>
    </div>
  )
}

export default memo(UIOverlay)
\`\`\`

12. **Create Scene Indicator** (`components/scene-indicator.tsx`)
\`\`\`typescript
"use client"
import { memo } from "react"
import { useAnimation, COLORS, SCENES } from "./animation-context"

const SceneIndicator = () => {
  const { currentScene } = useAnimation()

  return (
    <group position={[0, -2.5, 0]}>
      {SCENES.map((scene, i) => (
        <mesh key={scene.id} position={[(i - (SCENES.length - 1) / 2) * 0.3, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color={i === currentScene ? COLORS.cyan[1] : COLORS.white[3]}
            transparent
            opacity={i === currentScene ? 1 : 0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

export default memo(SceneIndicator)
\`\`\`

#### Phase 5: Scene System (2 hours)

13. **Create Scene Renderer** (`components/scene-renderer.tsx`)

Key logic:
- Determine which scenes to render (active + transitioning)
- Calculate scale/opacity based on transition state
- Force material updates when transitioning changes
- Render only necessary scenes for performance

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

14. **Create Scene Template**

Each scene should follow this pattern:
\`\`\`typescript
"use client"
import { memo, useRef, useEffect } from "react"
import { Text } from "@react-three/drei"
import { useAnimation, COLORS } from "../animation-context"

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
      {/* Scene content here */}
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

15. **Create Five Scenes**

Create these files in `components/scenes/`:
- `scene-one.tsx` - Sacred Geometry Basics
- `scene-two.tsx` - Vector Field Minimalism
- `scene-three.tsx` - Oscillating Gradients
- `scene-four.tsx` - Voxel Sigil Interface
- `scene-five.tsx` - Recursive Collapse

Each imports its child components from `scene-components/`

16. **Create Scene Index** (`components/scenes/index.tsx`)
\`\`\`typescript
"use client"
import SceneOne from "./scene-one"
import SceneTwo from "./scene-two"
import SceneThree from "./scene-three"
import SceneFour from "./scene-four"
import SceneFive from "./scene-five"

export { SceneOne, SceneTwo, SceneThree, SceneFour, SceneFive }
\`\`\`

#### Phase 6: Geometric Primitives (3-4 hours)

17. **Create Component Directory**
\`\`\`
components/scenes/scene-components/
\`\`\`

18. **Implement Core Primitives**

Create these files (see existing implementations for details):
- `circle-geometry.tsx` - Basic circle with wireframe
- `star.tsx` - N-pointed star geometry
- `flower-of-life.tsx` - 7 overlapping circles
- `sri-yantra.tsx` - Interlocking triangles with center dot
- `merkaba-stars.tsx` - Two counter-rotating stars
- `pixelated-particles.tsx` - Torus knot particle system
- `simple-vector-field.tsx` - Arrow grid
- `simple-gradient.tsx` - Layered gradient planes
- `simple-voxel-grid.tsx` - 3D cube grid
- `simple-recursive-pattern.tsx` - Spiral point cloud

**Key Patterns for All Primitives**:
- Accept `time`, `position`, `opacity` props
- Use `useRef()` for mesh references
- Use `useFrame()` for animations
- Use `useMemo()` for expensive calculations
- Use `Float32Array` for buffer geometry
- Include wireframe or basic materials

**Example: Simple Particle System**
\`\`\`typescript
function PixelatedParticles({ count, time, opacity = 1 }) {
  const points = useMemo(() => {
    const tempPoints = []
    const tempColors = []
    const colorOptions = [...COLORS.cyan, ...COLORS.magenta, ...COLORS.gold]

    for (let i = 0; i < count; i++) {
      // Generate positions (e.g., torus knot)
      const t = (i / count) * Math.PI * 2
      const p = 2, q = 3, r = 2.5
      const x = r * Math.cos(p * t) * Math.cos(q * t)
      const y = r * Math.cos(p * t) * Math.sin(q * t)
      const z = r * Math.sin(p * t)
      tempPoints.push(x, y, z)

      // Assign color
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      const rgb = hexToRgb(color)
      tempColors.push(rgb.r / 255, rgb.g / 255, rgb.b / 255)
    }

    return { positions: tempPoints, colors: tempColors }
  }, [count])

  const pointsRef = useRef()

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1

      // Animate positions
      const positions = pointsRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const t = (i / count) * Math.PI * 2 + time * 0.2
        const p = 2, q = 3
        const r = 2.5 + Math.sin(t * 5 + time) * 0.2
        positions[i3] = r * Math.cos(p * t) * Math.cos(q * t)
        positions[i3 + 1] = r * Math.cos(p * t) * Math.sin(q * t)
        positions[i3 + 2] = r * Math.sin(p * t)
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.positions.length / 3}
          array={new Float32Array(points.positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={points.colors.length / 3}
          array={new Float32Array(points.colors)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={opacity} />
    </points>
  )
}
\`\`\`

#### Phase 7: Testing & Refinement (1-2 hours)

19. **Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and verify:
- [ ] Canvas renders without errors
- [ ] Scenes transition every 10 seconds
- [ ] UI overlay displays correctly
- [ ] Frame counter updates at 15fps
- [ ] Scene indicator dots update
- [ ] OrbitControls work (drag to rotate)
- [ ] No console errors

20. **Build for Production**
\`\`\`bash
npm run build
\`\`\`

Verify:
- [ ] Build completes without errors
- [ ] No SSR "window is not defined" errors
- [ ] No Three.js shadow errors
- [ ] Bundle size is reasonable (<2MB initial load)

21. **Deploy to Vercel**
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Or:
- Push to GitHub
- Connect repository in Vercel dashboard
- Deploy automatically

#### Phase 8: Documentation (30 minutes)

22. **Create README.md**
\`\`\`markdown
# Sacred Voxel Recursion

16-bit style generative art engine exploring sacred geometry and recursive patterns.

## Features
- 5 unique animated scenes
- Automatic scene transitions
- Retro 16-bit aesthetic
- Real-time 3D rendering

## Tech Stack
- Next.js 14
- Three.js + React Three Fiber
- TypeScript
- Tailwind CSS

## Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`

## Architecture
- `components/animation-context.tsx` - State management
- `components/scenes/` - Five animated scenes
- `components/scene-components/` - Reusable geometry

## Concepts
- **Float.Dispatch**: Centralized time management system
- **Imprints**: Visual layering and pattern persistence
\`\`\`

23. **Create this DOCUMENTATION.md file** (the document you're reading!)

---

## Technical Reference

### Animation Timing

#### Time Flow
\`\`\`
AnimationLoop (useFrame)
  ↓
setTime(elapsedTime)
  ↓
AnimationContext updates
  ↓
All components receive new time via useAnimation()
  ↓
Components update in useFrame hooks
\`\`\`

#### Scene Transition Timeline
\`\`\`
t=0s   Scene A at 100% opacity
t=10s  Transition begins
       - Scene A fades out (100% → 0%)
       - Scene B fades in (0% → 100%)
t=12.5s Transition complete
       - Scene A removed from render
       - Scene B at 100% opacity
t=22.5s Next transition begins
\`\`\`

#### Easing Function
\`\`\`typescript
// easeInOutCubic: Smooth acceleration and deceleration
// Input: x (0 to 1)
// Output: eased value (0 to 1)
function easeInOutCubic(x: number): number {
  return x < 0.5 
    ? 4 * x * x * x 
    : 1 - Math.pow(-2 * x + 2, 3) / 2
}

// Visual curve:
//   ^
// 1 |        ____
//   |      /
// 0 |_____/
//   0    0.5    1
\`\`\`

### Geometry Patterns

#### Torus Knot Parametric Equations
\`\`\`typescript
// p = number of twists around the torus
// q = number of winds through the torus hole
const p = 2, q = 3, r = 2.5

for (let i = 0; i < count; i++) {
  const t = (i / count) * Math.PI * 2
  
  const x = r * Math.cos(p * t) * Math.cos(q * t)
  const y = r * Math.cos(p * t) * Math.sin(q * t)
  const z = r * Math.sin(p * t)
  
  points.push(x, y, z)
}
\`\`\`

#### Flower of Life Construction
\`\`\`typescript
// Center circle + 6 surrounding circles
const circleCount = 7
const radius = 1.2

for (let i = 0; i < circleCount; i++) {
  const angle = (i / circleCount) * Math.PI * 2
  const x = Math.cos(angle) * radius * 0.5
  const y = Math.sin(angle) * radius * 0.5
  
  // Create circle at (x, y)
}
\`\`\`

#### Sri Yantra Triangle Pattern
\`\`\`typescript
// Upward triangles
for (let i = 0; i < 5; i++) {
  const size = 1 + i * 0.2
  createTriangle(size, rotation: 0, color: magenta)
}

// Downward triangles
for (let i = 0; i < 4; i++) {
  const size = 1.1 + i * 0.2
  createTriangle(size, rotation: Math.PI, color: gold)
}
\`\`\`

### Performance Considerations

#### Render Budget
- Target: 60 FPS (16.67ms per frame)
- Canvas render: ~8-10ms
- React reconciliation: ~2-3ms
- Animation updates: ~1-2ms
- Remaining budget: ~3-5ms

#### Optimization Techniques
1. **Conditional Rendering**: Only render active/transitioning scenes
2. **Memoization**: Use `React.memo()` and `useMemo()`
3. **Buffer Geometry**: Direct Float32Array for GPU data
4. **Instance Rendering**: (Future) For repeated geometry
5. **LOD System**: (Future) Reduce detail based on distance

#### Particle Count Guidelines
- Desktop: 500-1000 particles @ 60fps
- Mobile: 100-300 particles @ 30-60fps
- Current: 200 particles (conservative)

### Color Palette Philosophy

#### 16-bit Color Theory
- Total possible colors: 65,536 (2^16)
- RGB565: 5 bits red, 6 bits green, 5 bits blue
- This project: Curated palette of ~20 colors for aesthetic coherence

#### Palette Design
- **Cyan**: Cool, technological, vast (sky/water)
- **Magenta**: Warm, energetic, mysterious (sunset/cosmos)
- **Gold**: Accent, sacred, valuable (divine geometry)
- **White/Gray**: Structure, UI, clarity
- **Black**: Void, infinite, background

#### Color Harmony
\`\`\`
Primary:   Cyan (#00ffff)
Secondary: Magenta (#ff00ff)
Accent:    Gold (#ffcc00)

Complementary pairs:
- Cyan + Magenta (high contrast)
- Gold + Black (maximum readability)
\`\`\`

### React Three Fiber Patterns

#### Component Structure
\`\`\`typescript
"use client"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

function GeometryComponent({ time, position, opacity }) {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      // Per-frame animation
      meshRef.current.rotation.z = time * 0.2
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={opacity} />
    </mesh>
  )
}
\`\`\`

#### Common Pitfalls
1. **Multiple useFrame hooks**: Consolidate into one AnimationLoop
2. **Recreating geometry**: Use useMemo for static data
3. **Updating arrays directly**: Set `.needsUpdate = true` on buffer attributes
4. **SSR issues**: Always use client components for Three.js
5. **Shadow errors**: Disable shadows to prevent production issues

### Deployment Checklist

Before deploying:
- [ ] Run `npm run build` successfully
- [ ] Test production build locally (`npm run start`)
- [ ] Check bundle size (`du -sh .next/static/`)
- [ ] Verify no console errors in production mode
- [ ] Test on mobile device (or emulator)
- [ ] Verify OrbitControls work (touch gestures)
- [ ] Check lighthouse score (aim for >80)
- [ ] Test scene transitions (all 5 scenes)
- [ ] Verify UI overlay displays correctly
- [ ] Test error boundary (intentionally break something)

Vercel specific:
- [ ] Set Node.js version to 18+ in project settings
- [ ] Verify build command: `next build`
- [ ] Verify output directory: `.next`
- [ ] Check deploy logs for warnings
- [ ] Test preview deployment before production
- [ ] Set up custom domain (optional)

### Common Issues & Solutions

#### Issue: "window is not defined"
**Cause**: Server-side rendering trying to access browser APIs

**Solution**:
\`\`\`typescript
// 1. Mark component as client-only
"use client"

// 2. Check for window before using
useEffect(() => {
  if (typeof window !== "undefined") {
    // Browser code here
  }
}, [])

// 3. Use dynamic import with ssr: false
const Component = dynamic(() => import("./component"), { ssr: false })
\`\`\`

#### Issue: "Cannot set property customDepthMaterial"
**Cause**: Three.js trying to set read-only shadow properties

**Solution**:
\`\`\`typescript
// Disable shadows in Canvas
<Canvas shadows={false}>
  <pointLight castShadow={false} />
</Canvas>

// Don't try to modify shadow-related properties
// (customDepthMaterial, castShadow, etc.)
\`\`\`

#### Issue: Transitions not smooth
**Cause**: Linear interpolation or low update rate

**Solution**:
\`\`\`typescript
// Use easing function
const eased = easeInOutCubic(transitionProgress)
const opacity = previousScene === sceneId ? 1 - eased : eased

// Increase update rate
const transitionTimer = setInterval(() => {
  setTransitionProgress(prev => prev + 0.025)
}, 25) // 40fps
\`\`\`

#### Issue: Performance drops on mobile
**Cause**: Too many particles or complex geometry

**Solution**:
\`\`\`typescript
// Detect device type
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)

// Reduce particle count
const particleCount = isMobile ? 100 : 500

// Simplify geometry
const segments = isMobile ? 8 : 16
\`\`\`

#### Issue: Scene doesn't update after prop change
**Cause**: Material or geometry not marked for update

**Solution**:
\`\`\`typescript
// Force material update
material.needsUpdate = true

// Force geometry update
geometry.attributes.position.needsUpdate = true
\`\`\`

---

## Contributing & Extending

### Adding a New Scene

1. Create scene file: `components/scenes/scene-six.tsx`
2. Follow scene template structure (see Phase 5 above)
3. Add scene to SCENES array in `animation-context.tsx`:
\`\`\`typescript
export const SCENES = [
  // ... existing scenes
  { id: 5, name: "NEW SCENE NAME" },
]
\`\`\`
4. Import and render in `scene-renderer.tsx`:
\`\`\`typescript
import { SceneOne, /* ... */, SceneSix } from "./scenes"

// Add to render logic
const renderScene5 = currentScene === 5 || (transitioning && previousScene === 5)

// Add to JSX
{renderScene5 && (
  <SceneSix scale={getSceneScale(5)} opacity={getSceneOpacity(5)} visible={true} />
)}
\`\`\`

### Adding a New Geometric Primitive

1. Create component: `components/scenes/scene-components/my-geometry.tsx`
2. Follow primitive patterns:
   - Accept `time`, `position`, `opacity` props
   - Use `useRef()` for mesh
   - Use `useMemo()` for expensive calculations
   - Use `useFrame()` for animation
3. Export from component
4. Import and use in scene:
\`\`\`typescript
import { MyGeometry } from "./scene-components/my-geometry"

// In scene JSX
<MyGeometry position={[0, 0, 0]} time={time} opacity={opacity} />
\`\`\`

### Modifying Timing

Change scene duration or transition speed:

\`\`\`typescript
// In animation-context.tsx
export const SCENE_DURATION = 15 // Longer scenes
export const TRANSITION_DURATION = 1.5 // Faster transitions
\`\`\`

### Customizing Colors

Modify global palette:

\`\`\`typescript
// In animation-context.tsx
export const COLORS = {
  cyan: ["#00ffff", "#00ccff", /* ... */],
  magenta: ["#ff00ff", "#ff0099", /* ... */],
  gold: ["#ffcc00", "#ffaa00", /* ... */],
  // Add new color family
  purple: ["#9900ff", "#7700cc", "#5500aa"],
}
\`\`\`

Update CSS variables in `app/globals.css`:
\`\`\`css
:root {
  --purple-100: #e0d0ff;
  --purple-200: #9900ff;
  /* ... */
}
\`\`\`

---

## Philosophical Notes

### On "Float.Dispatch"

The name was chosen to capture the dual nature of the animation system:

1. **Technical**: Floating-point numbers dispatched through React's state system
2. **Poetic**: Time "floats" through the scenes like a river, carrying transformations
3. **Metaphorical**: A dispatcher sends messages; time sends change to all components

This system embodies the Unix philosophy: "Do one thing and do it well." The AnimationContext is solely responsible for time management, and components are merely receivers and transformers of that time.

### On "Imprints"

Imprints represent the philosophical concept of **persistence of pattern** - the idea that every action leaves a trace, and complex systems emerge from the accumulation of simple rules repeated over time.

In the context of this project:
- **Visual Imprints**: Fading transitions leave "ghosts" of previous scenes
- **Temporal Imprints**: Animations follow deterministic paths, creating predictable patterns
- **Cognitive Imprints**: The viewer's perception is "imprinted" by the rhythmic, repeating patterns

This relates to concepts in:
- **Mandala art**: Temporary, sacred geometry that dissolves after completion
- **Cymatics**: Sound creating visible patterns in matter
- **Chaos theory**: Small initial conditions creating vastly different outcomes
- **Buddhist impermanence**: All forms arise, persist, and dissolve

### On Sacred Geometry

Sacred geometry appears in this project not as religious symbolism, but as an exploration of **mathematical beauty** found in nature:

- **Flower of Life**: 6-fold symmetry seen in crystals, snowflakes, honeycombs
- **Sri Yantra**: Fractal triangles representing cosmic unity and multiplicity
- **Merkaba**: 3D star tetrahedron, a Platonic solid fundamental to 3D space
- **Torus Knot**: Closed curves representing cycles, infinity, and interconnection

These patterns are "sacred" in the sense that they reveal the underlying mathematical order of the universe - the same equations govern galaxy spirals, nautilus shells, and the motion of celestial bodies.

### On the Retro Aesthetic

The 16-bit aesthetic is a deliberate choice to:

1. **Embrace constraints**: Limitation breeds creativity
2. **Evoke nostalgia**: Early computer graphics had a raw, honest quality
3. **Focus on essence**: Simpler visuals let the mathematics shine through
4. **Performance**: Fewer colors and lower poly counts = better performance
5. **Timelessness**: Retro never goes out of style

Modern graphics are often overwhelming; this project strips back to essentials, allowing the viewer to focus on the **patterns themselves** rather than photorealistic rendering.

---

## Future Vision

### Short Term (3-6 months)
- Add 5 more scenes (total of 10)
- Implement mouse interaction (click to spawn patterns)
- Add audio reactivity (optional microphone input)
- Create mobile-optimized version
- Add keyboard shortcuts for scene selection

### Medium Term (6-12 months)
- Generative scene system (procedurally create new patterns)
- Export functionality (screenshot, GIF, video)
- Scene editor UI for parameter tweaking
- Multi-user collaborative mode (networked imprints)
- VR support (WebXR API)

### Long Term (1-2 years)
- AI-powered pattern evolution (genetic algorithms)
- NFT integration (mint unique generative art)
- Live coding interface (modify shaders in real-time)
- Physical installation (gallery exhibition with projection mapping)
- Educational platform (teach sacred geometry and math)

---

## Acknowledgments

### Inspirations
- **Ryoji Ikeda**: Minimal audiovisual work
- **Robert Hodgin**: Generative particle systems
- **Joshua Davis**: Computational design pioneer
- **Nervous System**: Algorithmic jewelry and art
- **GMUNK**: Futuristic UI design

### Technologies
- **Three.js**: 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **Next.js**: React framework
- **Vercel**: Deployment platform

### Mathematical Concepts
- **Parametric equations**: Describing curves mathematically
- **Fourier series**: Decomposing waves into sine/cosine components
- **L-systems**: Formal grammars for fractals
- **Cellular automata**: Conway's Game of Life and beyond
- **Chaos theory**: Lorenz attractor, strange attractors

---

## Glossary

**Buffer Geometry**: Three.js geometry using typed arrays for efficiency

**Canvas**: HTML5 element for rendering graphics via WebGL

**Context**: React pattern for sharing state across component tree

**Easing**: Non-linear interpolation for smooth animations

**Float32Array**: Typed array for 32-bit floating-point numbers

**Fractal**: Self-similar pattern at multiple scales

**Hook**: React function for using state/effects in function components

**Memoization**: Caching expensive calculations

**Parametric Equation**: Function defining coordinates based on parameter(s)

**Raycasting**: Detecting 3D object intersections with a ray

**Sacred Geometry**: Mathematical patterns with spiritual/symbolic significance

**Server-Side Rendering (SSR)**: Rendering React on the server before sending to client

**Shader**: GPU program for rendering effects

**Three.js**: JavaScript 3D library built on WebGL

**Torus Knot**: Closed curve on the surface of a torus

**useFrame**: React Three Fiber hook for per-frame updates

**useRef**: React hook for persistent mutable reference

**WebGL**: Web Graphics Library for GPU-accelerated rendering

---

## License

This project is a proof-of-concept and experimental artwork. Feel free to learn from it, remix it, and create your own variations. Attribution appreciated but not required.

## Contact

For questions, collaboration, or just to share what you've built:
- Open an issue on GitHub
- Email: [your-email]
- Twitter: [@your-handle]

---

**Last Updated**: 2024
**Version**: 2.0
**Status**: Active Development
