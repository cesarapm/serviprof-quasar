<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacén · Consumibles</div>
        <div class="text-grey-7">Módulo opcional</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Recargar"
          :loading="loading"
          @click="loadConsumables"
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
        <div class="text-subtitle1">Nuevo consumible</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onCreateConsumable">
          <div class="col-12 col-md-4">
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
              v-model="form.part_number"
              label="No. parte"
              outlined
              dense
              :error="Boolean(fieldErrors.part_number)"
              :error-message="fieldErrors.part_number"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.serial_number"
              label="Serie"
              outlined
              dense
              :error="Boolean(fieldErrors.serial_number)"
              :error-message="fieldErrors.serial_number"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.brand"
              label="Marca"
              outlined
              dense
              :error="Boolean(fieldErrors.brand)"
              :error-message="fieldErrors.brand"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.model"
              label="Modelo"
              outlined
              dense
              :error="Boolean(fieldErrors.model)"
              :error-message="fieldErrors.model"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.status"
              label="Estado"
              outlined
              dense
              use-input
              fill-input
              hide-selected
              new-value-mode="add-unique"
              :options="statusOptions"
              :error="Boolean(fieldErrors.status)"
              :error-message="fieldErrors.status"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.unit"
              label="Unidad"
              outlined
              dense
              :options="unitOptions"
              :error="Boolean(fieldErrors.unit)"
              :error-message="fieldErrors.unit"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.stock_quantity"
              type="number"
              min="0"
              label="Cantidad"
              outlined
              dense
              :error="Boolean(fieldErrors.stock_quantity)"
              :error-message="fieldErrors.stock_quantity"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.minimum_stock"
              type="number"
              min="0"
              label="Stock mínimo"
              outlined
              dense
              :error="Boolean(fieldErrors.minimum_stock)"
              :error-message="fieldErrors.minimum_stock"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.stock_reserved"
              type="number"
              min="0"
              label="Stock reservado"
              outlined
              dense
              :error="Boolean(fieldErrors.stock_reserved)"
              :error-message="fieldErrors.stock_reserved"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.batch"
              label="Lote"
              outlined
              dense
              :error="Boolean(fieldErrors.batch)"
              :error-message="fieldErrors.batch"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.supplier"
              label="Proveedor"
              outlined
              dense
              :error="Boolean(fieldErrors.supplier)"
              :error-message="fieldErrors.supplier"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.location_id"
              label="Ubicación"
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
              :options="locationOptions"
              :loading="locationLoading"
              @filter="filterLocations"
              :error="Boolean(fieldErrors.location_id)"
              :error-message="fieldErrors.location_id"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.personnel_id"
              label="Personal"
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
              :loading="personnelLoading"
              @filter="filterPersonnel"
              :error="Boolean(fieldErrors.personnel_id)"
              :error-message="fieldErrors.personnel_id"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.sub_location"
              label="Sub ubicación"
              outlined
              dense
              :error="Boolean(fieldErrors.sub_location)"
              :error-message="fieldErrors.sub_location"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.inventory_status"
              label="Estado inventario"
              outlined
              dense
              :options="inventoryStatusOptions"
              :error="Boolean(fieldErrors.inventory_status)"
              :error-message="fieldErrors.inventory_status"
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="form.notes"
              type="textarea"
              autogrow
              label="Notas"
              outlined
              dense
              :error="Boolean(fieldErrors.notes)"
              :error-message="fieldErrors.notes"
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
      <q-card-section class="q-pb-none">
        <q-toggle v-model="showLowStockOnly" dense label="Solo stock bajo" color="negative" />
      </q-card-section>
      <q-table
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay consumibles registrados"
      >
        <template #body-cell-available="props">
          <q-td :props="props" class="text-right">
            <q-badge :color="props.row.low_stock ? 'negative' : 'positive'" text-color="white">
              {{ props.row.available }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right q-gutter-xs">
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              label="Editar"
              @click="onEditConsumable(props.row.id)"
            />
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              :loading="deletingId === props.row.id"
              label="Eliminar"
              @click="onDeleteConsumable(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 100%; max-width: 760px">
        <q-card-section>
          <div class="text-subtitle1">Editar consumible</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form class="row q-col-gutter-md" @submit="onUpdateConsumable">
            <div class="col-12 col-md-6">
              <q-select
                v-model="editForm.type"
                label="Tipo"
                outlined
                dense
                :options="typeOptions"
                :error="Boolean(editFieldErrors.type)"
                :error-message="editFieldErrors.type"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.name"
                label="Nombre"
                outlined
                dense
                :error="Boolean(editFieldErrors.name)"
                :error-message="editFieldErrors.name"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.part_number"
                label="No. parte"
                outlined
                dense
                :error="Boolean(editFieldErrors.part_number)"
                :error-message="editFieldErrors.part_number"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.serial_number"
                label="Serie"
                outlined
                dense
                :error="Boolean(editFieldErrors.serial_number)"
                :error-message="editFieldErrors.serial_number"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.brand"
                label="Marca"
                outlined
                dense
                :error="Boolean(editFieldErrors.brand)"
                :error-message="editFieldErrors.brand"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.model"
                label="Modelo"
                outlined
                dense
                :error="Boolean(editFieldErrors.model)"
                :error-message="editFieldErrors.model"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="editForm.status"
                label="Estado"
                outlined
                dense
                use-input
                fill-input
                hide-selected
                new-value-mode="add-unique"
                :options="statusOptions"
                :error="Boolean(editFieldErrors.status)"
                :error-message="editFieldErrors.status"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="editForm.unit"
                label="Unidad"
                outlined
                dense
                :options="unitOptions"
                :error="Boolean(editFieldErrors.unit)"
                :error-message="editFieldErrors.unit"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="editForm.stock_quantity"
                type="number"
                min="0"
                label="Cantidad"
                outlined
                dense
                :error="Boolean(editFieldErrors.stock_quantity)"
                :error-message="editFieldErrors.stock_quantity"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="editForm.minimum_stock"
                type="number"
                min="0"
                label="Stock mínimo"
                outlined
                dense
                :error="Boolean(editFieldErrors.minimum_stock)"
                :error-message="editFieldErrors.minimum_stock"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="editForm.stock_reserved"
                type="number"
                min="0"
                label="Stock reservado"
                outlined
                dense
                :error="Boolean(editFieldErrors.stock_reserved)"
                :error-message="editFieldErrors.stock_reserved"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.batch"
                label="Lote"
                outlined
                dense
                :error="Boolean(editFieldErrors.batch)"
                :error-message="editFieldErrors.batch"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.supplier"
                label="Proveedor"
                outlined
                dense
                :error="Boolean(editFieldErrors.supplier)"
                :error-message="editFieldErrors.supplier"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="editForm.location_id"
                label="Ubicación"
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
                :options="locationOptions"
                :loading="locationLoading"
                @filter="filterLocations"
                :error="Boolean(editFieldErrors.location_id)"
                :error-message="editFieldErrors.location_id"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="editForm.personnel_id"
                label="Personal"
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
                :loading="personnelLoading"
                @filter="filterPersonnel"
                :error="Boolean(editFieldErrors.personnel_id)"
                :error-message="editFieldErrors.personnel_id"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="editForm.sub_location"
                label="Sub ubicación"
                outlined
                dense
                :error="Boolean(editFieldErrors.sub_location)"
                :error-message="editFieldErrors.sub_location"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="editForm.inventory_status"
                label="Estado inventario"
                outlined
                dense
                :options="inventoryStatusOptions"
                :error="Boolean(editFieldErrors.inventory_status)"
                :error-message="editFieldErrors.inventory_status"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="editForm.notes"
                type="textarea"
                autogrow
                label="Notas"
                outlined
                dense
                :error="Boolean(editFieldErrors.notes)"
                :error-message="editFieldErrors.notes"
              />
            </div>
            <div class="col-12 row justify-end q-gutter-sm">
              <q-btn flat no-caps color="grey-8" label="Cancelar" @click="closeEditDialog" />
              <q-btn type="submit" color="primary" no-caps label="Actualizar" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import {
  createConsumable,
  deleteConsumable,
  listConsumables,
  showConsumable,
  updateConsumable,
} from 'src/services/consumables-service'
import { listLocations } from 'src/services/locations-service'
import { listPersonnel } from 'src/services/personnel-service'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})
const editFieldErrors = ref({})
const editDialog = ref(false)
const editingConsumableId = ref(null)
const deletingId = ref(null)
const consumables = ref([])
const showLowStockOnly = ref(false)
const allLocations = ref([])
const locationOptions = ref([])
const locationLoading = ref(false)
const allPersonnel = ref([])
const personnelOptions = ref([])
const personnelLoading = ref(false)

