"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import { useAnimation } from "./animation-context"
import SceneRenderer from "./scene-renderer"

// 16-bit color palette (limited to 65,536 colors)
export const COLORS = {
  cyan: ["#00ffff", "#00ccff", "#0099ff", "#0066ff", "#0033ff"],
  magenta: ["#ff00ff", "#ff0099", "#ff0066", "#ff0033", "#cc0066"],
  gold: ["#ffcc00", "#ffaa00", "#ff9900", "#ff6600", "#cc9900"],
  white: ["#ffffff", "#eeeeee", "#cccccc", "#aaaaaa", "#888888"],
  black: "#000000",
  grid: "#001122",
}

// Scene sequence timing
const SCENE_DURATION = 10 // seconds per scene
const TRANSITION_DURATION = 2 // seconds for transition

// Main component that sets up the 3D environment
export default function SacredGeometryAnimation() {
  // Use state to safely access window after component mounts
  const [pixelRatio, setPixelRatio] = useState(1)
  const [mounted, setMounted] = useState(false)

  // Safely access window properties after mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPixelRatio(Math.min(window.devicePixelRatio, 2))
      setMounted(true)
    }
  }, [])

  // Don't render anything until component is mounted
  if (!mounted) return null

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          // Use the state value instead of directly accessing window
          pixelRatio: pixelRatio,
        }}
        performance={{ min: 0.5 }} // Allow ThreeJS to reduce quality for performance
        // Disable shadows completely to prevent the customDepthMaterial error
        shadows={false}
      >
        <color attach="background" args={["#000000"]} />
        {/* Increase ambient light for better visibility */}
        <ambientLight intensity={0.7} />
        {/* Use basic point light without shadows */}
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

// Centralized animation loop to avoid multiple useFrame calls
function AnimationLoop() {
  const { setTime } = useAnimation()

  // Single useFrame hook to update time
  useFrame((state) => {
    setTime(state.clock.getElapsedTime())
  })

  return null
}

