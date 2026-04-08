"use client"

import dynamic from "next/dynamic"

const GoogleMapView = dynamic(() => import("@/components/google-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-muted/50 animate-pulse">
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  ),
})

export default function MapPage() {
  return (
    <div className="h-screen w-full">
      <GoogleMapView />
    </div>
  )
}
