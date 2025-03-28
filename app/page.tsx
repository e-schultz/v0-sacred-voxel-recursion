"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { AnimationProvider } from "@/components/animation-context"

// Use dynamic import with ssr: false to prevent server-side rendering
const SacredGeometryAnimation = dynamic(() => import("@/components/sacred-geometry-animation"), { ssr: false })

const UIOverlay = dynamic(() => import("@/components/ui-overlay"), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <AnimationProvider>
        <Suspense fallback={<LoadingFallback />}>
          <SacredGeometryAnimation />
          <UIOverlay />
        </Suspense>
      </AnimationProvider>
    </main>
  )
}

// Simple loading fallback that works on both server and client
function LoadingFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="text-cyan-400 text-xl">Loading Sacred Geometry...</div>
    </div>
  )
}

