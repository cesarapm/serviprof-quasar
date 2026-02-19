import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://api.serviprofdigital.com.mx'
  : typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : 'http://127.0.0.1:8000'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
  },
})

export default defineBoot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        const requestUrl = String(error?.config?.url || '')
        const skipRedirect =
          requestUrl.includes('/api/me') ||
          requestUrl.includes('/api/login') ||
          requestUrl.includes('/sanctum/csrf-cookie')

        const currentPath = router.currentRoute.value.path

        if (!skipRedirect && currentPath !== '/login') {
          await router.push({ path: '/login', query: { redirect: currentPath } })
        }
      }

      return Promise.reject(error)
    },
  )
})

export { api }
