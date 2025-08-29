import React from 'react'

export default function FilterBar({
  minMag,
  setMinMag,
  timeRange,
  setTimeRange,
  search,
  setSearch,
  onRefresh,
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded shadow md:flex-row">
      <div className="flex items-center gap-2">
        <label className="text-sm">Min magnitude:</label>
        <input
          type="range"
          min="0"
          max="8"
          step="0.1"
          value={minMag}
          onChange={(e) => setMinMag(Number(e.target.value))}
        />
        <span className="w-12 font-medium text-right">{minMag.toFixed(1)}</span>
      </div>

      <div>
        <label className="mr-2 text-sm">Time range:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="hour">Last hour</option>
          <option value="day">Last day</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search place (e.g. California)"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