function SceneManager() {
  const [time, setTime] = useState(0)
  const [currentScene, setCurrentScene] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [previousScene, setPreviousScene] = useState(null)

  // Total number of scenes
  const totalScenes = 5

  // Use a manual timer for scene transitions instead of relying on elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      const nextScene = (currentScene + 1) % totalScenes
      setPreviousScene(currentScene)
      setTransitioning(true)
      setTransitionProgress(0)
      setCurrentScene(nextScene)
    }, SCENE_DURATION * 1000)

    return () => clearInterval(timer)
  }, [currentScene, totalScenes])

  // Handle transition animation
  useEffect(() => {
    if (!transitioning) return

    const transitionTimer = setInterval(() => {
      setTransitionProgress((prev) => {
        const newProgress = prev + 0.05
        if (newProgress >= 1) {
          setTransitioning(false)
          setPreviousScene(null)
          clearInterval(transitionTimer)
          return 1
        }
        return newProgress
      })
    }, 50) // Update every 50ms for smooth transition

    return () => clearInterval(transitionTimer)
  }, [transitioning])

  // Update time for animations
  useFrame((state) => {
    setTime(state.clock.getElapsedTime())
  })

  // Use console.log to debug scene transitions
  console.log(
    `Current Scene: ${currentScene}, Previous: ${previousScene}, Transitioning: ${transitioning}, Progress: ${transitionProgress.toFixed(2)}`,
  )

  // Determine which scenes should be rendered
  const renderScene0 = currentScene === 0 || (transitioning && previousScene === 0)
  const renderScene1 = currentScene === 1 || (transitioning && previousScene === 1)
  const renderScene2 = currentScene === 2 || (transitioning && previousScene === 2)
  const renderScene3 = currentScene === 3 || (transitioning && previousScene === 3)
  const renderScene4 = currentScene === 4 || (transitioning && previousScene === 4)

  return (
    <group>
      {/* Only render scenes that are active or were just active */}

      {/* Scene 1: Sacred Geometry Basics */}
      {renderScene0 && (
        <group
          visible={true}
          scale={
            transitioning && previousScene === 0
              ? 1 - transitionProgress
              : transitioning && currentScene === 0
                ? transitionProgress
                : 1
          }
        >
          <FlowerOfLife position={[0, 0, 0]} time={time} />
          <SriYantra position={[0, 0, 0]} time={time} scale={0.5} />
          <MerkabaStars position={[0, 0, 0]} time={time} />
          <PixelatedParticles count={200} time={time} />
        </group>
      )}

      {/* Scene 2: Vector Field Patterns */}
      {renderScene1 && (
        <group
          visible={true}
          scale={
            transitioning && previousScene === 1
              ? 1 - transitionProgress
              : transitioning && currentScene === 1
                ? transitionProgress
                : 1
          }
        >
          <SimpleVectorField time={time} />
          <Text
            position={[0, -1.8, 0]}
            fontSize={0.2}
            color={COLORS.white[0]}
            anchorX="center"
            anchorY="middle"
            backgroundColor={COLORS.black}
            backgroundOpacity={0.5}
            padding={0.1}
          >
            VECTORFIELD MINIMALISM
          </Text>
        </group>
      )}

      {/* Scene 3: Oscillating Gradients */}
      {renderScene2 && (
        <group
          visible={true}
          scale={
            transitioning && previousScene === 2
              ? 1 - transitionProgress
              : transitioning && currentScene === 2
                ? transitionProgress
                : 1
          }
        >
          <SimpleGradient time={time} />
          <Text
            position={[0, -1.8, 0]}
            fontSize={0.2}
            color={COLORS.white[0]}
            anchorX="center"
            anchorY="middle"
            backgroundColor={COLORS.black}
            backgroundOpacity={0.5}
            padding={0.1}
          >
            OSCILLATING GRADIENTS
          </Text>
        </group>
      )}

      {/* Scene 4: Voxel Sigil Interface */}
      {renderScene3 && (
        <group
          visible={true}
          scale={
            transitioning && previousScene === 3
              ? 1 - transitionProgress
              : transitioning && currentScene === 3
                ? transitionProgress
                : 1
          }
        >
          <SimpleVoxelGrid time={time} />
          <Text
            position={[0, -1.8, 0]}
            fontSize={0.2}
            color={COLORS.white[0]}
            anchorX="center"
            anchorY="middle"
            backgroundColor={COLORS.black}
            backgroundOpacity={0.5}
            padding={0.1}
          >
            VOXEL SIGIL INTERFACE
          </Text>
        </group>
      )}

      {/* Scene 5: Recursive Collapse */}
      {renderScene4 && (
        <group
          visible={true}
          scale={
            transitioning && previousScene === 4
              ? 1 - transitionProgress
              : transitioning && currentScene === 4
                ? transitionProgress
                : 1
          }
        >
          <SimpleRecursivePattern time={time} />
          <Text
            position={[0, -1.8, 0]}
            fontSize={0.2}
            color={COLORS.white[0]}
            anchorX="center"
            anchorY="middle"
            backgroundColor={COLORS.black}
            backgroundOpacity={0.5}
            padding={0.1}
          >
            RECURSIVE COLLAPSE
          </Text>
        </group>
      )}

      {/* Scene indicator */}
      <SceneIndicator currentScene={currentScene} totalScenes={totalScenes} />
    </group>
  )
}

