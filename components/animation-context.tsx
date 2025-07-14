"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

// Define the color palette once at the application level
export const COLORS = {
  cyan: ["#00ffff", "#00ccff", "#0099ff", "#0066ff", "#0033ff"],
  magenta: ["#ff00ff", "#ff0099", "#ff0066", "#ff0033", "#cc0066"],
  gold: ["#ffcc00", "#ffaa00", "#ff9900", "#ff6600", "#cc9900"],
  white: ["#ffffff", "#eeeeee", "#cccccc", "#aaaaaa", "#888888"],
  black: "#000000",
  grid: "#001122",
}

// Scene configuration
export const SCENES = [
  { id: 0, name: "SACRED GEOMETRY BASICS" },
  { id: 1, name: "VECTOR FIELD MINIMALISM" },
  { id: 2, name: "OSCILLATING GRADIENTS" },
  { id: 3, name: "VOXEL SIGIL INTERFACE" },
  { id: 4, name: "RECURSIVE COLLAPSE" },
]

// Animation timing constants
export const SCENE_DURATION = 10 // seconds per scene
export const TRANSITION_DURATION = 2.5 // slightly longer transitions for better effect

// Context type definitions
type AnimationContextType = {
  time: number
  setTime: React.Dispatch<React.SetStateAction<number>>
  frame: number
  currentScene: number
  previousScene: number | null
  transitioning: boolean
  transitionProgress: number
  sceneNames: string[]
  manuallyChangeScene: (sceneId: number) => void
}

// Create the context with default values
const AnimationContext = createContext<AnimationContextType>({
  time: 0,
  setTime: () => {},
  frame: 0,
  currentScene: 0,
  previousScene: null,
  transitioning: false,
  transitionProgress: 0,
  sceneNames: SCENES.map((scene) => scene.name),
  manuallyChangeScene: () => {},
})

// Provider component
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  // Centralized state management
  const [time, setTime] = useState(0)
  const [frame, setFrame] = useState(0)
  const [currentScene, setCurrentScene] = useState(0)
  const [previousScene, setPreviousScene] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [isBrowser, setIsBrowser] = useState(false)

  // Memoize scene names to prevent unnecessary re-renders
  const sceneNames = useMemo(() => SCENES.map((scene) => scene.name), [])

  // Check if we're in the browser
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Frame counter for UI display - only run on client
  useEffect(() => {
    if (!isBrowser) return

    const frameInterval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 60) // 60 frame animation cycle
    }, 1000 / 15) // 15 fps for retro feel

    return () => clearInterval(frameInterval)
  }, [isBrowser])

  // Scene transition timer - only run on client
  useEffect(() => {
    if (!isBrowser) return
    if (transitioning) return // Don't start a new timer if we're already transitioning

    const timer = setInterval(() => {
      const nextScene = (currentScene + 1) % SCENES.length
      setPreviousScene(currentScene)
      setTransitioning(true)
      setTransitionProgress(0)
      setCurrentScene(nextScene)
    }, SCENE_DURATION * 1000)

    return () => clearInterval(timer)
  }, [currentScene, transitioning, isBrowser])

  // Handle transition animation - smoother easing - only run on client
  useEffect(() => {
    if (!isBrowser) return
    if (!transitioning) return

    const transitionTimer = setInterval(() => {
      setTransitionProgress((prev) => {
        // Use easeInOutCubic for smoother transitions
        const newProgress = prev + 0.025
        if (newProgress >= 1) {
          setTransitioning(false)
          setPreviousScene(null)
          clearInterval(transitionTimer)
          return 1
        }
        return newProgress
      })
    }, 25) // Update every 25ms for smoother transition (40fps)

    return () => clearInterval(transitionTimer)
  }, [transitioning, isBrowser])

  // Manual scene change function
  const manuallyChangeScene = useCallback(
    (sceneId: number) => {
      if (sceneId === currentScene || transitioning) return

      setPreviousScene(currentScene)
      setTransitioning(true)
      setTransitionProgress(0)
      setCurrentScene(sceneId)
    },
    [currentScene, transitioning],
  )

  // Create the context value object - memoized to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      time,
      setTime,
      frame,
      currentScene,
      previousScene,
      transitioning,
      transitionProgress,
      sceneNames,
      manuallyChangeScene,
    }),
    [time, frame, currentScene, previousScene, transitioning, transitionProgress, sceneNames, manuallyChangeScene],
  )

  return <AnimationContext.Provider value={contextValue}>{children}</AnimationContext.Provider>
}

// Custom hook for consuming the context
export function useAnimation() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider")
  }
  return context
}

// Helper function to convert hex color to RGB - moved here to be reused
export function hexToRgb(hex: string) {
  // Remove # if present
  hex = hex.replace("#", "")

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}

// Add this helper function for easing
export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
