"use client"

import dynamic from "next/dynamic"

const GoogleMapView = dynamic(() => import("@/components/google-map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full rounded-xl bg-muted/50 animate-pulse">
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  ),
})

export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-[calc(100vh-4rem)]">
      <div className="flex-1 rounded-xl bg-muted/50 overflow-hidden">
        <GoogleMapView />
      </div>
    </div>
  )
}
