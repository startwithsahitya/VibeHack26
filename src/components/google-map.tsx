"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
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

interface MapMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  description?: string
}

const sampleMarkers: MapMarker[] = [
  {
    id: "1",
    position: { lat: 28.6139, lng: 77.209 },
    title: "New Delhi",
    description: "Capital city of India",
  },
  {
    id: "2",
    position: { lat: 19.076, lng: 72.8777 },
    title: "Mumbai",
    description: "Financial capital of India",
  },
  {
    id: "3",
    position: { lat: 12.9716, lng: 77.5946 },
    title: "Bangalore",
    description: "Silicon Valley of India",
  },
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

  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
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
        {/* Sample city markers */}
        {sampleMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            onClick={() => setSelectedMarker(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <h3 className="font-semibold text-sm text-gray-900">
                {selectedMarker.title}
              </h3>
              {selectedMarker.description && (
                <p className="text-xs text-gray-600 mt-1">
                  {selectedMarker.description}
                </p>
              )}
            </div>
          </InfoWindow>
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
