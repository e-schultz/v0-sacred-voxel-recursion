"use client"

import { memo } from "react"
import { useAnimation, COLORS, SCENES } from "./animation-context"

// Scene indicator component - shows which scene is active
const SceneIndicator = () => {
  const { currentScene, manuallyChangeScene } = useAnimation()

  return (
    <group position={[0, -2.5, 0]}>
      {SCENES.map((scene, i) => (
        <mesh
          key={`indicator-${i}`}
          position={[(i - (SCENES.length - 1) / 2) * 0.3, 0, 0]}
          onClick={() => manuallyChangeScene(i)}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color={i === currentScene ? COLORS.cyan[1] : COLORS.white[3]}
            transparent
            opacity={i === currentScene ? 1 : 0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

export default memo(SceneIndicator)

