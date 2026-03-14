<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacen · Historial de movimientos</div>
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
      No hay conexion con el backend. Verifica que Laravel este encendido.
    </q-banner>

    <q-banner v-else-if="errorMessage" dense rounded class="bg-red-1 text-red-8 q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-card class="q-mb-md">
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.movement_source"
            outlined
            dense
            clearable
            label="Filtro: origen"
            :options="movementSourceOptions"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.type"
            outlined
            dense
            clearable
            label="Filtro: tipo"
            :options="filterTypeOptions"
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
          <q-select
            v-model="filters.location_id"
            outlined
            dense
            clearable
            label="Filtro: ubicacion"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            :options="allLocationOptions"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.personnel_id"
            outlined
            dense
            clearable
            label="Filtro: personal"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            :options="allPersonnelOptions"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.consumable_id"
            outlined
            dense
            clearable
            label="Filtro: consumible"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            :options="allConsumableOptions"
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
        row-key="row_key"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay movimientos registrados"
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              label="Eliminar"
              @click="onDeleteMovement(props.row)"
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
  deleteEquipmentMovement,
  listEquipmentMovements,
} from 'src/services/equipment-movements-service'
import { listProducts } from 'src/services/products-service'
import { listClients } from 'src/services/clients-service'
import { listConsumables } from 'src/services/consumables-service'
import {
  deleteConsumableMovement,
  listConsumableMovements,
} from 'src/services/consumable-movements-service'
import { listPersonnel } from 'src/services/personnel-service'

const $q = useQuasar()
const loading = ref(false)
const catalogLoading = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const movements = ref([])

const movementSourceOptions = ['equipo', 'consumible']
const allProductOptions = ref([])
const allConsumableOptions = ref([])
const allClientOptions = ref([])
const allLocationOptions = ref([])
const allPersonnelOptions = ref([])

const filters = ref({
  movement_source: null,
  type: null,
  product_id: null,
  consumable_id: null,
  client_id: null,
  location_id: null,
  personnel_id: null,
  date_from: '',
  date_to: '',
})

