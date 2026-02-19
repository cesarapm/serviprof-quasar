<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacén · Clientes</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Recargar"
          :loading="loading"
          @click="loadClients"
        />
      </div>
    </div>

    <q-banner
      v-if="backendUnavailable && rows.length === 0"
      dense
      rounded
      class="bg-orange-1 text-orange-10 q-mb-md"
    >
      No hay conexión con el backend. Verifica que Laravel esté encendido.
    </q-banner>

    <q-banner v-else-if="errorMessage" dense rounded class="bg-red-1 text-red-8 q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Nuevo cliente</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onCreateClient">
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.name"
              label="Nombre"
              outlined
              dense
              :error="Boolean(fieldErrors.name)"
              :error-message="fieldErrors.name"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.phone"
              label="Teléfono"
              outlined
              dense
              :error="Boolean(fieldErrors.phone)"
              :error-message="fieldErrors.phone"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.email"
              type="email"
              label="Email"
              outlined
              dense
              :error="Boolean(fieldErrors.email)"
              :error-message="fieldErrors.email"
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="form.address"
              label="Dirección"
              outlined
              dense
              :error="Boolean(fieldErrors.address)"
              :error-message="fieldErrors.address"
            />
          </div>
          <div class="col-12 row justify-end q-gutter-sm">
            <q-btn flat no-caps color="grey-8" label="Limpiar" @click="resetForm" />
            <q-btn type="submit" color="primary" no-caps label="Guardar" :loading="saving" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card>
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay clientes registrados"
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              label="Eliminar"
              @click="onDeleteClient(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { createClient, deleteClient, listClients } from 'src/services/clients-service'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})
const clients = ref([])

const form = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'phone', label: 'Teléfono', field: 'phone', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  {
    name: 'equipment_movements_count',
    label: 'Movimientos',
    field: 'equipment_movements_count',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const rows = computed(() =>
  clients.value.map((item) => ({
    id: item.id,
    name: item.name ?? '-',
    phone: item.phone ?? '-',
    email: item.email ?? '-',
    equipment_movements_count: item.equipment_movements_count ?? 0,
  })),
)

function normalizePayload(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

function normalizeSingleItem(data) {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      return data.data
    }

    return data
  }

  return null
}

function mapValidationErrors(error) {
  if (error?.response?.status !== 422) return {}
  const errors = error.response.data?.errors ?? {}

  return Object.entries(errors).reduce((accumulator, [field, messages]) => {
    accumulator[field] = Array.isArray(messages) ? messages[0] : String(messages)
    return accumulator
  }, {})
}

function resetForm() {
  form.value = {
    name: '',
    phone: '',
    email: '',
    address: '',
  }
  fieldErrors.value = {}
}

async function loadClients(options = {}) {
  const { silent = false } = options

  loading.value = true

  if (!silent) {
    errorMessage.value = ''
  }

  try {
    const data = await listClients()
    clients.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    if (!silent) {
      clients.value = []
      backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
      if (!backendUnavailable.value) {
        errorMessage.value = error.response?.data?.message || 'No fue posible cargar clientes.'
      }
    }
  } finally {
    loading.value = false
  }
}

async function onCreateClient() {
  saving.value = true
  fieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  try {
    const created = await createClient(form.value)
    const createdItem = normalizeSingleItem(created)

    if (createdItem) {
      const exists = clients.value.some((item) => item.id === createdItem.id)

      if (!exists) {
        clients.value = [createdItem, ...clients.value]
      }
    } else {
      clients.value = [
        {
          id: `tmp-${Date.now()}`,
          ...form.value,
          equipment_movements_count: 0,
        },
        ...clients.value,
      ]
    }

    $q.notify({ type: 'positive', message: 'Cliente registrado.' })
    resetForm()
    await loadClients({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    fieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(fieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible guardar cliente.'
    }
  } finally {
    saving.value = false
  }
}

async function onDeleteClient(id) {
  try {
    await deleteClient(id)
    $q.notify({ type: 'positive', message: 'Cliente eliminado.' })
    await loadClients()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible eliminar cliente.'
    }
  }
}

onMounted(loadClients)
</script>
