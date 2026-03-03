import { api } from 'boot/axios'

export async function listPersonnel(params = {}) {
  const { data } = await api.get('/api/personnel', { params })
  return data
}
