import { api } from 'boot/axios'

export async function csrfCookie() {
  await api.get('/sanctum/csrf-cookie')
}

export async function loginRequest(credentials) {
  const { data } = await api.post('/api/login', credentials)
  return data
}

export async function meRequest() {
  const { data } = await api.get('/api/me')
  return data
}

export async function logoutRequest() {
  const { data } = await api.post('/api/logout')
  return data
}
