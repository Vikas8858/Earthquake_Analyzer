import React, { useEffect, useState } from 'react'
import { fetchEarthquakes } from './Services/usgs'
import EarthquakeMap from './Components/EarthquakeMap'
import FilterBar from './Components/FilterBar'
import EarthquakeList from './Components/EarthquakeList'

export default function App() {
  const [allQuakes, setAllQuakes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // filters
  const [minMag, setMinMag] = useState(0)
  const [timeRange, setTimeRange] = useState('day') // hour/day/week/month
  const [search, setSearch] = useState('')

  // selected quake id (click list -> center map)
  const [selectedId, setSelectedId] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchEarthquakes(timeRange)
      // keep features array
      setAllQuakes(data.features || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load earthquakes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  // apply filters
  const filtered = allQuakes.filter((f) => {
    const mag = f.properties.mag ?? 0
    if (mag < minMag) return false
    if (search.trim()) {
      const place = (f.properties.place || '').toLowerCase()
      if (!place.includes(search.trim().toLowerCase())) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900">
      <header className="sticky top-0 z-20 p-4 bg-white shadow">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Earthquake Visualizer</h1>
          <div className="text-sm text-slate-600">Source: USGS</div>
        </div>
      </header>

      <main className="max-w-6xl p-4 mx-auto">
        <FilterBar
          minMag={minMag}
          setMinMag={setMinMag}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          search={search}
          setSearch={setSearch}
          onRefresh={load}
        />

        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
          <div className="md:col-span-2 h-[70vh] bg-white rounded shadow overflow-hidden">
            <EarthquakeMap
              earthquakes={filtered}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
            />
          </div>

          <div className="h-[70vh] overflow-auto bg-white rounded shadow p-2">
            <EarthquakeList
              earthquakes={filtered}
              loading={loading}
              error={error}
              onSelect={(id) => setSelectedId(id)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