const filterTypeOptions = computed(() => {
  const types = movements.value
    .map((movement) => movement.type)
    .filter((type) => typeof type === 'string' && type.trim() !== '')

  return Array.from(new Set(types))
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  {
    name: 'movement_source',
    label: 'Origen',
    field: 'movement_source',
    align: 'left',
    sortable: true,
  },
  {
    name: 'item_label',
    label: 'Elemento',
    field: 'item_label',
    align: 'left',
    sortable: true,
  },
  { name: 'client_label', label: 'Cliente', field: 'client_label', align: 'left', sortable: true },
  {
    name: 'location_label',
    label: 'Ubicacion',
    field: 'location_label',
    align: 'left',
    sortable: true,
  },
  {
    name: 'personnel_label',
    label: 'Personal',
    field: 'personnel_label',
    align: 'left',
    sortable: true,
  },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'right', sortable: true },
  { name: 'date_out', label: 'Fecha', field: 'date_out', align: 'left', sortable: true },
  { name: 'date_return', label: 'Regreso', field: 'date_return', align: 'left', sortable: true },
  { name: 'notes', label: 'Notas', field: 'notes', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const rows = computed(() => {
  const normalized = movements.value.map((item) => {
    if (item.source === 'consumible') {
      const consumableLabel =
        item.consumable?.name || item.consumable?.part_number
          ? `${item.consumable?.name || 'Consumible'} (${item.consumable?.part_number || item.consumable_id || item.id})`
          : `Consumible ${item.consumable_id || item.id}`

      const movementDate = item.date_out || item.movement_date || item.date || item.created_at || ''

      return {
        row_key: `consumible-${item.id}`,
        id: item.id,
        movement_source: 'consumible',
        product_id: null,
        consumable_id: item.consumable_id ?? item.consumable?.id ?? null,
        client_id: item.client_id ?? item.client?.id ?? null,
        item_label: consumableLabel,
        client_label: item.client?.name || item.client_id || '-',
        location_label:
          item.type === 'movimiento_interno'
            ? `${item.from_location?.name || item.from_location_id || '-'} -> ${item.location?.name || item.location_id || '-'}`
            : item.location?.name || item.location_id || '-',
        personnel_label: item.personnel?.name || item.personnel_id || '-',
        type: item.type ?? item.movement_type ?? '-',
        quantity: Number(item.quantity ?? item.amount ?? 0) || '-',
        date_out: String(movementDate).slice(0, 10) || '-',
        date_return: '',
        notes: item.notes ?? '-',
        raw: item,
      }
    }

    const productLabel =
      item.product?.serial_number || item.product?.model
        ? `${item.product?.brand || ''} ${item.product?.model || ''} (${item.product?.serial_number || item.product_id})`.trim()
        : item.product_id

    return {
      row_key: `equipo-${item.id}`,
      id: item.id,
      movement_source: 'equipo',
      product_id: item.product_id,
      consumable_id: null,
      client_id: item.client_id,
      item_label: productLabel || '-',
      client_label: item.client?.name || item.client_id || '-',
      location_label: item.location?.name || item.location_id || '-',
      personnel_label: item.personnel?.name || item.personnel_id || '-',
      type: item.type ?? '-',
      quantity: 1,
      date_out: item.date_out ? String(item.date_out).slice(0, 10) : '-',
      date_return: item.date_return ? String(item.date_return).slice(0, 10) : '',
      notes: item.notes ?? '-',
      raw: item,
    }
  })

  return normalized.filter((row) => {
    if (filters.value.movement_source && row.movement_source !== filters.value.movement_source) {
      return false
    }

    if (filters.value.type && row.type !== filters.value.type) {
      return false
    }

    if (filters.value.product_id && Number(row.product_id) !== Number(filters.value.product_id)) {
      return false
    }

    if (filters.value.client_id && Number(row.client_id) !== Number(filters.value.client_id)) {
      return false
    }

    if (
      filters.value.consumable_id &&
      Number(row.consumable_id) !== Number(filters.value.consumable_id)
    ) {
      return false
    }

    if (
      filters.value.location_id &&
      Number(row.raw?.location_id) !== Number(filters.value.location_id)
    ) {
      return false
    }

    if (
      filters.value.personnel_id &&
      Number(row.raw?.personnel_id) !== Number(filters.value.personnel_id)
    ) {
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

function resetFilters() {
  filters.value = {
    movement_source: null,
    type: null,
    product_id: null,
    consumable_id: null,
    client_id: null,
    location_id: null,
    personnel_id: null,
    date_from: '',
    date_to: '',
  }
}

async function loadCatalogs() {
  catalogLoading.value = true

  try {
    const [productsData, clientsData, consumablesData, personnelData] = await Promise.all([
      listProducts(),
      listClients(),
      listConsumables(),
      listPersonnel(),
    ])

    const products = normalizePayload(productsData)
    const clients = normalizePayload(clientsData)
    const consumables = normalizePayload(consumablesData)
    const personnel = normalizePayload(personnelData)

    allProductOptions.value = products.map((product) => ({
      id: product.id,
      label:
        `${product.brand || ''} ${product.model || ''} (${product.serial_number || product.id})`.trim(),
    }))

    allClientOptions.value = clients.map((client) => ({
      id: client.id,
      label: client.name || `Cliente ${client.id}`,
    }))

    allConsumableOptions.value = consumables.map((consumable) => ({
      id: consumable.id,
      label:
        consumable.name || consumable.part_number
          ? `${consumable.name || 'Consumible'} (${consumable.part_number || consumable.id})`
          : `Consumible ${consumable.id}`,
    }))

    allPersonnelOptions.value = personnel.map((person) => ({
      id: person.id,
      label: person.name || `Personal ${person.id}`,
    }))
  } finally {
    catalogLoading.value = false
  }
}

function buildLocationOptionsFromMovements() {
  const seen = new Set()
  const locations = []

  for (const movement of movements.value) {
    const loc = movement.location
    if (loc && !seen.has(loc.id)) {
      seen.add(loc.id)
      locations.push({ id: loc.id, label: loc.name || `Ubicacion ${loc.id}` })
    }
  }

  allLocationOptions.value = locations
}

async function loadHistory() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [equipmentData, consumableData] = await Promise.all([
      listEquipmentMovements(),
      listConsumableMovements(),
    ])

    const equipmentMovements = normalizePayload(equipmentData).map((movement) => ({
      ...movement,
      source: 'equipo',
    }))

    const consumableMovements = normalizePayload(consumableData).map((movement) => ({
      ...movement,
      source: 'consumible',
    }))

    movements.value = [...equipmentMovements, ...consumableMovements]
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

async function onDeleteMovement(row) {
  try {
    await $q.dialog({
      title: 'Confirmar',
      message: 'Deseas eliminar este movimiento?',
      cancel: true,
      persistent: true,
    })
  } catch {
    return
  }

  try {
    if (row.movement_source === 'consumible') {
      await deleteConsumableMovement(row.id)
    } else {
      await deleteEquipmentMovement(row.id)
    }

    $q.notify({ type: 'positive', message: 'Movimiento eliminado.' })
    await loadHistory()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible eliminar movimiento.'
    }
  }
}

onMounted(async () => {
  await Promise.all([loadCatalogs(), loadHistory()])
  buildLocationOptionsFromMovements()
})
</script>
