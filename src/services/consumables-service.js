import { api } from 'boot/axios'

export async function listConsumables(params = {}) {
  const { data } = await api.get('/api/consumables', { params })
  return data
}

export async function createConsumable(payload) {
  const { data } = await api.post('/api/consumables', payload)
  return data
}

export async function showConsumable(id) {
  const { data } = await api.get(`/api/consumables/${id}`)
  return data
}

export async function updateConsumable(id, payload) {
  const { data } = await api.put(`/api/consumables/${id}`, payload)
  return data
}

export async function deleteConsumable(id) {
  const { data } = await api.delete(`/api/consumables/${id}`)
  return data
}
