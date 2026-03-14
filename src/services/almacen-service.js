import { api } from 'boot/axios'

export async function listAlmacen(params = {}) {
  const { data } = await api.get('/api/almacen', { params })
  return data
}

export async function showAlmacen(id) {
  const { data } = await api.get(`/api/almacen/${id}`)
  return data
}
