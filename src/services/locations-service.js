import { api } from 'boot/axios'

const LOCATIONS_BACKOFF_MS = 120000
let locationsBackoffUntil = 0

export async function listLocations(params = {}) {
  if (Date.now() < locationsBackoffUntil) {
    return []
  }

  try {
    const { data } = await api.get('/api/locations', { params })
    locationsBackoffUntil = 0
    return data
  } catch (error) {
    const status = error?.response?.status
    const isNetwork = !error?.response || error?.code === 'ERR_NETWORK'

    if (isNetwork || (typeof status === 'number' && status >= 500)) {
      locationsBackoffUntil = Date.now() + LOCATIONS_BACKOFF_MS
      return []
    }

    throw error
  }
}

export async function showLocation(id) {
  const { data } = await api.get(`/api/locations/${id}`)
  return data
}

export async function createLocation(payload) {
  const { data } = await api.post('/api/locations', payload)
  return data
}

export async function updateLocation(id, payload) {
  const { data } = await api.put(`/api/locations/${id}`, payload)
  return data
}

export async function deleteLocation(id) {
  await api.delete(`/api/locations/${id}`)
}
