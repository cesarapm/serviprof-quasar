<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacén · Historial de movimientos</div>
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
              v-model="movementForm.movement_source"
              label="Origen"
              outlined
              dense
              :options="movementSourceOptions"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="movementForm.product_id"
              v-if="movementForm.movement_source === 'equipo'"
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
              v-model="movementForm.consumable_id"
              v-if="movementForm.movement_source === 'consumible'"
              label="Consumible"
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
              :options="consumableOptions"
              :loading="catalogLoading"
              @filter="filterConsumables"
              :error="Boolean(fieldErrors.consumable_id)"
              :error-message="fieldErrors.consumable_id"
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
              v-model="movementForm.location_id"
              label="Ubicación (opcional)"
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
              :options="locationOptions"
              :loading="catalogLoading"
              @filter="filterLocations"
              :error="Boolean(fieldErrors.location_id)"
              :error-message="fieldErrors.location_id"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="movementForm.personnel_id"
              label="Personal responsable"
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
              :options="personnelOptions"
              :loading="catalogLoading"
              @filter="filterPersonnel"
              :error="Boolean(fieldErrors.personnel_id)"
              :error-message="fieldErrors.personnel_id"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-select
              v-model="movementForm.type"
              label="Tipo"
              outlined
              dense
              :options="formTypeOptions"
              :error="Boolean(fieldErrors.type)"
              :error-message="fieldErrors.type"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="movementForm.date_out"
              v-if="movementForm.movement_source === 'equipo'"
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
              v-model="movementForm.movement_date"
              v-if="movementForm.movement_source === 'consumible'"
              type="date"
              label="Fecha movimiento"
              outlined
              dense
              :error="Boolean(fieldErrors.movement_date)"
              :error-message="fieldErrors.movement_date"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="movementForm.date_return"
              v-if="movementForm.movement_source === 'equipo'"
              type="date"
              label="Fecha regreso (opcional)"
              outlined
              dense
              :error="Boolean(fieldErrors.date_return)"
              :error-message="fieldErrors.date_return"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model.number="movementForm.current_counter_bw"
              v-if="movementForm.movement_source === 'equipo'"
              type="number"
              min="0"
              label="Contador B/N"
              outlined
              dense
              :error="Boolean(fieldErrors.current_counter_bw)"
              :error-message="fieldErrors.current_counter_bw"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model.number="movementForm.current_counter_color"
              v-if="movementForm.movement_source === 'equipo'"
              type="number"
              min="0"
              label="Contador color"
              outlined
              dense
              :error="Boolean(fieldErrors.current_counter_color)"
              :error-message="fieldErrors.current_counter_color"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model="movementForm.counter_read_at"
              v-if="movementForm.movement_source === 'equipo'"
              type="date"
              label="Fecha lectura contadores"
              outlined
              dense
              :error="Boolean(fieldErrors.counter_read_at)"
              :error-message="fieldErrors.counter_read_at"
            />
          </div>

          <div class="col-12 col-md-4">
            <q-input
              v-model.number="movementForm.quantity"
              v-if="movementForm.movement_source === 'consumible'"
              type="number"
              min="1"
              label="Cantidad"
              outlined
              dense
              :error="Boolean(fieldErrors.quantity)"
              :error-message="fieldErrors.quantity"
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
            label="Filtro: ubicación"
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
              v-if="
                props.row.movement_source === 'equipo' &&
                props.row.type === 'renta' &&
                !props.row.date_return
              "
              flat
              dense
              no-caps
              color="primary"
              label="Registrar devolución"
              @click="onOpenReturnDialog(props.row)"
            />
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
            :loading="returning"
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
import {
  createEquipmentMovement,
  deleteEquipmentMovement,
  listEquipmentMovements,
  updateEquipmentMovement,
} from 'src/services/equipment-movements-service'
import { listProducts } from 'src/services/products-service'
import { listClients } from 'src/services/clients-service'
import { listConsumables } from 'src/services/consumables-service'
import {
  createConsumableMovement,
  deleteConsumableMovement,
  listConsumableMovements,
} from 'src/services/consumable-movements-service'
import { listLocations } from 'src/services/locations-service'
import { listPersonnel } from 'src/services/personnel-service'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const catalogLoading = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const movements = ref([])
const fieldErrors = ref({})
const returnDialog = ref(false)
const returning = ref(false)
const selectedReturnMovementId = ref(null)
const returnForm = ref({
  date_return: '',
})

const equipmentTypeDefaults = ['entrada', 'salida', 'ajuste', 'renta', 'venta', 'mantenimiento']
const consumableTypeDefaults = ['entrada', 'salida', 'ajuste']
const movementSourceOptions = ['equipo', 'consumible']

const allProductOptions = ref([])
const productOptions = ref([])
const allConsumableOptions = ref([])
const consumableOptions = ref([])
const allClientOptions = ref([])
const clientOptions = ref([])
const allLocationOptions = ref([])
const locationOptions = ref([])
const allPersonnelOptions = ref([])
const personnelOptions = ref([])

const initialMovementForm = () => ({
  movement_source: 'equipo',
  product_id: null,
  consumable_id: null,
  client_id: null,
  location_id: null,
  personnel_id: null,
  type: 'renta',
  quantity: 1,
  movement_date: '',
  date_out: '',
  date_return: '',
  current_counter_bw: null,
  current_counter_color: null,
  counter_read_at: '',
  notes: '',
})

const movementForm = ref(initialMovementForm())

const equipmentTypeOptions = computed(() => {
  const dynamicTypes = movements.value
    .filter((movement) => movement.source === 'equipo')
    .map((movement) => movement.type)
    .filter((type) => typeof type === 'string' && type.trim() !== '')

  return Array.from(new Set([...equipmentTypeDefaults, ...dynamicTypes]))
})

