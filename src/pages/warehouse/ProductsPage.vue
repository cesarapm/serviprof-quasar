<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-sm">Almacén · Alta de productos</div>

    <q-banner
      v-if="backendUnavailable && rows.length === 0"
      dense
      rounded
      class="bg-orange-1 text-orange-10 q-mb-md"
    >
      No hay conexión con el backend. Verifica que Laravel esté encendido.
    </q-banner>

    <q-banner v-if="errorMessage" dense rounded class="bg-red-1 text-red-8 q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Nuevo producto</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onCreateProduct">
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
              v-model="form.spd_internal_id"
              label="ID interno SPD"
              outlined
              dense
              :error="Boolean(fieldErrors.spd_internal_id)"
              :error-message="fieldErrors.spd_internal_id"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.classification"
              label="Clasificación"
              outlined
              dense
              :options="classificationOptions"
              :error="Boolean(fieldErrors.classification)"
              :error-message="fieldErrors.classification"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.commercial_condition"
              label="Condición comercial"
              outlined
              dense
              :options="commercialConditionOptions"
              :error="Boolean(fieldErrors.commercial_condition)"
              :error-message="fieldErrors.commercial_condition"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.status"
              label="Estado"
              outlined
              dense
              :options="statusOptions"
              :error="Boolean(fieldErrors.status)"
              :error-message="fieldErrors.status"
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
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.current_counter_bw"
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
              v-model.number="form.current_counter_color"
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
              v-model="form.counter_read_at"
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
              v-model.number="form.acquisition_cost"
              type="number"
              min="0"
              step="0.01"
              label="Costo de adquisición"
              outlined
              dense
              :error="Boolean(fieldErrors.acquisition_cost)"
              :error-message="fieldErrors.acquisition_cost"
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
            <q-input
              v-model="form.acquisition_date"
              type="date"
              label="Fecha de compra"
              outlined
              dense
              :error="Boolean(fieldErrors.acquisition_date)"
              :error-message="fieldErrors.acquisition_date"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.book_value"
              type="number"
              min="0"
              step="0.01"
              label="Valor en libros"
              outlined
              dense
              :error="Boolean(fieldErrors.book_value)"
              :error-message="fieldErrors.book_value"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.depreciation_amount"
              type="number"
              min="0"
              step="0.01"
              label="Depreciación"
              outlined
              dense
              :error="Boolean(fieldErrors.depreciation_amount)"
              :error-message="fieldErrors.depreciation_amount"
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
            <q-input
              v-model="form.entry_date"
              type="date"
              label="Fecha de entrada"
              outlined
              dense
              :error="Boolean(fieldErrors.entry_date)"
              :error-message="fieldErrors.entry_date"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.notes" label="Notas" outlined dense />
          </div>
          <div class="col-12 row justify-end q-gutter-sm">
            <q-btn flat no-caps color="grey-8" label="Limpiar" @click="resetForm" />
            <q-btn
              type="submit"
              color="primary"
              no-caps
              label="Guardar producto"
              :loading="saving"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h6">Listado</div>
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

    <q-card>
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay productos para mostrar"
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              label="Editar"
              @click="onEditProduct(props.row.id)"
            />
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              label="Eliminar"
              @click="onDeleteProduct(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 100%; max-width: 1100px">
        <q-card-section>
          <div class="text-subtitle1">Editar producto</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form class="row q-col-gutter-md" @submit="onUpdateProduct">
            <div class="col-12 col-md-4">
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
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.brand"
                label="Marca"
                outlined
                dense
                :error="Boolean(editFieldErrors.brand)"
                :error-message="editFieldErrors.brand"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.model"
                label="Modelo"
                outlined
                dense
                :error="Boolean(editFieldErrors.model)"
                :error-message="editFieldErrors.model"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.serial_number"
                label="Serie"
                outlined
                dense
                :error="Boolean(editFieldErrors.serial_number)"
                :error-message="editFieldErrors.serial_number"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.spd_internal_id"
                label="ID interno SPD"
                outlined
                dense
                :error="Boolean(editFieldErrors.spd_internal_id)"
                :error-message="editFieldErrors.spd_internal_id"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="editForm.classification"
                label="Clasificación"
                outlined
                dense
                :options="classificationOptions"
                :error="Boolean(editFieldErrors.classification)"
                :error-message="editFieldErrors.classification"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="editForm.commercial_condition"
                label="Condición comercial"
                outlined
                dense
                :options="commercialConditionOptions"
                :error="Boolean(editFieldErrors.commercial_condition)"
                :error-message="editFieldErrors.commercial_condition"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="editForm.status"
                label="Estado"
                outlined
                dense
                :options="statusOptions"
                :error="Boolean(editFieldErrors.status)"
                :error-message="editFieldErrors.status"
              />
            </div>
            <div class="col-12 col-md-4">
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
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="editForm.current_counter_bw"
                type="number"
                min="0"
                label="Contador B/N"
                outlined
                dense
                :error="Boolean(editFieldErrors.current_counter_bw)"
                :error-message="editFieldErrors.current_counter_bw"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="editForm.current_counter_color"
                type="number"
                min="0"
                label="Contador color"
                outlined
                dense
                :error="Boolean(editFieldErrors.current_counter_color)"
                :error-message="editFieldErrors.current_counter_color"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.counter_read_at"
                type="date"
                label="Fecha lectura contadores"
                outlined
                dense
                :error="Boolean(editFieldErrors.counter_read_at)"
                :error-message="editFieldErrors.counter_read_at"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="editForm.acquisition_cost"
                type="number"
                min="0"
                step="0.01"
                label="Costo de adquisición"
                outlined
                dense
                :error="Boolean(editFieldErrors.acquisition_cost)"
                :error-message="editFieldErrors.acquisition_cost"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.supplier"
                label="Proveedor"
                outlined
                dense
                :error="Boolean(editFieldErrors.supplier)"
                :error-message="editFieldErrors.supplier"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.acquisition_date"
                type="date"
                label="Fecha de compra"
                outlined
                dense
                :error="Boolean(editFieldErrors.acquisition_date)"
                :error-message="editFieldErrors.acquisition_date"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="editForm.book_value"
                type="number"
                min="0"
                step="0.01"
                label="Valor en libros"
                outlined
                dense
                :error="Boolean(editFieldErrors.book_value)"
                :error-message="editFieldErrors.book_value"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="editForm.depreciation_amount"
                type="number"
                min="0"
                step="0.01"
                label="Depreciación"
                outlined
                dense
                :error="Boolean(editFieldErrors.depreciation_amount)"
                :error-message="editFieldErrors.depreciation_amount"
              />
            </div>
            <div class="col-12 col-md-4">
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
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.entry_date"
                type="date"
                label="Fecha de entrada"
                outlined
                dense
                :error="Boolean(editFieldErrors.entry_date)"
                :error-message="editFieldErrors.entry_date"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input v-model="editForm.notes" label="Notas" outlined dense />
            </div>

            <div class="col-12 row justify-end q-gutter-sm">
              <q-btn flat no-caps color="grey-8" label="Cancelar" @click="closeEditDialog" />
              <q-btn
                type="submit"
                color="primary"
                no-caps
                label="Actualizar producto"
                :loading="saving"
              />
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
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from 'src/services/products-service'
import { listLocations } from 'src/services/locations-service'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const rawProducts = ref([])
const fieldErrors = ref({})
const editFieldErrors = ref({})
const editDialog = ref(false)
const editingProductId = ref(null)
const originalEditPayload = ref(null)
const allLocations = ref([])
const locationOptions = ref([])
const locationLoading = ref(false)

