"use client"

import { memo, useMemo } from "react"

export const Star = memo(({ points, innerRadius, outerRadius, color, rotation = [0, 0, 0] }) => {
  // Pre-calculate vertices
  const vertices = useMemo(() => {
    const result = []
    const numPoints = points * 2

    for (let i = 0; i < numPoints; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i / numPoints) * Math.PI * 2
      result.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
    }

    // Add the first point again to close the shape
    result.push(result[0], result[1], result[2])

    return result
  }, [points, innerRadius, outerRadius])

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
})

Star.displayName = "Star"
