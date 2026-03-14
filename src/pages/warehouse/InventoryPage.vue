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
          @click="loadInventory"
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
            v-model="filters.source"
            outlined
            dense
            clearable
            label="Filtro: origen"
            :options="sourceOptions"
          />
        </div>
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
        row-key="row_key"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay elementos para mostrar"
      >
        <template #body-cell-source="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.source === 'equipo' ? 'primary' : 'secondary'"
              text-color="white"
            >
              {{ props.row.source === 'equipo' ? 'Equipo' : 'Consumible' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-inventory_status="props">
          <q-td :props="props">
            <span>{{ props.row.inventory_status }}</span>
          </q-td>
        </template>

        <!-- <template #body-cell-actions="props">
          <q-td :props="props" class="text-right q-gutter-xs">
            <q-btn
              v-if="props.row.source === 'equipo' && props.row.inventory_status === 'disponible'"
              flat
              dense
              no-caps
              color="primary"
              label="Registrar salida"
              @click="onOpenMovementDialog(props.row)"
            />
            <q-btn
              v-if="props.row.source === 'consumible'"
              flat
              dense
              no-caps
              color="primary"
              label="Registrar salida"
              @click="onOpenMovementDialog(props.row)"
            />
            <q-btn
              v-if="props.row.source === 'equipo' && props.row.inventory_status === 'rentado'"
              flat
              dense
              no-caps
              color="secondary"
              label="Registrar devolución"
              @click="onOpenReturnDialog(props.row)"
            />
          </q-td>
        </template> -->
      </q-table>
    </q-card>

    <q-dialog v-model="movementDialog">
      <q-card style="width: 100%; max-width: 760px">
        <q-card-section>
          <div class="text-subtitle1">
            {{
              movementMode === 'equipo'
                ? 'Registrar salida de equipo'
                : 'Registrar salida de consumible'
            }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form class="row q-col-gutter-md" @submit="onSubmitMovement">
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="movementForm.personnel_id"
                type="number"
                min="1"
                outlined
                dense
                label="Personal responsable"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="movementForm.type"
                outlined
                dense
                label="Tipo"
                :options="movementTypeOptions"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-input
                v-model.number="movementForm.client_id"
                type="number"
                min="1"
                outlined
                dense
                label="Cliente (opcional)"
              />
            </div>

            <div class="col-12 col-md-4">
              <q-select
                v-model="movementForm.location_id"
                outlined
                dense
                clearable
                label="Ubicación (opcional)"
                option-label="label"
                option-value="id"
                emit-value
                map-options
                :options="locationOptions"
              />
            </div>

            <div
              class="col-12 col-md-4"
              v-if="movementMode === 'consumible' && movementForm.type === 'movimiento_interno'"
            >
              <q-select
                v-model="movementForm.from_location_id"
                outlined
                dense
                clearable
                label="Ubicación origen"
                option-label="label"
                option-value="id"
                emit-value
                map-options
                :options="sourceLocationOptions"
              />
            </div>

            <template v-if="movementMode === 'equipo'">
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="movementForm.current_counter_bw"
                  type="number"
                  min="0"
                  outlined
                  dense
                  label="Contador B/N"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="movementForm.current_counter_color"
                  type="number"
                  min="0"
                  outlined
                  dense
                  label="Contador color"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="movementForm.counter_read_at"
                  type="date"
                  outlined
                  dense
                  label="Fecha lectura contadores"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="movementForm.date_out"
                  type="date"
                  outlined
                  dense
                  label="Fecha salida"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="movementForm.date_return"
                  type="date"
                  outlined
                  dense
                  label="Fecha regreso (opcional)"
                />
              </div>
            </template>

            <template v-else>
              <div class="col-12 col-md-4">
                <q-input
                  v-model.number="movementForm.quantity"
                  type="number"
                  min="1"
                  outlined
                  dense
                  label="Cantidad"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-input
                  v-model="movementForm.movement_date"
                  type="date"
                  outlined
                  dense
                  label="Fecha movimiento"
                />
              </div>
            </template>

            <div class="col-12">
              <q-input v-model="movementForm.notes" outlined dense label="Notas" />
            </div>

            <div class="col-12 row justify-end q-gutter-sm">
              <q-btn flat no-caps color="grey-8" label="Cancelar" v-close-popup />
              <q-btn
                type="submit"
                color="primary"
                no-caps
                label="Guardar movimiento"
                :loading="movementSaving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="returnDialog">
      <q-card style="width: 100%; max-width: 420px">
        <q-card-section>
          <div class="text-subtitle1">Registrar devolución</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            v-model="returnForm.date_return"
            type="date"
            outlined
            dense
            label="Fecha de devolución"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps color="grey-8" label="Cancelar" v-close-popup />
          <q-btn
            color="primary"
            no-caps
            label="Guardar"
            :loading="returnSaving"
            @click="onSubmitReturnDate"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { listAlmacen } from 'src/services/almacen-service'
import {
  createEquipmentMovement,
  listEquipmentMovements,
  updateEquipmentMovement,
} from 'src/services/equipment-movements-service'
import { createConsumableMovement } from 'src/services/consumable-movements-service'

const $q = useQuasar()

const loading = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const rawAlmacen = ref([])
const locationsData = ref([])
const locationOptions = ref([])
const locationMap = ref({})
const movementDialog = ref(false)
const movementSaving = ref(false)
const movementMode = ref('equipo')
const selectedInventoryRow = ref(null)
const returnDialog = ref(false)
const returnSaving = ref(false)
const returnTargetProduct = ref(null)

const inventoryStatusOptions = ['disponible', 'rentado', 'vendido', 'mantenimiento']
const sourceOptions = ['equipo', 'consumible']
const equipmentTypeOptions = ['copiadora', 'impresora']
const consumableTypeOptions = ['entrada', 'salida', 'ajuste', 'movimiento_interno']

const movementForm = ref({
  personnel_id: null,
  type: 'renta',
  client_id: null,
  from_location_id: null,
  location_id: null,
  current_counter_bw: null,
  current_counter_color: null,
  counter_read_at: '',
  date_out: '',
  date_return: '',
  quantity: 1,
  movement_date: '',
  notes: '',
})

const returnForm = ref({
  date_return: '',
})

const filters = ref({
  source: null,
  location_id: null,
  inventory_status: null,
  type: null,
  search: '',
})

const columns = [
  { name: 'source', label: 'Origen', field: 'source', align: 'left', sortable: true },
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
  { name: 'brand', label: 'Marca', field: 'brand', align: 'left', sortable: true },
  { name: 'model', label: 'Modelo', field: 'model', align: 'left', sortable: true },
  { name: 'serial_number', label: 'Serie', field: 'serial_number', align: 'left', sortable: true },
  { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center', sortable: true },
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
  // { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' },
]

const movementTypeOptions = computed(() =>
  movementMode.value === 'equipo'
    ? ['renta', 'salida', 'venta', 'mantenimiento', 'movimiento_interno']
    : ['entrada', 'salida', 'ajuste', 'movimiento_interno'],
)

const sourceLocationOptions = computed(() => {
  if (movementMode.value !== 'consumible' || !selectedInventoryRow.value?.consumable_id) {
    return locationOptions.value
  }

  const seen = new Map()

  rawAlmacen.value
    .filter((row) => Number(row.consumable_id) === Number(selectedInventoryRow.value.consumable_id))
    .forEach((row) => {
      if (!row.location_id) return

      const id = Number(row.location_id)
      if (!seen.has(id)) {
        seen.set(id, {
          id,
          label: row.location?.name || locationMap.value[id] || `Ub ${id}`,
        })
      }
    })

  return Array.from(seen.values())
})

const rows = computed(() =>
  rawAlmacen.value.map((entry) => {
    const isEquipment = Boolean(entry.product_id)
    const item = isEquipment ? entry.product : entry.consumable

    return {
      row_key: `almacen-${entry.id}`,
      id: entry.id,
      almacen_id: entry.id,
      source: isEquipment ? 'equipo' : 'consumible',
      product_id: entry.product_id ?? null,
      consumable_id: entry.consumable_id ?? null,
      type: item?.type ?? '-',
      brand: item?.brand ?? '-',
      model: item?.model ?? item?.name ?? '-',
      serial_number: item?.serial_number ?? item?.part_number ?? '-',
      quantity: Number(entry.quantity ?? (isEquipment ? 1 : 0)),
      location_id: entry.location_id ?? null,
      location_label:
        entry.location?.name ||
        locationMap.value[entry.location_id] ||
        `#${entry.location_id ?? '-'}`,
      inventory_status: item?.inventory_status ?? 'disponible',
      original: item,
    }
  }),
)

const typeOptions = computed(() => {
  if (filters.value.source === 'equipo') {
    return equipmentTypeOptions
  }

  if (filters.value.source === 'consumible') {
    return consumableTypeOptions
  }

  return [...equipmentTypeOptions, ...consumableTypeOptions]
})

const filteredRows = computed(() => {
  return rows.value.filter((row) => {
    if (filters.value.source && row.source !== filters.value.source) {
      return false
    }

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
  if (Array.isArray(data?.data?.data)) return data.data.data
  return []
}

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

// function resetMovementForm() {
//   movementForm.value = {
//     personnel_id: null,
//     type: movementMode.value === 'equipo' ? 'renta' : 'salida',
//     client_id: null,
//     from_location_id: selectedInventoryRow.value?.location_id ?? null,
//     location_id: selectedInventoryRow.value?.location_id ?? null,
//     current_counter_bw: null,
//     current_counter_color: null,
//     counter_read_at: todayDate(),
//     date_out: todayDate(),
//     date_return: '',
//     quantity: 1,
//     movement_date: todayDate(),
//     notes: movementMode.value === 'equipo' ? 'Salida a cliente' : 'Consumo interno',
//   }
// }

// function onOpenMovementDialog(row) {
//   selectedInventoryRow.value = row
//   movementMode.value = row.source
//   resetMovementForm()
//   movementDialog.value = true
// }

async function onSubmitMovement() {
  if (!selectedInventoryRow.value?.id || !movementForm.value.personnel_id) {
    return
  }

  if (
    movementMode.value === 'consumible' &&
    movementForm.value.type === 'movimiento_interno' &&
    !movementForm.value.from_location_id
  ) {
    $q.notify({ type: 'warning', message: 'Selecciona la ubicacion origen.' })
    return
  }

  if (
    movementMode.value === 'consumible' &&
    movementForm.value.type === 'movimiento_interno' &&
    movementForm.value.location_id &&
    Number(movementForm.value.location_id) === Number(movementForm.value.from_location_id)
  ) {
    $q.notify({ type: 'warning', message: 'Origen y destino no pueden ser la misma ubicacion.' })
    return
  }

  movementSaving.value = true

  try {
    if (movementMode.value === 'consumible') {
      const payload = {
        consumable_id: selectedInventoryRow.value.consumable_id || selectedInventoryRow.value.id,
        personnel_id: Number(movementForm.value.personnel_id),
        type: movementForm.value.type || 'salida',
        quantity: Number(movementForm.value.quantity || 0),
        movement_date: movementForm.value.movement_date || todayDate(),
        client_id: movementForm.value.client_id || null,
        location_id: movementForm.value.location_id || null,
        notes: movementForm.value.notes || null,
      }

      if (movementForm.value.type === 'movimiento_interno') {
        payload.from_location_id = movementForm.value.from_location_id || null
      }

      await createConsumableMovement(payload)
    } else {
      await createEquipmentMovement({
        product_id: selectedInventoryRow.value.product_id || selectedInventoryRow.value.id,
        personnel_id: Number(movementForm.value.personnel_id),
        type: movementForm.value.type || 'renta',
        client_id: movementForm.value.client_id || null,
        location_id: movementForm.value.location_id || null,
        current_counter_bw:
          movementForm.value.current_counter_bw === null ||
          movementForm.value.current_counter_bw === ''
            ? null
            : Number(movementForm.value.current_counter_bw),
        current_counter_color:
          movementForm.value.current_counter_color === null ||
          movementForm.value.current_counter_color === ''
            ? null
            : Number(movementForm.value.current_counter_color),
        counter_read_at: movementForm.value.counter_read_at || null,
        date_out: movementForm.value.date_out || todayDate(),
        date_return: movementForm.value.date_return || null,
        notes: movementForm.value.notes || null,
      })
    }

    movementDialog.value = false
    $q.notify({ type: 'positive', message: 'Movimiento registrado.' })
    await loadInventory()
  } catch (error) {
    const isNetwork = !error?.response || error?.code === 'ERR_NETWORK'
    if (isNetwork) {
      backendUnavailable.value = true
      return
    }

    errorMessage.value = error.response?.data?.message || 'No fue posible guardar el movimiento.'
  } finally {
    movementSaving.value = false
  }
}

// function onOpenReturnDialog(row) {
//   returnTargetProduct.value = row
//   returnForm.value = { date_return: todayDate() }
//   returnDialog.value = true
// }

async function onSubmitReturnDate() {
  if (!returnTargetProduct.value?.product_id || !returnForm.value.date_return) {
    return
  }

  returnSaving.value = true

  try {
    const productId = Number(returnTargetProduct.value.product_id)
    const movementsData = await listEquipmentMovements({ product_id: productId })
    const movements = normalizePayload(movementsData)
    const openRental = movements
      .filter(
        (item) =>
          Number(item.product_id) === productId && item.type === 'renta' && !item.date_return,
      )
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))[0]

    if (!openRental?.id) {
      $q.notify({ type: 'warning', message: 'No se encontró una renta abierta para este equipo.' })
      return
    }

    await updateEquipmentMovement(openRental.id, {
      date_return: returnForm.value.date_return,
    })

    returnDialog.value = false
    $q.notify({ type: 'positive', message: 'Devolución registrada.' })
    await loadInventory()
  } catch (error) {
    const isNetwork = !error?.response || error?.code === 'ERR_NETWORK'
    if (isNetwork) {
      backendUnavailable.value = true
      return
    }

    errorMessage.value = error.response?.data?.message || 'No fue posible registrar la devolución.'
  } finally {
    returnSaving.value = false
  }
}

async function loadInventory() {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await listAlmacen({ per_page: 200 })
    rawAlmacen.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    rawAlmacen.value = []
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible cargar inventario.'
    }
  } finally {
    loading.value = false
  }
}

function buildLocationsCatalogFromAlmacen() {
  const seen = new Set()
  const locations = []

  for (const entry of rawAlmacen.value) {
    if (entry.location && !seen.has(entry.location.id)) {
      seen.add(entry.location.id)
      locations.push(entry.location)
    }
  }

  locationsData.value = locations
  locationOptions.value = locations.map((location) => ({
    id: location.id,
    label: `${location.name} (${location.type || 'almacen'})`,
  }))
  locationMap.value = locations.reduce((accumulator, location) => {
    accumulator[location.id] = location.name
    return accumulator
  }, {})
}

function resetFilters() {
  filters.value = {
    source: null,
    location_id: null,
    inventory_status: null,
    type: null,
    search: '',
  }
}

// Auto-rellenar ubicación al seleccionar cliente
watch(
  () => movementForm.value.client_id,
  (clientId) => {
    if (!clientId) {
      return
    }

    // Buscar la ubicación del cliente seleccionado
    const clientLocation = locationsData.value.find(
      (loc) => loc.client_id === Number(clientId) && loc.type === 'cliente',
    )

    if (clientLocation) {
      movementForm.value.location_id = clientLocation.id
    }
  },
  { immediate: true },
)

onMounted(async () => {
  await loadInventory()
  buildLocationsCatalogFromAlmacen()
})
</script>
