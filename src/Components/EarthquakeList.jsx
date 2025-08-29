import React from 'react'

// helper
function formatTime(ms) {
  if (!ms) return '-'
  const d = new Date(ms)
  return d.toLocaleString()
}

export default function EarthquakeList({ earthquakes, loading, error, onSelect }) {
  if (loading) return <div className="p-4">Loading…</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>
  if (!earthquakes.length) return <div className="p-4">No earthquakes match the filters.</div>

  const sorted = [...earthquakes].sort((a, b) => (b.properties.mag || 0) - (a.properties.mag || 0))

  return (
    <div className="divide-y">
      {sorted.map((q) => {
        const { id, properties } = q
        const mag = properties.mag ?? 0
        const place = properties.place ?? 'Unknown'
        const time = properties.time

        return (
          <div
            key={id}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50"
            onClick={() => onSelect(id)}
          >
            <div>
              <div className="font-semibold">M {mag.toFixed(1)} — {place}</div>
              <div className="text-sm text-slate-500">{formatTime(time)}</div>
            </div>
            <div className="text-sm text-slate-600">{(properties.depth ?? '')}</div>
          </div>
        )
      })}
    </div>
  )
}
