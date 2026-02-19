<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacén · Historial del equipo</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Recargar"
          :loading="loading"
          @click="loadHistory"
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
        <div class="text-subtitle1">Nuevo movimiento</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onCreateMovement">
          <div class="col-12 col-md-4">
            <q-select
              v-model="movementForm.product_id"
              label="Producto"
              outlined
              dense
              use-input
              fill-input
              hide-selected
              input-debounce="0"
              option-label="label"
              option-value="id"
              emit-value
              map-options
              :options="productOptions"
              :loading="catalogLoading"
              @filter="filterProducts"
              :error="Boolean(fieldErrors.product_id)"
              :error-message="fieldErrors.product_id"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="movementForm.client_id"
              label="Cliente (opcional)"
              outlined
              dense
              clearable
              use-input
              fill-input
              hide-selected
              input-debounce="0"
              option-label="label"
              option-value="id"
              emit-value
              map-options
              :options="clientOptions"
              :loading="catalogLoading"
              @filter="filterClients"
              :error="Boolean(fieldErrors.client_id)"
              :error-message="fieldErrors.client_id"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="movementForm.type"
              label="Tipo"
              outlined
              dense
              :options="typeOptions"
              :error="Boolean(fieldErrors.type)"
              :error-message="fieldErrors.type"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="movementForm.date_out"
              type="date"
              label="Fecha salida"
              outlined
              dense
              :error="Boolean(fieldErrors.date_out)"
              :error-message="fieldErrors.date_out"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="movementForm.date_return"
              type="date"
              label="Fecha regreso (opcional)"
              outlined
              dense
              :error="Boolean(fieldErrors.date_return)"
              :error-message="fieldErrors.date_return"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input v-model="movementForm.notes" label="Notas" outlined dense />
          </div>

          <div class="col-12 row justify-end q-gutter-sm">
            <q-btn flat no-caps color="grey-8" label="Limpiar" @click="resetMovementForm" />
            <q-btn
              type="submit"
              color="primary"
              no-caps
              label="Guardar movimiento"
              :loading="saving"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-card class="q-mb-md">
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.type"
            outlined
            dense
            clearable
            label="Filtro: tipo"
            :options="typeOptions"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.product_id"
            outlined
            dense
            clearable
            label="Filtro: producto"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            :options="allProductOptions"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.client_id"
            outlined
            dense
            clearable
            label="Filtro: cliente"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            :options="allClientOptions"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-input v-model="filters.date_from" type="date" outlined dense label="Desde" />
        </div>
        <div class="col-12 col-md-3">
          <q-input v-model="filters.date_to" type="date" outlined dense label="Hasta" />
        </div>
        <div class="col-12 row justify-end q-gutter-sm">
          <q-btn flat no-caps color="grey-8" label="Limpiar filtros" @click="resetFilters" />
        </div>
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
        no-data-label="No hay movimientos registrados"
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              v-if="!props.row.date_return && props.row.type !== 'venta'"
              flat
              dense
              no-caps
              color="primary"
              label="Marcar regreso"
              @click="onMarkReturned(props.row)"
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
import {
  createEquipmentMovement,
  listEquipmentMovements,
  updateEquipmentMovement,
} from 'src/services/equipment-movements-service'
import { listProducts } from 'src/services/products-service'
import { listClients } from 'src/services/clients-service'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const catalogLoading = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const movements = ref([])
const fieldErrors = ref({})

const typeOptions = ['entrada', 'salida', 'renta', 'venta', 'mantenimiento']

const allProductOptions = ref([])
const productOptions = ref([])
const allClientOptions = ref([])
const clientOptions = ref([])

const initialMovementForm = () => ({
  product_id: null,
  client_id: null,
  type: 'renta',
  date_out: '',
  date_return: '',
  notes: '',
})

const movementForm = ref(initialMovementForm())

