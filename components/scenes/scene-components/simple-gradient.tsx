"use client"

import { memo, useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS } from "@/components/animation-context"

export const SimpleGradient = memo(({ time, opacity = 1 }) => {
  const groupRef = useRef()

  // Pre-calculate gradient layers
  const layers = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      scale: 4 - i * 0.5,
      color: COLORS.cyan[i % COLORS.cyan.length],
      zOffset: -0.1 * i,
      key: `gradient-${i}`,
    }))
  }, [])

  // Update material opacity when opacity prop changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((object) => {
        if (object.material) {
          object.material.transparent = true
          object.material.opacity = opacity * 0.3 // Keep the base opacity at 0.3
          object.material.needsUpdate = true
        }
      })
    }
  }, [opacity])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.1

      // Animate color intensity
      const children = groupRef.current.children
      children.forEach((child, i) => {
        if (child.material) {
          // Make the animation more noticeable
          child.material.opacity = (0.3 + Math.sin(time * 0.5 + i * 0.2) * 0.2) * opacity
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <mesh key={layer.key} position={[0, 0, layer.zOffset]}>
          <planeGeometry args={[layer.scale, layer.scale]} />
          <meshBasicMaterial color={layer.color} transparent={true} opacity={0.3 * opacity} />
        </mesh>
      ))}
    </group>
  )
})

SimpleGradient.displayName = "SimpleGradient"