const consumableTypeOptions = computed(() => {
  const dynamicTypes = movements.value
    .filter((movement) => movement.source === 'consumible')
    .map((movement) => movement.type)
    .filter((type) => typeof type === 'string' && type.trim() !== '')

  return Array.from(new Set([...consumableTypeDefaults, ...dynamicTypes]))
})

const formTypeOptions = computed(() =>
  movementForm.value.movement_source === 'consumible'
    ? consumableTypeOptions.value
    : equipmentTypeOptions.value,
)

const filterTypeOptions = computed(() => {
  if (filters.value.movement_source === 'equipo') {
    return equipmentTypeOptions.value
  }

  if (filters.value.movement_source === 'consumible') {
    return consumableTypeOptions.value
  }

  return Array.from(new Set([...equipmentTypeOptions.value, ...consumableTypeOptions.value]))
})

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
    label: 'Ubicación',
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
        location_label: item.location?.name || item.location_id || '-',
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

    const clientLabel = item.client?.name || item.client_id || '-'

    return {
      row_key: `equipo-${item.id}`,
      id: item.id,
      movement_source: 'equipo',
      product_id: item.product_id,
      consumable_id: null,
      client_id: item.client_id,
      item_label: productLabel || '-',
      client_label: clientLabel,
      location_label: item.location?.name || item.location_id || '-',
      personnel_label: item.personnel?.name || item.personnel_id || '-',
      type: item.type ?? '-',
      quantity: '-',
      date_out: item.date_out ?? '-',
      date_return: item.date_return ?? '',
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

watch(
  () => movementForm.value.movement_source,
  (source) => {
    const options =
      source === 'consumible' ? consumableTypeOptions.value : equipmentTypeOptions.value
    if (!options.includes(movementForm.value.type)) {
      movementForm.value.type = options[0] ?? ''
    }
  },
)

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

function filterConsumables(val, update) {
  update(() => {
    if (!val) {
      consumableOptions.value = allConsumableOptions.value
      return
    }

    const needle = val.toLowerCase()
    consumableOptions.value = allConsumableOptions.value.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  })
}

function filterLocations(val, update) {
  update(() => {
    if (!val) {
      locationOptions.value = allLocationOptions.value
      return
    }

    const needle = val.toLowerCase()
    locationOptions.value = allLocationOptions.value.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  })
}

function filterPersonnel(val, update) {
  update(() => {
    if (!val) {
      personnelOptions.value = allPersonnelOptions.value
      return
    }

    const needle = val.toLowerCase()
    personnelOptions.value = allPersonnelOptions.value.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  })
}

async function loadCatalogs() {
  catalogLoading.value = true

  try {
    const [productsData, clientsData, consumablesData, locationsData, personnelData] =
      await Promise.all([
        listProducts(),
        listClients(),
        listConsumables(),
        listLocations(),
        listPersonnel(),
      ])

    const products = normalizePayload(productsData)
    const clients = normalizePayload(clientsData)
    const consumables = normalizePayload(consumablesData)
    const locations = normalizePayload(locationsData)
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

    allLocationOptions.value = locations.map((location) => ({
      id: location.id,
      label: location.name || `Ubicación ${location.id}`,
    }))

    allPersonnelOptions.value = personnel.map((person) => ({
      id: person.id,
      label: person.name || `Personal ${person.id}`,
    }))

    productOptions.value = allProductOptions.value
    clientOptions.value = allClientOptions.value
    consumableOptions.value = allConsumableOptions.value
    locationOptions.value = allLocationOptions.value
    personnelOptions.value = allPersonnelOptions.value
  } finally {
    catalogLoading.value = false
  }
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

async function onCreateMovement() {
  saving.value = true
  fieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  if (!movementForm.value.personnel_id) {
    fieldErrors.value = { personnel_id: 'Selecciona el personal responsable.' }
    saving.value = false
    return
  }

  try {
    if (movementForm.value.movement_source === 'consumible') {
      const payload = {
        consumable_id: movementForm.value.consumable_id,
        client_id: movementForm.value.client_id || null,
        location_id: movementForm.value.location_id || null,
        personnel_id: movementForm.value.personnel_id,
        type: movementForm.value.type,
        quantity: Number(movementForm.value.quantity || 0),
        movement_date: movementForm.value.movement_date,
        notes: movementForm.value.notes,
      }

      await createConsumableMovement(payload)
    } else {
      const payload = {
        product_id: movementForm.value.product_id,
        client_id: movementForm.value.client_id || null,
        location_id: movementForm.value.location_id || null,
        personnel_id: movementForm.value.personnel_id,
        type: movementForm.value.type,
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
        date_out: movementForm.value.date_out,
        date_return: movementForm.value.date_return || null,
        notes: movementForm.value.notes,
      }

      await createEquipmentMovement(payload)
    }

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

function onOpenReturnDialog(row) {
  selectedReturnMovementId.value = row.id
  returnForm.value = {
    date_return: '',
  }
  returnDialog.value = true
}

async function onSubmitReturnDate() {
  if (!selectedReturnMovementId.value || !returnForm.value.date_return) {
    return
  }

  returning.value = true

  try {
    await updateEquipmentMovement(selectedReturnMovementId.value, {
      date_return: returnForm.value.date_return,
    })

    returnDialog.value = false
    selectedReturnMovementId.value = null
    $q.notify({ type: 'positive', message: 'Devolución registrada.' })
    await loadHistory()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible registrar devolución.'
    }
  } finally {
    returning.value = false
  }
}

async function onDeleteMovement(row) {
  try {
    await $q.dialog({
      title: 'Confirmar',
      message: '¿Deseas eliminar este movimiento?',
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
})
</script>