const typeOptions = ['copiadora', 'impresora']
const statusOptions = ['nuevo', 'usado', 'renta', 'reparacion']
const inventoryStatusOptions = ['disponible', 'rentado', 'vendido', 'mantenimiento']
const classificationOptions = ['renta', 'venta', 'refaccion', 'demo', 'taller']
const commercialConditionOptions = ['a1', 'a2', 'b', 'c']

const initialForm = () => ({
  type: 'impresora',
  brand: '',
  model: '',
  serial_number: '',
  spd_internal_id: '',
  current_counter_bw: null,
  current_counter_color: null,
  counter_read_at: '',
  status: 'nuevo',
  inventory_status: 'disponible',
  classification: 'renta',
  commercial_condition: 'a1',
  acquisition_cost: null,
  supplier: '',
  acquisition_date: '',
  book_value: null,
  depreciation_amount: null,
  location_id: '',
  entry_date: '',
  notes: '',
})

const form = ref(initialForm())
const editForm = ref(initialForm())

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left', sortable: true },
  { name: 'brand', label: 'Marca', field: 'brand', align: 'left', sortable: true },
  { name: 'model', label: 'Modelo', field: 'model', align: 'left', sortable: true },
  {
    name: 'spd_internal_id',
    label: 'SPD',
    field: 'spd_internal_id',
    align: 'left',
    sortable: true,
  },
  { name: 'serial_number', label: 'Serie', field: 'serial_number', align: 'left', sortable: true },
  {
    name: 'classification',
    label: 'Clasificación',
    field: 'classification',
    align: 'left',
    sortable: true,
  },
  {
    name: 'commercial_condition',
    label: 'Condición',
    field: 'commercial_condition',
    align: 'left',
    sortable: true,
  },
  {
    name: 'acquisition_cost',
    label: 'Costo',
    field: 'acquisition_cost',
    align: 'left',
    sortable: true,
  },
  { name: 'supplier', label: 'Proveedor', field: 'supplier', align: 'left', sortable: true },
  {
    name: 'inventory_status',
    label: 'Inventario',
    field: 'inventory_status',
    align: 'left',
    sortable: true,
  },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const rows = computed(() => {
  return rawProducts.value.map((product) => ({
    id: product.id,
    type: product.type ?? '-',
    brand: product.brand ?? '-',
    model: product.model ?? '-',
    spd_internal_id: product.spd_internal_id ?? '-',
    serial_number: product.serial_number ?? '-',
    classification: product.classification ?? '-',
    commercial_condition: product.commercial_condition ?? '-',
    acquisition_cost:
      product.acquisition_cost !== null && product.acquisition_cost !== undefined
        ? Number(product.acquisition_cost).toFixed(2)
        : '-',
    supplier: product.supplier ?? '-',
    inventory_status: product.inventory_status ?? '-',
  }))
})

