"use client"

import { memo, useRef, useEffect } from "react"
import { Text } from "@react-three/drei"
import { useAnimation, COLORS } from "../animation-context"
import { SimpleVectorField } from "./scene-components/simple-vector-field"

// Scene Two: Vector Field Minimalism
const SceneTwo = ({ scale = 1, opacity = 1, visible = true }) => {
  const { time } = useAnimation()
  const groupRef = useRef()

  // Force material updates when opacity changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((object) => {
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              if (mat.opacity !== undefined) {
                mat.transparent = true
                mat.opacity = opacity
                mat.needsUpdate = true
              }
            })
          } else if (object.material.opacity !== undefined) {
            object.material.transparent = true
            object.material.opacity = opacity
            object.material.needsUpdate = true
          }
        }
      })
    }
  }, [opacity])

  return (
    <group ref={groupRef} scale={typeof scale === "number" ? [scale, scale, scale] : scale} visible={visible}>
      <SimpleVectorField time={time} opacity={opacity} />
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color={COLORS.white[0]}
        anchorX="center"
        anchorY="middle"
        backgroundColor={COLORS.black}
        backgroundOpacity={0.5 * opacity}
        padding={0.1}
        opacity={opacity}
      >
        VECTORFIELD MINIMALISM
      </Text>
    </group>
  )
}

export default memo(SceneTwo)

