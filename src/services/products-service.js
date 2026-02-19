import { api } from 'boot/axios'

export async function listProducts(params = {}) {
  const { data } = await api.get('/api/products', { params })
  return data
}

export async function createProduct(payload) {
  const { data } = await api.post('/api/products', payload)
  return data
}

export async function getProduct(id) {
  const { data } = await api.get(`/api/products/${id}`)
  return data
}

export async function updateProduct(id, payload, partial = true) {
  const method = partial ? 'patch' : 'put'
  const { data } = await api[method](`/api/products/${id}`, payload)
  return data
}

export async function deleteProduct(id) {
  await api.delete(`/api/products/${id}`)
}