const typeOptions = ['refaccion', 'tinta', 'toner', 'otras']
const defaultStatusOptions = ['nuevo', 'usado', 'renta', 'reparacion']
const unitOptions = ['pieza', 'caja', 'kit', 'litro', 'ml']
const inventoryStatusOptions = ['disponible', 'rentado', 'vendido', 'mantenimiento']

const initialForm = () => ({
  type: 'refaccion',
  name: '',
  part_number: '',
  serial_number: '',
  brand: '',
  model: '',
  status: 'nuevo',
  unit: 'pieza',
  stock_quantity: 0,
  minimum_stock: 0,
  stock_reserved: 0,
  batch: '',
  supplier: '',
  location_id: '',
  personnel_id: '',
  sub_location: '',
  inventory_status: 'disponible',
  notes: '',
})

const form = ref(initialForm())
const editForm = ref(initialForm())

const statusOptions = computed(() => {
  const dynamicStatuses = consumables.value
    .map((item) => item?.status)
    .filter((status) => typeof status === 'string' && status.trim() !== '')

  return Array.from(new Set([...defaultStatusOptions, ...dynamicStatuses]))
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  {
    name: 'part_number',
    label: 'No. parte',
    field: 'part_number',
    align: 'left',
    sortable: true,
  },
  {
    name: 'stock_quantity',
    label: 'Cantidad',
    field: 'stock_quantity',
    align: 'right',
    sortable: true,
  },
  {
    name: 'stock_reserved',
    label: 'Reservado',
    field: 'stock_reserved',
    align: 'right',
    sortable: true,
  },
  {
    name: 'available',
    label: 'Disponible real',
    field: 'available',
    align: 'right',
    sortable: true,
  },
  {
    name: 'minimum_stock',
    label: 'Mínimo',
    field: 'minimum_stock',
    align: 'right',
    sortable: true,
  },
  { name: 'unit', label: 'Unidad', field: 'unit', align: 'left', sortable: true },
  {
    name: 'inventory_status',
    label: 'Inventario',
    field: 'inventory_status',
    align: 'left',
    sortable: true,
  },
  { name: 'batch', label: 'Lote', field: 'batch', align: 'left', sortable: true },
  { name: 'supplier', label: 'Proveedor', field: 'supplier', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const rows = computed(() =>
  consumables.value.map((item) => ({
    id: item.id,
    type: item.type ?? '-',
    name: item.name ?? '-',
    part_number: item.part_number ?? '-',
    stock_quantity: Number(item.stock_quantity ?? 0),
    stock_reserved: Number(item.stock_reserved ?? 0),
    available: Math.max(Number(item.stock_quantity ?? 0) - Number(item.stock_reserved ?? 0), 0),
    low_stock:
      Number(item.stock_quantity ?? 0) - Number(item.stock_reserved ?? 0) <=
      Number(item.minimum_stock ?? 0),
    minimum_stock: Number(item.minimum_stock ?? 0),
    unit: item.unit ?? '-',
    inventory_status: item.inventory_status ?? '-',
    batch: item.batch ?? '-',
    supplier: item.supplier ?? '-',
  })),
)

async function loadLocations() {
  locationLoading.value = true

  try {
    const data = await listLocations()
    const locations = normalizePayload(data)

    allLocations.value = locations.map((location) => ({
      id: location.id,
      label: `${location.name} (${location.type})`,
    }))

    locationOptions.value = allLocations.value
  } finally {
    locationLoading.value = false
  }
}

function filterLocations(val, update) {
  update(() => {
    if (val === '') {
      locationOptions.value = allLocations.value
      return
    }

    const needle = val.toLowerCase()
    locationOptions.value = allLocations.value.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  })
}

async function loadPersonnel() {
  personnelLoading.value = true

  try {
    const data = await listPersonnel()
    const personnel = normalizePayload(data)

    allPersonnel.value = personnel.map((person) => ({
      id: person.id,
      label: `${person.name}${person.position ? ` (${person.position})` : ''}`,
    }))

    personnelOptions.value = allPersonnel.value
  } finally {
    personnelLoading.value = false
  }
}

function filterPersonnel(val, update) {
  update(() => {
    if (val === '') {
      personnelOptions.value = allPersonnel.value
      return
    }

    const needle = val.toLowerCase()
    personnelOptions.value = allPersonnel.value.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  })
}

const filteredRows = computed(() =>
  showLowStockOnly.value ? rows.value.filter((item) => item.low_stock) : rows.value,
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
  form.value = initialForm()
  fieldErrors.value = {}
}

function buildConsumablePayload(values) {
  return {
    type: values.type,
    name: values.name?.trim(),
    part_number: values.part_number?.trim() || null,
    serial_number: values.serial_number?.trim() || null,
    brand: values.brand?.trim() || null,
    model: values.model?.trim() || null,
    status: values.status?.trim(),
    unit: values.unit,
    stock_quantity: Number(values.stock_quantity ?? 0),
    minimum_stock: Number(values.minimum_stock ?? 0),
    stock_reserved: Number(values.stock_reserved ?? 0),
    batch: values.batch?.trim() || null,
    supplier: values.supplier?.trim() || null,
    location_id: values.location_id ? Number(values.location_id) : null,
    personnel_id: values.personnel_id ? Number(values.personnel_id) : null,
    sub_location: values.sub_location?.trim() || null,
    notes: values.notes?.trim() || null,
    inventory_status: values.inventory_status,
  }
}

function validateReservedStock(payload, targetErrors) {
  if (payload.stock_reserved > payload.stock_quantity) {
    targetErrors.value = {
      ...targetErrors.value,
      stock_reserved: 'El stock reservado no puede ser mayor al stock actual.',
    }

    return false
  }

  return true
}

function setEditForm(item) {
  editForm.value = {
    type: item.type ?? 'refaccion',
    name: item.name ?? '',
    part_number: item.part_number ?? '',
    serial_number: item.serial_number ?? '',
    brand: item.brand ?? '',
    model: item.model ?? '',
    status: item.status ?? 'nuevo',
    unit: item.unit ?? 'pieza',
    stock_quantity: Number(item.stock_quantity ?? 0),
    minimum_stock: Number(item.minimum_stock ?? 0),
    stock_reserved: Number(item.stock_reserved ?? 0),
    batch: item.batch ?? '',
    supplier: item.supplier ?? '',
    location_id: item.location_id ?? '',
    personnel_id: item.personnel_id ?? item.personal_id ?? item.personnel?.id ?? '',
    sub_location: item.sub_location ?? '',
    notes: item.notes ?? '',
    inventory_status: item.inventory_status ?? 'disponible',
  }
}

async function loadConsumables(options = {}) {
  const { silent = false } = options

  loading.value = true

  if (!silent) {
    errorMessage.value = ''
  }

  try {
    const data = await listConsumables()
    consumables.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    if (!silent) {
      consumables.value = []
      backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

      if (!backendUnavailable.value) {
        errorMessage.value = error.response?.data?.message || 'No fue posible cargar consumibles.'
      }
    }
  } finally {
    loading.value = false
  }
}

async function onCreateConsumable() {
  saving.value = true
  fieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  const payload = buildConsumablePayload(form.value)

  if (!validateReservedStock(payload, fieldErrors)) {
    saving.value = false
    return
  }

  try {
    const created = await createConsumable(payload)
    const createdItem = normalizeSingleItem(created)

    if (createdItem) {
      const exists = consumables.value.some((item) => item.id === createdItem.id)

      if (!exists) {
        consumables.value = [createdItem, ...consumables.value]
      }
    } else {
      consumables.value = [
        {
          id: `tmp-${Date.now()}`,
          ...payload,
        },
        ...consumables.value,
      ]
    }

    $q.notify({ type: 'positive', message: 'Consumible registrado.' })
    resetForm()
    await loadConsumables({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    fieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(fieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible guardar consumible.'
    }
  } finally {
    saving.value = false
  }
}

async function onEditConsumable(id) {
  editingConsumableId.value = id
  editFieldErrors.value = {}
  errorMessage.value = ''

  try {
    const response = await showConsumable(id)
    const item = normalizeSingleItem(response)

    if (!item) {
      errorMessage.value = 'No fue posible cargar el detalle del consumible.'
      return
    }

    setEditForm(item)
    editDialog.value = true
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible cargar consumible.'
    }
  }
}

function closeEditDialog() {
  editDialog.value = false
  editingConsumableId.value = null
  editFieldErrors.value = {}
  editForm.value = initialForm()
}

async function onUpdateConsumable() {
  if (!editingConsumableId.value) {
    return
  }

  saving.value = true
  editFieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  const payload = buildConsumablePayload(editForm.value)

  if (!validateReservedStock(payload, editFieldErrors)) {
    saving.value = false
    return
  }

  try {
    await updateConsumable(editingConsumableId.value, payload)
    $q.notify({ type: 'positive', message: 'Consumible actualizado.' })
    closeEditDialog()
    await loadConsumables({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    editFieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(editFieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible actualizar consumible.'
    }
  } finally {
    saving.value = false
  }
}

async function onDeleteConsumable(id) {
  try {
    await $q.dialog({
      title: 'Confirmar',
      message: '¿Deseas eliminar este consumible?',
      cancel: true,
      persistent: true,
    })
  } catch {
    return
  }

  deletingId.value = id
  errorMessage.value = ''
  backendUnavailable.value = false

  try {
    await deleteConsumable(id)
    $q.notify({ type: 'positive', message: 'Consumible eliminado.' })
    await loadConsumables({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible eliminar consumible.'
    }
  } finally {
    deletingId.value = null
  }
}

onMounted(async () => {
  await Promise.all([loadConsumables(), loadLocations(), loadPersonnel()])
})
</script>
