"use client"

import { memo, useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS, hexToRgb } from "@/components/animation-context"

export const PixelatedParticles = memo(({ count, time }) => {
  // Pre-calculate initial positions and colors
  const initialData = useMemo(() => {
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

  // Store animation parameters for each particle
  const animationParams = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5,
    }))
  }, [count])

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1

      // Update positions for animation - only update every other frame for performance
      if (Math.floor(time * 15) % 2 === 0) {
        const positions = pointsRef.current.geometry.attributes.position.array

        for (let i = 0; i < count; i++) {
          const i3 = i * 3
          const t = (i / count) * Math.PI * 2 + time * 0.2
          const p = 2
          const q = 3
          const { phase, speed } = animationParams[i]

          const r = 2.5 + Math.sin(t * speed + phase) * 0.2

          positions[i3] = r * Math.cos(p * t) * Math.cos(q * t)
          positions[i3 + 1] = r * Math.cos(p * t) * Math.sin(q * t)
          positions[i3 + 2] = r * Math.sin(p * t)
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true
      }
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={initialData.positions.length / 3}
          array={new Float32Array(initialData.positions)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={initialData.colors.length / 3}
          array={new Float32Array(initialData.colors)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} />
    </points>
  )
})

PixelatedParticles.displayName = "PixelatedParticles"
