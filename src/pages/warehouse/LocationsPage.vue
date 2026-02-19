<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacén · Ubicaciones</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Recargar"
          :loading="loading"
          @click="loadLocations"
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
        <div class="text-subtitle1">Nueva ubicación</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onCreateLocation">
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.name"
              label="Nombre"
              outlined
              dense
              :error="Boolean(fieldErrors.name)"
              :error-message="fieldErrors.name"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="form.type"
              label="Tipo"
              outlined
              dense
              :options="typeOptions"
              :error="Boolean(fieldErrors.type)"
              :error-message="fieldErrors.type"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="form.sub_location"
              label="Sub-ubicación"
              outlined
              dense
              :error="Boolean(fieldErrors.sub_location)"
              :error-message="fieldErrors.sub_location"
            />
          </div>
          <div class="col-12 col-md-6" v-if="form.type === 'cliente'">
            <q-input
              v-model.number="form.client_id"
              type="number"
              min="1"
              label="ID Cliente"
              outlined
              dense
              :error="Boolean(fieldErrors.client_id)"
              :error-message="fieldErrors.client_id"
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
        no-data-label="No hay ubicaciones registradas"
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              v-if="props.row.can_delete"
              flat
              dense
              no-caps
              color="negative"
              label="Eliminar"
              @click="onDeleteLocation(props.row.id)"
            />
            <q-badge v-else color="grey-6" text-color="white">En uso</q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { createLocation, deleteLocation, listLocations } from 'src/services/locations-service'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})
const locations = ref([])
const typeOptions = [
  'almacen_apodaca',
  'taller',
  'transito',
  'cliente',
  'baja_canibalizacion',
  'demo_showroom',
]

const form = ref({
  name: '',
  sub_location: '',
  type: 'almacen_apodaca',
  client_id: null,
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  {
    name: 'sub_location',
    label: 'Sub-ubicación',
    field: 'sub_location',
    align: 'left',
    sortable: true,
  },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
  {
    name: 'client_id',
    label: 'Cliente',
    field: 'client_id',
    align: 'right',
    sortable: true,
  },
  {
    name: 'related_count',
    label: 'Ítems',
    field: 'related_count',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

function getRelatedCount(item) {
  const keys = [
    'products_count',
    'items_count',
    'inventory_count',
    'equipment_count',
    'equipments_count',
  ]

  return keys.reduce((total, key) => total + Number(item?.[key] ?? 0), 0)
}

const rows = computed(() =>
  locations.value.map((item) => ({
    id: item.id,
    name: item.name ?? '-',
    sub_location: item.sub_location ?? '-',
    type: item.type ?? '-',
    client_id: item.client_id ?? '-',
    related_count: getRelatedCount(item),
    can_delete: getRelatedCount(item) === 0,
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
    sub_location: '',
    type: 'almacen_apodaca',
    client_id: null,
  }
  fieldErrors.value = {}
}

async function loadLocations(options = {}) {
  const { silent = false } = options

  loading.value = true

  if (!silent) {
    errorMessage.value = ''
  }

  try {
    const data = await listLocations()
    locations.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    if (!silent) {
      locations.value = []
      backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
      if (!backendUnavailable.value) {
        errorMessage.value = error.response?.data?.message || 'No fue posible cargar ubicaciones.'
      }
    }
  } finally {
    loading.value = false
  }
}

async function onCreateLocation() {
  saving.value = true
  fieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  const draftItem = {
    id: `tmp-${Date.now()}`,
    name: form.value.name?.trim(),
    sub_location: form.value.sub_location?.trim() || null,
    type: form.value.type,
    client_id: form.value.type === 'cliente' ? Number(form.value.client_id) || null : null,
    products_count: 0,
  }

  const payload = {
    name: form.value.name?.trim(),
    sub_location: form.value.sub_location?.trim() || null,
    type: form.value.type,
    client_id: form.value.type === 'cliente' ? Number(form.value.client_id) || null : null,
  }

  try {
    const created = await createLocation(payload)
    const createdItem = normalizeSingleItem(created)

    if (createdItem) {
      const exists = locations.value.some((item) => item.id === createdItem.id)

      if (!exists) {
        locations.value = [createdItem, ...locations.value]
      }
    } else {
      locations.value = [draftItem, ...locations.value]
    }

    $q.notify({ type: 'positive', message: 'Ubicación registrada.' })
    resetForm()
    await loadLocations({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    fieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(fieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible guardar ubicación.'
    }
  } finally {
    saving.value = false
  }
}

async function onDeleteLocation(id) {
  const row = rows.value.find((item) => item.id === id)

  if (row && !row.can_delete) {
    $q.notify({
      type: 'warning',
      message: 'No se puede eliminar una ubicación que tiene ítems asociados.',
    })
    return
  }

  try {
    await deleteLocation(id)
    $q.notify({ type: 'positive', message: 'Ubicación eliminada.' })
    await loadLocations()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible eliminar ubicación.'
    }
  }
}

onMounted(loadLocations)
</script>
