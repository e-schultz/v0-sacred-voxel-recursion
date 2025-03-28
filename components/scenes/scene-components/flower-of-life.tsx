"use client"

import { memo, useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS } from "@/components/animation-context"
import { CircleGeometry } from "./circle-geometry"

// Update FlowerOfLife to handle opacity
export const FlowerOfLife = memo(({ position, time, opacity = 1 }) => {
  const groupRef = useRef()
  const circleCount = 7
  const radius = 1.2

  // Pre-calculate circle positions
  const circles = useMemo(() => {
    return Array.from({ length: circleCount }).map((_, i) => {
      const angle = (i / circleCount) * Math.PI * 2
      const x = Math.cos(angle) * radius * 0.5
      const y = Math.sin(angle) * radius * 0.5
      return {
        position: [x, y, 0],
        radius,
        color: COLORS.cyan[i % COLORS.cyan.length],
        key: `flower-circle-${i}`,
      }
    })
  }, [circleCount, radius])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.1
      groupRef.current.scale.x = 0.8 + Math.sin(time * 0.2) * 0.1
      groupRef.current.scale.y = 0.8 + Math.sin(time * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {circles.map((circle) => (
        <CircleGeometry
          key={circle.key}
          position={circle.position}
          radius={circle.radius}
          color={circle.color}
          time={time}
          opacity={opacity * 0.5}
        />
      ))}
    </group>
  )
})

FlowerOfLife.displayName = "FlowerOfLife"

