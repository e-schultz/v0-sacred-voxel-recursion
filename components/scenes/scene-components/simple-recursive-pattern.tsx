"use client"

import { memo, useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS, hexToRgb } from "@/components/animation-context"

export const SimpleRecursivePattern = memo(({ time, opacity = 1 }) => {
  const spiralRef = useRef()

  // Pre-calculate points and colors
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

      // Colors - use brighter colors for better visibility
      const colorChoice = i % 2 === 0 ? COLORS.cyan[0] : COLORS.magenta[0]
      const rgb = hexToRgb(colorChoice)
      colors.push(rgb.r / 255, rgb.g / 255, rgb.b / 255)
    }

    return { points, colors }
  }, [])

  // Update material opacity when opacity prop changes
  useEffect(() => {
    if (spiralRef.current && spiralRef.current.material) {
      spiralRef.current.material.transparent = true
      spiralRef.current.material.opacity = opacity
      spiralRef.current.material.needsUpdate = true
    }
  }, [opacity])

  useFrame(() => {
    if (spiralRef.current) {
      spiralRef.current.rotation.z = time * 0.2

      // Add some pulsing effect
      const scale = 1 + Math.sin(time) * 0.1
      spiralRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group>
      <points ref={spiralRef}>
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
        <pointsMaterial size={0.05} vertexColors transparent={true} opacity={opacity} />
      </points>
    </group>
  )
})

SimpleRecursivePattern.displayName = "SimpleRecursivePattern"

