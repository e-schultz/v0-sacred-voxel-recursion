"use client"

import { memo, useRef } from "react"
import { useFrame } from "@react-three/fiber"

export const CircleGeometry = memo(({ position, radius, color, time, opacity = 1 }) => {
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
})

CircleGeometry.displayName = "CircleGeometry"
