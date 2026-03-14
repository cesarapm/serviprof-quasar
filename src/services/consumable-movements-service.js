import { api } from 'boot/axios'

export async function listConsumableMovements(params = {}) {
  const { data } = await api.get('/api/consumable-movements', { params })
  return data
}

export async function createConsumableMovement(payload) {
  const { data } = await api.post('/api/consumable-movements', payload)
  return data
}

export async function createConsumableMovementsBulk(payload) {
  const { data } = await api.post('/api/consumable-movements/bulk', payload)
  return data
}

export async function showConsumableMovement(id) {
  const { data } = await api.get(`/api/consumable-movements/${id}`)
  return data
}

export async function updateConsumableMovement(id, payload) {
  const { data } = await api.put(`/api/consumable-movements/${id}`, payload)
  return data
}

export async function deleteConsumableMovement(id) {
  const { data } = await api.delete(`/api/consumable-movements/${id}`)
  return data
}
