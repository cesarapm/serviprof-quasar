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

export async function updateEquipmentMovement(id, payload, partial = true) {
  const method = partial ? 'patch' : 'put'
  const { data } = await api[method](`/api/equipment-movements/${id}`, payload)
  return data
}

export async function deleteEquipmentMovement(id) {
  const { data } = await api.delete(`/api/equipment-movements/${id}`)
  return data
}
