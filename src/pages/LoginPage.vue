<template>
  <q-page class="spd-login-page row items-center justify-center">
    <q-card class="spd-login-card" flat>
      <!-- Header con logo -->
      <div class="spd-login-header">
        <div class="spd-login-logo">
          <q-icon name="inventory_2" size="32px" color="white" />
        </div>
        <div class="text-h5 text-white text-weight-bold q-mt-lg">Serviprof CRM</div>
        <div class="text-body2 q-mt-xs" style="color: rgba(255, 255, 255, 0.6)">
          Sistema de gestión de almacén
        </div>
      </div>

      <!-- Cuerpo del formulario -->
      <q-card-section class="q-pa-xl">
        <q-banner
          v-if="auth.backendUnavailable"
          dense
          rounded
          class="bg-orange-1 text-orange-10 q-mb-lg"
        >
          <template #avatar><q-icon name="wifi_off" color="orange" /></template>
          El backend no está disponible. Verifica que Laravel esté encendido.
        </q-banner>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.email"
            type="email"
            label="Correo electrónico"
            autocomplete="username"
            outlined
            :disable="auth.loading"
            :rules="[(val) => !!val || 'Correo requerido']"
          >
            <template #prepend><q-icon name="email" color="grey-5" /></template>
          </q-input>

          <q-input
            v-model="form.password"
            type="password"
            label="Contraseña"
            autocomplete="current-password"
            outlined
            :disable="auth.loading"
            :rules="[(val) => !!val || 'Contraseña requerida']"
          >
            <template #prepend><q-icon name="lock" color="grey-5" /></template>
          </q-input>

          <q-banner v-if="errorMessage" dense rounded class="bg-red-1 text-red-8 q-mt-sm">
            <template #avatar><q-icon name="error" color="negative" /></template>
            {{ errorMessage }}
          </q-banner>

          <q-btn
            type="submit"
            color="primary"
            unelevated
            class="full-width q-mt-sm"
            style="height: 44px; font-size: 15px; border-radius: 10px"
            :loading="auth.loading"
            label="Iniciar sesión"
            icon-right="arrow_forward"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
.spd-login-page {
  min-height: 100vh;
  padding: 24px;
}

.spd-login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4) !important;
}

.spd-login-header {
  background: linear-gradient(135deg, #1b3a6b 0%, #2563eb 100%);
  padding: 36px 40px 32px;
  text-align: center;
}

.spd-login-logo {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')

async function onSubmit() {
  errorMessage.value = ''

  try {
    await auth.login(form)
    await router.push('/')
  } catch (error) {
    errorMessage.value = auth.backendUnavailable
      ? 'No hay conexión con el backend. Verifica que Laravel esté encendido.'
      : error.response?.data?.message || 'No fue posible iniciar sesión. Verifica tus credenciales.'
  }
}
</script>
