import React, { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'

// small helpers
function getColor(mag) {
  if (mag >= 6) return '#b10026'
  if (mag >= 5) return '#e31a1c'
  if (mag >= 4) return '#fc4e2a'
  if (mag >= 3) return '#fd8d3c'
  if (mag >= 2) return '#feb24c'
  return '#ffeda0'
}

function MapController({ earthquakes, selectedId }) {
  const map = useMap()

  useEffect(() => {
    if (!earthquakes || earthquakes.length === 0) return

    if (selectedId) {
      const sel = earthquakes.find((e) => e.id === selectedId)
      if (sel) {
        const [lon, lat] = sel.geometry.coordinates
        map.setView([lat, lon], 6, { animate: true })
        return
      }
    }

    // fit bounds to all markers
    const latlngs = earthquakes
      .map((e) => {
        const coords = e.geometry?.coordinates
        if (!coords) return null
        return [coords[1], coords[0]]
      })
      .filter(Boolean)

    if (latlngs.length) {
      map.fitBounds(latlngs, { padding: [50, 50] })
    }
  }, [earthquakes, selectedId, map])

  return null
}

export default function EarthquakeMap({ earthquakes = [], selectedId, onSelect }) {
  // default world center
  const center = [20, 0]

  return (
    <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController earthquakes={earthquakes} selectedId={selectedId} />

      {earthquakes.map((e) => {
        const coords = e.geometry?.coordinates
        if (!coords) return null
        const [lon, lat] = coords
        const mag = e.properties.mag ?? 0
        const radius = Math.max(4, (mag || 0) * 4) // visual radius

        return (
          <CircleMarker
            key={e.id}
            center={[lat, lon]}
            radius={radius}
            pathOptions={{ color: getColor(mag), fillOpacity: 0.6 }}
            eventHandlers={{
              click: () => onSelect && onSelect(e.id),
            }}
          >
            <Popup>
              <div style={{ minWidth: 200 }}>
                <div className="font-bold">M {mag.toFixed(1)}</div>
                <div className="text-sm">{e.properties.place}</div>
                <div className="text-xs text-slate-500">{new Date(e.properties.time).toLocaleString()}</div>
                <div className="text-xs">Depth: {(e.geometry.coordinates[2] ?? '?')} km</div>
                <a href={e.properties.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600">Details</a>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