function normalizeNullableNumber(value) {
  return value === '' || value === null || value === undefined ? null : Number(value)
}

function normalizePayload(data) {
  const candidates = [
    data,
    data?.data,
    data?.data?.data,
    data?.items,
    data?.results,
    data?.products,
    data?.products?.data,
  ]

  const collection = candidates.find((candidate) => Array.isArray(candidate))
  return collection ?? []
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

async function loadProducts(options = {}) {
  const { silent = false } = options

  loading.value = true

  if (!silent) {
    errorMessage.value = ''
  }

  try {
    const data = await listProducts()
    rawProducts.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    if (!silent) {
      rawProducts.value = []
      backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

      if (!backendUnavailable.value) {
        errorMessage.value = error.response?.data?.message || 'No fue posible cargar productos.'
      }
    }
  } finally {
    loading.value = false
  }
}

function mapValidationErrors(error) {
  if (error?.response?.status !== 422) {
    return {}
  }

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

function buildPayload(values) {
  const payload = {
    ...values,
    spd_internal_id: values.spd_internal_id?.trim(),
    current_counter_bw: normalizeNullableNumber(values.current_counter_bw),
    current_counter_color: normalizeNullableNumber(values.current_counter_color),
    counter_read_at: values.counter_read_at || null,
    acquisition_cost: normalizeNullableNumber(values.acquisition_cost),
    supplier: values.supplier?.trim(),
    acquisition_date: values.acquisition_date || null,
    book_value: normalizeNullableNumber(values.book_value),
    depreciation_amount: normalizeNullableNumber(values.depreciation_amount),
    location_id: values.location_id ? Number(values.location_id) : null,
    entry_date: values.entry_date || null,
    notes: values.notes?.trim() || null,
  }

  return payload
}

function buildPartialPayload(currentPayload, originalPayload) {
  if (!originalPayload) {
    return currentPayload
  }

  return Object.entries(currentPayload).reduce((accumulator, [key, value]) => {
    if (originalPayload[key] !== value) {
      accumulator[key] = value
    }

    return accumulator
  }, {})
}

function setEditFormFromProduct(product) {
  editForm.value = {
    type: product.type ?? 'impresora',
    brand: product.brand ?? '',
    model: product.model ?? '',
    serial_number: product.serial_number ?? '',
    spd_internal_id: product.spd_internal_id ?? '',
    current_counter_bw: product.current_counter_bw ?? null,
    current_counter_color: product.current_counter_color ?? null,
    counter_read_at: product.counter_read_at ?? '',
    status: product.status ?? 'nuevo',
    inventory_status: product.inventory_status ?? 'disponible',
    classification: product.classification ?? 'renta',
    commercial_condition: product.commercial_condition ?? 'a1',
    acquisition_cost: product.acquisition_cost ?? null,
    supplier: product.supplier ?? '',
    acquisition_date: product.acquisition_date ?? '',
    book_value: product.book_value ?? null,
    depreciation_amount: product.depreciation_amount ?? null,
    location_id: product.location_id ?? '',
    entry_date: product.entry_date ?? '',
    notes: product.notes ?? '',
  }
}

async function onEditProduct(id) {
  editingProductId.value = id
  editFieldErrors.value = {}
  errorMessage.value = ''

  try {
    const detail = await getProduct(id)
    const product = normalizeSingleItem(detail)

    if (!product) {
      errorMessage.value = 'No fue posible obtener el detalle del producto.'
      return
    }

    setEditFormFromProduct(product)
    originalEditPayload.value = buildPayload(editForm.value)
    editDialog.value = true
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible cargar el producto.'
    }
  }
}

function closeEditDialog() {
  editDialog.value = false
  editingProductId.value = null
  originalEditPayload.value = null
  editFieldErrors.value = {}
  editForm.value = initialForm()
}

async function onCreateProduct() {
  saving.value = true
  fieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  const payload = buildPayload(form.value)

  try {
    const created = await createProduct(payload)
    const createdItem = normalizeSingleItem(created)

    if (createdItem) {
      const exists = rawProducts.value.some((item) => item.id === createdItem.id)

      if (!exists) {
        rawProducts.value = [createdItem, ...rawProducts.value]
      }
    } else {
      rawProducts.value = [
        {
          id: `tmp-${Date.now()}`,
          ...payload,
        },
        ...rawProducts.value,
      ]
    }

    $q.notify({ type: 'positive', message: 'Producto registrado.' })
    resetForm()
    await loadProducts({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    fieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(fieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible guardar el producto.'
    }
  } finally {
    saving.value = false
  }
}

async function onUpdateProduct() {
  if (!editingProductId.value) {
    return
  }

  saving.value = true
  editFieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  const fullPayload = buildPayload(editForm.value)
  const payload = buildPartialPayload(fullPayload, originalEditPayload.value)

  if (Object.keys(payload).length === 0) {
    $q.notify({ type: 'info', message: 'No hay cambios para actualizar.' })
    saving.value = false
    return
  }

  try {
    await updateProduct(editingProductId.value, payload)
    $q.notify({ type: 'positive', message: 'Producto actualizado.' })
    closeEditDialog()
    await loadProducts({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    editFieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(editFieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible actualizar el producto.'
    }
  } finally {
    saving.value = false
  }
}

async function onDeleteProduct(id) {
  try {
    await deleteProduct(id)
    $q.notify({ type: 'positive', message: 'Producto eliminado.' })
    await loadProducts()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible eliminar el producto.'
    }
  }
}

onMounted(async () => {
  await Promise.all([loadProducts(), loadLocations()])
})
</script>
