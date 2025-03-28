"use client"

import { memo } from "react"
import { useAnimation } from "./animation-context"

// UI overlay component - displays frame count and scene name
const UIOverlay = () => {
  const { frame, currentScene, sceneNames, transitioning, transitionProgress } = useAnimation()

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-4 font-mono text-xs text-cyan-400 flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="border border-cyan-500 bg-black/50 p-2">SACRED GEOMETRY ENGINE v2.0</div>
        <div className="border border-magenta-500 bg-black/50 p-2">FRAME: {frame.toString().padStart(2, "0")}/60</div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="border border-gold-500 bg-black/50 p-2">
          SCENE: {sceneNames[currentScene]}
          {transitioning && ` (${Math.round(transitionProgress * 100)}%)`}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="border border-cyan-500 bg-black/50 p-2">SYSTEM: ACTIVE</div>
        <div className="border border-gold-500 bg-black/50 p-2">DEBUGGING MODE</div>
      </div>
    </div>
  )
}

export default memo(UIOverlay)