const filters = ref({
  type: null,
  product_id: null,
  client_id: null,
  date_from: '',
  date_to: '',
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  {
    name: 'product_label',
    label: 'Producto',
    field: 'product_label',
    align: 'left',
    sortable: true,
  },
  { name: 'client_label', label: 'Cliente', field: 'client_label', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
  { name: 'date_out', label: 'Salida', field: 'date_out', align: 'left', sortable: true },
  { name: 'date_return', label: 'Regreso', field: 'date_return', align: 'left', sortable: true },
  { name: 'notes', label: 'Notas', field: 'notes', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const rows = computed(() => {
  const normalized = movements.value.map((item) => {
    const productLabel =
      item.product?.serial_number || item.product?.model
        ? `${item.product?.brand || ''} ${item.product?.model || ''} (${item.product?.serial_number || item.product_id})`.trim()
        : item.product_id

    const clientLabel = item.client?.name || item.client_id || '-'

    return {
      id: item.id,
      product_id: item.product_id,
      client_id: item.client_id,
      product_label: productLabel || '-',
      client_label: clientLabel,
      type: item.type ?? '-',
      date_out: item.date_out ?? '-',
      date_return: item.date_return ?? '',
      notes: item.notes ?? '-',
      raw: item,
    }
  })

  return normalized.filter((row) => {
    if (filters.value.type && row.type !== filters.value.type) {
      return false
    }

    if (filters.value.product_id && Number(row.product_id) !== Number(filters.value.product_id)) {
      return false
    }

    if (filters.value.client_id && Number(row.client_id) !== Number(filters.value.client_id)) {
      return false
    }

    if (filters.value.date_from && row.date_out && row.date_out < filters.value.date_from) {
      return false
    }

    if (filters.value.date_to && row.date_out && row.date_out > filters.value.date_to) {
      return false
    }

    return true
  })
})

function normalizePayload(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

function mapValidationErrors(error) {
  if (error?.response?.status !== 422) return {}
  const errors = error.response.data?.errors ?? {}

  return Object.entries(errors).reduce((accumulator, [field, messages]) => {
    accumulator[field] = Array.isArray(messages) ? messages[0] : String(messages)
    return accumulator
  }, {})
}

function resetMovementForm() {
  movementForm.value = initialMovementForm()
  fieldErrors.value = {}
}

function resetFilters() {
  filters.value = {
    type: null,
    product_id: null,
    client_id: null,
    date_from: '',
    date_to: '',
  }
}

function filterProducts(val, update) {
  update(() => {
    if (!val) {
      productOptions.value = allProductOptions.value
      return
    }

    const needle = val.toLowerCase()
    productOptions.value = allProductOptions.value.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  })
}

function filterClients(val, update) {
  update(() => {
    if (!val) {
      clientOptions.value = allClientOptions.value
      return
    }

    const needle = val.toLowerCase()
    clientOptions.value = allClientOptions.value.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  })
}

async function loadCatalogs() {
  catalogLoading.value = true

  try {
    const [productsData, clientsData] = await Promise.all([listProducts(), listClients()])

    const products = normalizePayload(productsData)
    const clients = normalizePayload(clientsData)

    allProductOptions.value = products.map((product) => ({
      id: product.id,
      label:
        `${product.brand || ''} ${product.model || ''} (${product.serial_number || product.id})`.trim(),
    }))

    allClientOptions.value = clients.map((client) => ({
      id: client.id,
      label: client.name || `Cliente ${client.id}`,
    }))

    productOptions.value = allProductOptions.value
    clientOptions.value = allClientOptions.value
  } finally {
    catalogLoading.value = false
  }
}

async function loadHistory() {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await listEquipmentMovements()
    movements.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    movements.value = []
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible cargar historial.'
    }
  } finally {
    loading.value = false
  }
}

async function onCreateMovement() {
  saving.value = true
  fieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  const payload = {
    product_id: movementForm.value.product_id,
    client_id: movementForm.value.client_id || null,
    type: movementForm.value.type,
    date_out: movementForm.value.date_out,
    date_return: movementForm.value.date_return || null,
    notes: movementForm.value.notes,
  }

  try {
    await createEquipmentMovement(payload)
    $q.notify({ type: 'positive', message: 'Movimiento registrado.' })
    resetMovementForm()
    await loadHistory()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    fieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(fieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible guardar movimiento.'
    }
  } finally {
    saving.value = false
  }
}

async function onMarkReturned(row) {
  const dateReturn = new Date().toISOString().slice(0, 10)

  const payload = {
    product_id: row.product_id,
    client_id: row.client_id || null,
    type: row.type,
    date_out: row.date_out,
    date_return: dateReturn,
    notes: row.notes === '-' ? 'Regresó en buen estado' : row.notes,
  }

  try {
    await updateEquipmentMovement(row.id, payload)
    $q.notify({ type: 'positive', message: 'Equipo marcado como regresado.' })
    await loadHistory()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible marcar regreso.'
    }
  }
}

onMounted(async () => {
  await Promise.all([loadCatalogs(), loadHistory()])
})
</script>
