"use client"

import { memo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS } from "@/components/animation-context"
import { Star } from "./star"

export const MerkabaStars = memo(({ position, time }) => {
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
})

MerkabaStars.displayName = "MerkabaStars"
