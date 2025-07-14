"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { AnimationProvider } from "@/components/animation-context"
import ErrorBoundary from "@/components/error-boundary"

// Use dynamic import with ssr: false to prevent server-side rendering
const SacredGeometryAnimation = dynamic(() => import("@/components/sacred-geometry-animation"), { ssr: false })

const UIOverlay = dynamic(() => import("@/components/ui-overlay"), { ssr: false })

// Simple loading fallback that works on both server and client
function LoadingFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="text-cyan-400 text-xl">Loading Sacred Geometry...</div>
    </div>
  )
}

export default function SacredGeometryClient() {
  return (
    <AnimationProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <SacredGeometryAnimation />
          <UIOverlay />
        </Suspense>
      </ErrorBoundary>
    </AnimationProvider>
  )
}
