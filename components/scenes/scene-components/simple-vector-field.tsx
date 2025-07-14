"use client"

import { memo, useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS } from "@/components/animation-context"

export const SimpleVectorField = memo(({ time, opacity = 1 }) => {
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
          // Use brighter colors for better visibility
          color: COLORS.cyan[Math.floor(Math.random() * 3)],
        })
      }
    }

    return result
  }, [])

  // Update material opacity when opacity prop changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((object) => {
        if (object.material) {
          object.material.transparent = true
          object.material.opacity = opacity
          object.material.needsUpdate = true
        }
      })
    }
  }, [opacity])

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
            <meshBasicMaterial color={arrow.color} transparent={true} opacity={opacity} />
          </mesh>

          {/* Arrow head */}
          <mesh position={[arrow.length, 0, 0]}>
            <coneGeometry args={[0.05, 0.1, 4]} rotation={[0, 0, Math.PI / 2]} />
            <meshBasicMaterial color={arrow.color} transparent={true} opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  )
})

SimpleVectorField.displayName = "SimpleVectorField"
