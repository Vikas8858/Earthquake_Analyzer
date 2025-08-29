// simple USGS fetch wrapper
export async function fetchEarthquakes(range = 'day') {
  // range: 'hour' | 'day' | 'week' | 'month'
  const mapping = {
    hour: 'all_hour',
    day: 'all_day',
    week: 'all_week',
    month: 'all_month',
  }
  const feed = mapping[range] || mapping.day
  const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${feed}.geojson`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Network response was not ok')
  const data = await res.json()
  return data
}
