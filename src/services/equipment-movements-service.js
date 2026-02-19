import { api } from 'boot/axios'

export async function listEquipmentMovements(params = {}) {
  const { data } = await api.get('/api/equipment-movements', { params })
  return data
}

export async function createEquipmentMovement(payload) {
  const { data } = await api.post('/api/equipment-movements', payload)
  return data
}

export async function showEquipmentMovement(id) {
  const { data } = await api.get(`/api/equipment-movements/${id}`)
  return data
}

export async function updateEquipmentMovement(id, payload) {
  const { data } = await api.put(`/api/equipment-movements/${id}`, payload)
  return data
}

export async function deleteEquipmentMovement(id) {
  const { data } = await api.delete(`/api/equipment-movements/${id}`)
  return data
}