function SceneIndicator({ currentScene, totalScenes }) {
  return (
    <group position={[0, -2.5, 0]}>
      {Array.from({ length: totalScenes }).map((_, i) => (
        <mesh key={`indicator-${i}`} position={[(i - (totalScenes - 1) / 2) * 0.3, 0, 0]}>
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

// Original components from the first version
function FlowerOfLife({ position, time }) {
  const groupRef = useRef()
  const circleCount = 7
  const radius = 1.2

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.1
      groupRef.current.scale.x = 0.8 + Math.sin(time * 0.2) * 0.1
      groupRef.current.scale.y = 0.8 + Math.sin(time * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: circleCount }).map((_, i) => {
        const angle = (i / circleCount) * Math.PI * 2
        const x = Math.cos(angle) * radius * 0.5
        const y = Math.sin(angle) * radius * 0.5

        return (
          <CircleGeometry
            key={`flower-circle-${i}`}
            position={[x, y, 0]}
            radius={radius}
            color={COLORS.cyan[i % COLORS.cyan.length]}
            time={time}
            opacity={0.5}
          />
        )
      })}
    </group>
  )
}

function CircleGeometry({ position, radius, color, time, opacity = 1 }) {
  const meshRef = useRef()
  const segments = 16 // Low poly for 16-bit aesthetic

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <circleGeometry args={[radius, segments]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  )
}

function SriYantra({ position, time, scale = 1 }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time * 0.1) * 0.2
      groupRef.current.position.z = Math.sin(time * 0.2) * 0.5
    }
  })

  // Create triangles for Sri Yantra
  const createTriangle = (size, rotation, color, yOffset = 0, index) => {
    const points = []
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + rotation
      points.push([Math.cos(angle) * size, Math.sin(angle) * size + yOffset, 0])
    }

    return (
      <line key={`triangle-${index}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={2} />
      </line>
    )
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Upward triangles */}
      {Array.from({ length: 5 }).map((_, i) =>
        createTriangle(1 + i * 0.2, 0, COLORS.magenta[i % COLORS.magenta.length], 0, `up-${i}`),
      )}

      {/* Downward triangles */}
      {Array.from({ length: 4 }).map((_, i) =>
        createTriangle(1.1 + i * 0.2, Math.PI, COLORS.gold[i % COLORS.gold.length], 0, `down-${i}`),
      )}

      {/* Center eye */}
      <mesh position={[0, 0, 0.1]} key="outer-eye">
        <circleGeometry args={[0.2, 16]} />
        <meshBasicMaterial color={COLORS.white[0]} />
      </mesh>
      <mesh position={[0, 0, 0.2]} key="inner-eye">
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color={COLORS.black} />
      </mesh>
    </group>
  )
}

function MerkabaStars({ position, time }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2
      groupRef.current.rotation.z = time * 0.1

      // Pulse effect
      const pulse = Math.sin(time * 2) * 0.1 + 1
      groupRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Upward tetrahedron */}
      <Star points={6} innerRadius={0.5} outerRadius={1} color={COLORS.cyan[2]} rotation={[0, 0, 0]} />

      {/* Downward tetrahedron */}
      <Star points={6} innerRadius={0.5} outerRadius={1} color={COLORS.magenta[2]} rotation={[0, 0, Math.PI / 6]} />
    </group>
  )
}

function Star({ points, innerRadius, outerRadius, color, rotation = [0, 0, 0] }) {
  const vertices = []
  const numPoints = points * 2

  for (let i = 0; i < numPoints; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i / numPoints) * Math.PI * 2
    vertices.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
  }

  // Add the first point again to close the shape
  vertices.push(vertices[0], vertices[1], vertices[2])

  return (
    <line rotation={rotation}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={vertices.length / 3}
          array={new Float32Array(vertices)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  )
}

function PixelatedParticles({ count, time }) {
  const points = useMemo(() => {
    const tempPoints = []
    const tempColors = []
    const colorOptions = [...COLORS.cyan, ...COLORS.magenta, ...COLORS.gold, ...COLORS.white]

    // Generate points in a spherical distribution
    for (let i = 0; i < count; i++) {
      // Parametric equations for points on a torus knot
      const t = (i / count) * Math.PI * 2
      const p = 2 // Number of twists
      const q = 3 // Number of winds

      const r = 2.5

      const x = r * Math.cos(p * t) * Math.cos(q * t)
      const y = r * Math.cos(p * t) * Math.sin(q * t)
      const z = r * Math.sin(p * t)

      tempPoints.push(x, y, z)

      // Assign a color from our 16-bit palette
      const colorIndex = Math.floor(Math.random() * colorOptions.length)
      const color = colorOptions[colorIndex]
      const rgb = hexToRgb(color)
      tempColors.push(rgb.r / 255, rgb.g / 255, rgb.b / 255)
    }

    return { positions: tempPoints, colors: tempColors }
  }, [count])

  const pointsRef = useRef()

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1

      // Update positions for animation
      const positions = pointsRef.current.geometry.attributes.position.array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const t = (i / count) * Math.PI * 2 + time * 0.2
        const p = 2
        const q = 3

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
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} />
    </points>
  )
}

// SIMPLIFIED SCENE COMPONENTS

// Simplified Vector Field Scene
function SimpleVectorField({ time }) {
  const groupRef = useRef()

  // Use useMemo to create the arrows only once
  const arrows = useMemo(() => {
    const result = []
    const gridSize = 5
    const spacing = 0.4

    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let y = -gridSize / 2; y < gridSize / 2; y++) {
        // Skip some vectors for a more sparse field
        if (Math.random() > 0.7) continue

        const xPos = x * spacing
        const yPos = y * spacing

        // Calculate vector direction
        const angle = (Math.sin(xPos * 0.5) + Math.cos(yPos * 0.5)) * Math.PI
        const length = 0.15 + Math.sin(xPos * yPos * 0.1) * 0.05

        result.push({
          position: [xPos, yPos, 0],
          angle,
          length,
          color: COLORS.cyan[Math.floor(Math.random() * COLORS.cyan.length)],
        })
      }
    }

    return result
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {arrows.map((arrow, i) => (
        <group
          key={`arrow-${i}`}
          position={arrow.position}
          rotation={[0, 0, arrow.angle + Math.sin(time * 2 + i) * 0.1]}
        >
          {/* Arrow line */}
          <mesh position={[arrow.length / 2, 0, 0]}>
            <boxGeometry args={[arrow.length, 0.02, 0.02]} />
            <meshBasicMaterial color={arrow.color} />
          </mesh>

          {/* Arrow head */}
          <mesh position={[arrow.length, 0, 0]}>
            <coneGeometry args={[0.05, 0.1, 4]} rotation={[0, 0, Math.PI / 2]} />
            <meshBasicMaterial color={arrow.color} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Simplified Gradient Scene
function SimpleGradient({ time }) {
  const meshRef = useRef()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = time * 0.1
    }
  })

  // Create a gradient effect with basic materials
  return (
    <group>
      {Array.from({ length: 5 }).map((_, i) => {
        const scale = 4 - i * 0.5
        return (
          <mesh key={`gradient-${i}`} position={[0, 0, -0.1 * i]} ref={i === 0 ? meshRef : null}>
            <planeGeometry args={[scale, scale]} />
            <meshBasicMaterial color={COLORS.cyan[i % COLORS.cyan.length]} transparent opacity={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

// Simplified Voxel Grid
function SimpleVoxelGrid({ time }) {
  const groupRef = useRef()

  // Use useMemo to create the voxels only once
  const voxels = useMemo(() => {
    const result = []
    const gridSize = 4

    for (let x = -gridSize / 2; x < gridSize / 2; x++) {
      for (let z = -gridSize / 2; z < gridSize / 2; z++) {
        if ((x + z) % 2 === 0) {
          const height = 0.1 + Math.random() * 0.2
          result.push({
            position: [x * 0.3, 0, z * 0.3],
            height,
            color: COLORS.cyan[Math.floor(Math.random() * COLORS.cyan.length)],
          })
        }
      }
    }

    return result
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {voxels.map((voxel, i) => (
        <mesh
          key={`voxel-${i}`}
          position={[
            voxel.position[0],
            voxel.position[1] + voxel.height / 2 + Math.sin(time * 2 + i) * 0.05,
            voxel.position[2],
          ]}
        >
          <boxGeometry args={[0.25, voxel.height, 0.25]} />
          <meshBasicMaterial color={voxel.color} />
        </mesh>
      ))}
    </group>
  )
}

// Simplified Recursive Pattern
function SimpleRecursivePattern({ time }) {
  const spiralRef = useRef()

  // Use useMemo to create the points only once
  const pointsData = useMemo(() => {
    const points = []
    const colors = []
    const count = 100

    for (let i = 0; i < count; i++) {
      const t = i / count
      const angle = t * Math.PI * 8
      const radius = t * 1.5

      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = 0

      points.push(x, y, z)

      // Colors
      const colorChoice = i % 2 === 0 ? COLORS.cyan[1] : COLORS.magenta[1]
      const rgb = hexToRgb(colorChoice)
      colors.push(rgb.r / 255, rgb.g / 255, rgb.b / 255)
    }

    return { points, colors }
  }, [])

  useFrame(() => {
    if (spiralRef.current) {
      spiralRef.current.rotation.z = time * 0.2
    }
  })

  return (
    <group ref={spiralRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointsData.points.length / 3}
            array={new Float32Array(pointsData.points)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={pointsData.colors.length / 3}
            array={new Float32Array(pointsData.colors)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors />
      </points>
    </group>
  )
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace("#", "")

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}
