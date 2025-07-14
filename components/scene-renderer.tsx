"use client"

import { memo, useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"
import { useAnimation } from "./animation-context"
import SceneIndicator from "./scene-indicator"
import { SceneOne, SceneTwo, SceneThree, SceneFour, SceneFive } from "./scenes"

// Main scene renderer component - responsible for managing which scenes are visible
const SceneRenderer = () => {
  const { currentScene, previousScene, transitioning, transitionProgress } = useAnimation()
  const { gl, scene } = useThree()
  const prevTransitionRef = useRef(transitioning)

  // Force material updates when transitioning state changes
  useEffect(() => {
    if (transitioning !== prevTransitionRef.current) {
      // Force all materials to update when transition state changes
      scene.traverse((object) => {
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              if (mat.opacity !== undefined) {
                // Ensure transparent is set if using opacity
                mat.transparent = true
                // Force material update
                mat.needsUpdate = true
              }
            })
          } else if (object.material.opacity !== undefined) {
            // Ensure transparent is set if using opacity
            object.material.transparent = true
            // Force material update
            object.material.needsUpdate = true
          }
        }

        // Remove attempts to modify read-only properties
      })

      prevTransitionRef.current = transitioning
    }
  }, [transitioning, scene])

  // Determine which scenes should be rendered - only render active scenes
  const renderScene0 = currentScene === 0 || (transitioning && previousScene === 0)
  const renderScene1 = currentScene === 1 || (transitioning && previousScene === 1)
  const renderScene2 = currentScene === 2 || (transitioning && previousScene === 2)
  const renderScene3 = currentScene === 3 || (transitioning && previousScene === 3)
  const renderScene4 = currentScene === 4 || (transitioning && previousScene === 4)

  // Calculate scale for each scene based on transition state
  const getSceneScale = (sceneId) => {
    if (transitioning) {
      if (previousScene === sceneId) return 1 - transitionProgress
      if (currentScene === sceneId) return transitionProgress
    }
    return 1
  }

  // Calculate opacity for each scene based on transition state
  const getSceneOpacity = (sceneId) => {
    if (transitioning) {
      if (previousScene === sceneId) return 1 - transitionProgress
      if (currentScene === sceneId) return transitionProgress
    }
    return 1
  }

  return (
    <>
      {/* Only render scenes that are active or were just active */}
      {renderScene0 && (
        <SceneOne
          scale={getSceneScale(0)}
          opacity={getSceneOpacity(0)}
          visible={true} // Always keep visible during transitions
        />
      )}

      {renderScene1 && <SceneTwo scale={getSceneScale(1)} opacity={getSceneOpacity(1)} visible={true} />}

      {renderScene2 && <SceneThree scale={getSceneScale(2)} opacity={getSceneOpacity(2)} visible={true} />}

      {renderScene3 && <SceneFour scale={getSceneScale(3)} opacity={getSceneOpacity(3)} visible={true} />}

      {renderScene4 && <SceneFive scale={getSceneScale(4)} opacity={getSceneOpacity(4)} visible={true} />}

      {/* Scene indicator dots */}
      <SceneIndicator />
    </>
  )
}

export default memo(SceneRenderer)
