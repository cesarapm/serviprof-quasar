<template>
  <q-page class="row items-center justify-center q-pa-md">
    <q-card style="width: 100%; max-width: 400px">
      <q-card-section>
        <div class="text-h6">Iniciar sesión</div>
      </q-card-section>

      <q-card-section>
        <q-banner
          v-if="auth.backendUnavailable"
          dense
          rounded
          class="bg-orange-1 text-orange-10 q-mb-md"
        >
          El backend no está disponible en este momento. Intenta de nuevo en unos minutos.
        </q-banner>

        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.email"
            type="email"
            label="Correo"
            autocomplete="username"
            outlined
            dense
            :disable="auth.loading"
            :rules="[(val) => !!val || 'Correo requerido']"
          />

          <q-input
            v-model="form.password"
            type="password"
            label="Contraseña"
            autocomplete="current-password"
            outlined
            dense
            :disable="auth.loading"
            :rules="[(val) => !!val || 'Contraseña requerida']"
          />

          <q-banner v-if="errorMessage" dense rounded class="bg-red-1 text-red-8">
            {{ errorMessage }}
          </q-banner>

          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            :loading="auth.loading"
            label="Entrar"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

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
