"use client"

import { memo, useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { COLORS } from "@/components/animation-context"

export const SimpleVoxelGrid = memo(({ time, opacity = 1 }) => {
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
            // Use brighter colors from the cyan palette
            color: COLORS.cyan[Math.floor(Math.random() * 3)], // Use only the first 3 brighter colors
          })
        }
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
          <meshBasicMaterial color={voxel.color} transparent={true} opacity={opacity} />
        </mesh>
      ))}
    </group>
  )
})

SimpleVoxelGrid.displayName = "SimpleVoxelGrid"
