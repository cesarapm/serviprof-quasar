<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacén · Control de inventario</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Recargar"
          :loading="loading"
          @click="loadProducts"
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

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3" v-for="item in statusSummary" :key="item.label">
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div class="text-caption text-grey-7">{{ item.label }}</div>
            <div class="text-h6">{{ item.value }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.location_id"
            outlined
            dense
            clearable
            label="Filtro: ubicación"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            :options="locationOptions"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.inventory_status"
            outlined
            dense
            clearable
            label="Filtro: estado"
            :options="inventoryStatusOptions"
          />
        </div>
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
          <q-input
            v-model="filters.search"
            outlined
            dense
            label="Buscar marca/modelo/serie"
            clearable
          />
        </div>
        <div class="col-12 row justify-end">
          <q-btn flat no-caps color="grey-8" label="Limpiar filtros" @click="resetFilters" />
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-table
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay equipos para mostrar"
      >
        <template #body-cell-inventory_status="props">
          <q-td :props="props">
            <q-select
              dense
              outlined
              options-dense
              :model-value="props.row.inventory_status"
              :options="inventoryStatusOptions"
              @update:model-value="(value) => onChangeInventoryStatus(props.row, value)"
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
import { listProducts, updateProduct } from 'src/services/products-service'
import { listLocations } from 'src/services/locations-service'

const $q = useQuasar()
const loading = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const rawProducts = ref([])
const locationOptions = ref([])
const locationMap = ref({})

const inventoryStatusOptions = ['disponible', 'rentado', 'vendido', 'mantenimiento']
const typeOptions = ['copiadora', 'impresora']

const filters = ref({
  location_id: null,
  inventory_status: null,
  type: null,
  search: '',
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
  { name: 'brand', label: 'Marca', field: 'brand', align: 'left', sortable: true },
  { name: 'model', label: 'Modelo', field: 'model', align: 'left', sortable: true },
  { name: 'serial_number', label: 'Serie', field: 'serial_number', align: 'left', sortable: true },
  {
    name: 'location_label',
    label: 'Ubicación',
    field: 'location_label',
    align: 'left',
    sortable: true,
  },
  {
    name: 'inventory_status',
    label: 'Estado inventario',
    field: 'inventory_status',
    align: 'left',
    sortable: true,
  },
]

const rows = computed(() =>
  rawProducts.value.map((product) => ({
    id: product.id,
    type: product.type ?? '-',
    brand: product.brand ?? '-',
    model: product.model ?? '-',
    serial_number: product.serial_number ?? '-',
    location_id: product.location_id ?? null,
    location_label: locationMap.value[product.location_id] ?? `#${product.location_id ?? '-'}`,
    inventory_status: product.inventory_status ?? 'disponible',
    original: product,
  })),
)

const filteredRows = computed(() => {
  return rows.value.filter((row) => {
    if (
      filters.value.location_id &&
      Number(row.location_id) !== Number(filters.value.location_id)
    ) {
      return false
    }

    if (filters.value.inventory_status && row.inventory_status !== filters.value.inventory_status) {
      return false
    }

    if (filters.value.type && row.type !== filters.value.type) {
      return false
    }

    if (filters.value.search) {
      const needle = filters.value.search.toLowerCase()
      const bag =
        `${row.brand} ${row.model} ${row.serial_number} ${row.location_label}`.toLowerCase()
      if (!bag.includes(needle)) {
        return false
      }
    }

    return true
  })
})

const statusSummary = computed(() => {
  const base = [
    { label: 'Disponibles', key: 'disponible' },
    { label: 'Rentados', key: 'rentado' },
    { label: 'Vendidos', key: 'vendido' },
    { label: 'Mantenimiento', key: 'mantenimiento' },
  ]

  return base.map((item) => ({
    label: item.label,
    value: rows.value.filter((row) => row.inventory_status === item.key).length,
  }))
})

function normalizePayload(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

async function loadProducts() {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await listProducts()
    rawProducts.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    rawProducts.value = []
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible cargar inventario.'
    }
  } finally {
    loading.value = false
  }
}

async function loadLocationsCatalog() {
  try {
    const data = await listLocations()
    const locations = normalizePayload(data)

    locationOptions.value = locations.map((location) => ({
      id: location.id,
      label: `${location.name} (${location.type})`,
    }))

    locationMap.value = locations.reduce((accumulator, location) => {
      accumulator[location.id] = location.name
      return accumulator
    }, {})
  } catch {
    locationOptions.value = []
    locationMap.value = {}
  }
}

function resetFilters() {
  filters.value = {
    location_id: null,
    inventory_status: null,
    type: null,
    search: '',
  }
}

async function onChangeInventoryStatus(row, inventoryStatus) {
  const payload = {
    type: row.original.type,
    brand: row.original.brand,
    model: row.original.model,
    serial_number: row.original.serial_number,
    status: row.original.status,
    inventory_status: inventoryStatus,
    location_id: row.original.location_id,
    entry_date: row.original.entry_date,
    notes: row.original.notes,
  }

  try {
    await updateProduct(row.id, payload)
    row.original.inventory_status = inventoryStatus
    $q.notify({ type: 'positive', message: 'Inventario actualizado.' })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    if (!backendUnavailable.value) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No fue posible actualizar inventario.',
      })
    }
  }
}

onMounted(async () => {
  await Promise.all([loadProducts(), loadLocationsCatalog()])
})
</script>
