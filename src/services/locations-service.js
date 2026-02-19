import { api } from 'boot/axios'

export async function listLocations(params = {}) {
  const { data } = await api.get('/api/locations', { params })
  return data
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
