"use client"

import { useCallback, useState, useRef, useEffect, useMemo } from "react"
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
} from "@react-google-maps/api"

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "0.75rem",
  minHeight: "400px",
}

// Default center (New Delhi, India)
const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
}

// Demo worker definition
interface DemoWorker {
  id: string
  name: string
  role: string
  color: string
  borderColor: string
  initials: string
  // Offset from user location in degrees (~111m per 0.001 deg)
  latOffset: number
  lngOffset: number
  status: "active" | "idle" | "busy"
}

const demoWorkers: DemoWorker[] = [
  { id: "w1", name: "Aarav Sharma", role: "Delivery Partner", color: "linear-gradient(135deg, #10b981, #059669)", borderColor: "#34d399", initials: "AS", latOffset: 0.003, lngOffset: 0.002, status: "active" },
  { id: "w2", name: "Priya Patel", role: "Field Inspector", color: "linear-gradient(135deg, #f59e0b, #d97706)", borderColor: "#fbbf24", initials: "PP", latOffset: -0.002, lngOffset: 0.004, status: "active" },
  { id: "w3", name: "Rohan Gupta", role: "Maintenance Crew", color: "linear-gradient(135deg, #ef4444, #dc2626)", borderColor: "#f87171", initials: "RG", latOffset: 0.005, lngOffset: -0.003, status: "busy" },
  { id: "w4", name: "Sneha Reddy", role: "Survey Agent", color: "linear-gradient(135deg, #8b5cf6, #7c3aed)", borderColor: "#a78bfa", initials: "SR", latOffset: -0.004, lngOffset: -0.002, status: "active" },
  { id: "w5", name: "Vikram Singh", role: "Delivery Partner", color: "linear-gradient(135deg, #06b6d4, #0891b2)", borderColor: "#22d3ee", initials: "VS", latOffset: 0.001, lngOffset: -0.005, status: "idle" },
  { id: "w6", name: "Ananya Iyer", role: "Health Worker", color: "linear-gradient(135deg, #ec4899, #db2777)", borderColor: "#f472b6", initials: "AI", latOffset: -0.006, lngOffset: 0.001, status: "active" },
  { id: "w7", name: "Karan Mehta", role: "Electrician", color: "linear-gradient(135deg, #f97316, #ea580c)", borderColor: "#fb923c", initials: "KM", latOffset: 0.004, lngOffset: 0.005, status: "busy" },
  { id: "w8", name: "Divya Nair", role: "Plumber", color: "linear-gradient(135deg, #14b8a6, #0d9488)", borderColor: "#2dd4bf", initials: "DN", latOffset: -0.001, lngOffset: -0.006, status: "idle" },
]

// Dark-themed map styles
const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8892b0" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c8d6e5" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6c7a89" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#16213e" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a7c59" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a2a4a" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a3e" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3a3a6a" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a1a3e" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0b8c8" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2a2a4a" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8892b0" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1538" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a5568" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0e1538" }],
  },
]

