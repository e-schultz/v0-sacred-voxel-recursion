"use client"

import { memo, useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS } from "@/components/animation-context"

export const SriYantra = memo(({ position, time, scale = 1 }) => {
  const groupRef = useRef()

  // Pre-calculate triangles
  const triangles = useMemo(() => {
    const result = []

    // Upward triangles
    for (let i = 0; i < 5; i++) {
      result.push({
        size: 1 + i * 0.2,
        rotation: 0,
        color: COLORS.magenta[i % COLORS.magenta.length],
        yOffset: 0,
        key: `up-${i}`,
      })
    }

    // Downward triangles
    for (let i = 0; i < 4; i++) {
      result.push({
        size: 1.1 + i * 0.2,
        rotation: Math.PI,
        color: COLORS.gold[i % COLORS.gold.length],
        yOffset: 0,
        key: `down-${i}`,
      })
    }

    return result
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time * 0.1) * 0.2
      groupRef.current.position.z = Math.sin(time * 0.2) * 0.5
    }
  })

  // Create triangles for Sri Yantra
  const createTriangle = (size, rotation, color, yOffset = 0, key) => {
    const points = useMemo(() => {
      const result = []
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + rotation
        result.push([Math.cos(angle) * size, Math.sin(angle) * size + yOffset, 0])
      }
      return result
    }, [size, rotation, yOffset])

    return (
      <line key={key}>
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
      {/* Render pre-calculated triangles */}
      {triangles.map((triangle) =>
        createTriangle(triangle.size, triangle.rotation, triangle.color, triangle.yOffset, triangle.key),
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
})

SriYantra.displayName = "SriYantra"
