import { defineStore } from 'pinia'
import { csrfCookie, loginRequest, logoutRequest, meRequest } from 'src/services/auth-service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false,
    backendUnavailable: false,
    fetchMePromise: null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user),
  },

  actions: {
    setBackendStatus(error) {
      const noResponse = !error?.response
      const networkError = error?.code === 'ERR_NETWORK'
      this.backendUnavailable = noResponse || networkError
    },

    async getCsrfCookie() {
      await csrfCookie()
    },

    async fetchMe() {
      if (this.fetchMePromise) {
        return this.fetchMePromise
      }

      this.loading = true

      this.fetchMePromise = (async () => {
        try {
          const data = await meRequest()
          this.user = data
          this.backendUnavailable = false
          return data
        } catch (error) {
          this.setBackendStatus(error)
          this.user = null
          return null
        } finally {
          this.loading = false
          this.initialized = true
          this.fetchMePromise = null
        }
      })()

      return this.fetchMePromise
    },

    async login(credentials) {
      this.loading = true
      this.backendUnavailable = false

      try {
        await this.getCsrfCookie()
        try {
          await loginRequest(credentials)
        } catch (error) {
          if (error?.response?.status === 419) {
            await this.getCsrfCookie()
            await loginRequest(credentials)
          } else {
            throw error
          }
        }

        return await this.fetchMe()
      } catch (error) {
        this.setBackendStatus(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true

      try {
        await logoutRequest()
        this.backendUnavailable = false
      } catch (error) {
        this.setBackendStatus(error)
      } finally {
        this.user = null
        this.loading = false
        this.initialized = true
      }
    },
  },
})