// Worker avatar overlay component
function WorkerAvatarOverlay({
  worker,
  onClick,
}: {
  worker: DemoWorker
  onClick: () => void
}) {
  const statusColor =
    worker.status === "active"
      ? "#10b981"
      : worker.status === "busy"
        ? "#ef4444"
        : "#eab308"

  return (
    <div
      style={{ transform: "translate(-50%, -50%)", cursor: "pointer" }}
      onClick={onClick}
    >
      {/* Avatar circle */}
      <div
        style={{
          position: "relative",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `2.5px solid ${worker.borderColor}`,
          background: worker.color,
          boxShadow: `0 0 10px ${worker.borderColor}44, 0 2px 8px rgba(0,0,0,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            letterSpacing: 0.5,
          }}
        >
          {worker.initials}
        </span>

        {/* Status dot */}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: statusColor,
            border: "2px solid #1a1a2e",
            boxShadow: `0 0 6px ${statusColor}88`,
          }}
        />
      </div>
    </div>
  )
}

// User avatar overlay component
function UserAvatarOverlay({ heading }: { heading: number | null }) {
  return (
    <div style={{ transform: "translate(-50%, -50%)" }}>
      {/* Pulsing ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.15)",
          animation: "pulse-ring 2s ease-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.25)",
          animation: "pulse-ring 2s ease-out infinite 0.5s",
        }}
      />

      {/* Direction arrow */}
      {heading !== null && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${heading}deg)`,
            width: 0,
            height: 0,
            marginTop: -28,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "14px solid #818cf8",
            filter: "drop-shadow(0 0 4px rgba(99,102,241,0.6))",
          }}
        />
      )}

      {/* Avatar circle */}
      <div
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid #818cf8",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          boxShadow:
            "0 0 12px rgba(99,102,241,0.5), 0 0 24px rgba(99,102,241,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* User icon SVG */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {/* "You" label */}
      </div>
      <div
        style={{
          position: "absolute",
          top: 38,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 9,
          fontWeight: 700,
          color: "#818cf8",
          background: "rgba(15,15,30,0.85)",
          padding: "1px 6px",
          borderRadius: 4,
          whiteSpace: "nowrap",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: 0.5,
        }}
      >
        YOU
      </div>

      {/* Inject keyframe animation */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function GoogleMapView() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  })

  const [selectedWorker, setSelectedWorker] = useState<DemoWorker | null>(null)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [heading, setHeading] = useState<number | null>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [hasCentered, setHasCentered] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

  // Live GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(newPos)
        setGpsError(null)

        if (position.coords.heading !== null && !isNaN(position.coords.heading)) {
          setHeading(position.coords.heading)
        }

        // Center map on first GPS fix
        if (!hasCentered && mapRef.current) {
          mapRef.current.panTo(newPos)
          mapRef.current.setZoom(15)
          setHasCentered(true)
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError("Location access denied")
            break
          case error.POSITION_UNAVAILABLE:
            setGpsError("Location unavailable")
            break
          case error.TIMEOUT:
            setGpsError("Location request timed out")
            break
          default:
            setGpsError("An unknown error occurred")
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [hasCentered])

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map
      // If we already have location before map loads, center immediately
      if (userLocation && !hasCentered) {
        map.panTo(userLocation)
        map.setZoom(15)
        setHasCentered(true)
      }
    },
    [userLocation, hasCentered]
  )

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  // Re-center button handler
  const handleRecenter = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation)
      mapRef.current.setZoom(15)
    }
  }, [userLocation])

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl bg-muted/50 border border-red-500/20">
        <div className="text-center space-y-2">
          <div className="text-red-400 text-lg font-semibold">
            Failed to load map
          </div>
          <p className="text-sm text-muted-foreground">
            Check your Google Maps API key
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl bg-muted/50 animate-pulse">
        <div className="text-center space-y-3">
          <div className="relative mx-auto w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Loading map…</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={5}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: darkMapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Demo worker avatars (positioned relative to user) */}
        {userLocation &&
          demoWorkers.map((worker) => (
            <OverlayView
              key={worker.id}
              position={{
                lat: userLocation.lat + worker.latOffset,
                lng: userLocation.lng + worker.lngOffset,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <WorkerAvatarOverlay
                worker={worker}
                onClick={() => setSelectedWorker(worker)}
              />
            </OverlayView>
          ))}

        {/* Worker info popup */}
        {selectedWorker && userLocation && (
          <OverlayView
            position={{
              lat: userLocation.lat + selectedWorker.latOffset,
              lng: userLocation.lng + selectedWorker.lngOffset,
            }}
            mapPaneName={OverlayView.FLOAT_PANE}
          >
            <div
              style={{
                transform: "translate(-50%, -120%)",
                background: "rgba(15, 15, 30, 0.95)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${selectedWorker.borderColor}44`,
                borderRadius: 12,
                padding: "10px 14px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                minWidth: 160,
                cursor: "default",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: selectedWorker.color,
                    border: `2px solid ${selectedWorker.borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "white",
                    fontFamily: "system-ui",
                  }}
                >
                  {selectedWorker.initials}
                </div>
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, fontFamily: "system-ui" }}>
                    {selectedWorker.name}
                  </div>
                  <div style={{ color: "#8892b0", fontSize: 11, fontFamily: "system-ui" }}>
                    {selectedWorker.role}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      selectedWorker.status === "active"
                        ? "#10b981"
                        : selectedWorker.status === "busy"
                          ? "#ef4444"
                          : "#eab308",
                  }}
                />
                <span style={{ color: "#94a3b8", fontSize: 11, fontFamily: "system-ui", textTransform: "capitalize" }}>
                  {selectedWorker.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 8,
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: 1,
                  padding: 2,
                }}
              >
                ×
              </button>
            </div>
          </OverlayView>
        )}

        {/* Live user avatar */}
        {userLocation && (
          <OverlayView
            position={userLocation}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <UserAvatarOverlay heading={heading} />
          </OverlayView>
        )}
      </GoogleMap>

      {/* GPS status badge */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 12,
            background: "rgba(15, 15, 30, 0.85)",
            backdropFilter: "blur(12px)",
            border: gpsError
              ? "1px solid rgba(239,68,68,0.3)"
              : userLocation
                ? "1px solid rgba(99,102,241,0.3)"
                : "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: gpsError
                ? "#ef4444"
                : userLocation
                  ? "#6366f1"
                  : "#eab308",
              boxShadow: gpsError
                ? "0 0 8px rgba(239,68,68,0.5)"
                : userLocation
                  ? "0 0 8px rgba(99,102,241,0.5)"
                  : "0 0 8px rgba(234,179,8,0.5)",
              animation: userLocation && !gpsError ? "blink 2s infinite" : "none",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: gpsError ? "#fca5a5" : "#c8d6e5",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {gpsError
              ? gpsError
              : userLocation
                ? `Live — ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : "Acquiring GPS…"}
          </span>
        </div>
      </div>

      {/* Re-center button */}
      {userLocation && (
        <button
          onClick={handleRecenter}
          title="Center on my location"
          style={{
            position: "absolute",
            bottom: 24,
            right: 16,
            zIndex: 10,
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "1px solid rgba(99,102,241,0.3)",
            background: "rgba(15, 15, 30, 0.85)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(99,102,241,0.2)"
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(15, 15, 30, 0.85)"
            e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
      )}

      {/* Blink animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
