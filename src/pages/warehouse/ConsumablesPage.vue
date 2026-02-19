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

const initialForm = () => ({
  name: '',
  stock_quantity: 0,
  minimum_stock: 0,
  stock_reserved: 0,
  batch: '',
  supplier: '',
})

const form = ref(initialForm())
const editForm = ref(initialForm())

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
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
  { name: 'batch', label: 'Lote', field: 'batch', align: 'left', sortable: true },
  { name: 'supplier', label: 'Proveedor', field: 'supplier', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const rows = computed(() =>
  consumables.value.map((item) => ({
    id: item.id,
    name: item.name ?? '-',
    stock_quantity: Number(item.stock_quantity ?? 0),
    stock_reserved: Number(item.stock_reserved ?? 0),
    available: Math.max(Number(item.stock_quantity ?? 0) - Number(item.stock_reserved ?? 0), 0),
    low_stock:
      Number(item.stock_quantity ?? 0) - Number(item.stock_reserved ?? 0) <=
      Number(item.minimum_stock ?? 0),
    minimum_stock: Number(item.minimum_stock ?? 0),
    batch: item.batch ?? '-',
    supplier: item.supplier ?? '-',
  })),
)

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
    name: values.name?.trim(),
    stock_quantity: Number(values.stock_quantity ?? 0),
    minimum_stock: Number(values.minimum_stock ?? 0),
    stock_reserved: Number(values.stock_reserved ?? 0),
    batch: values.batch?.trim() || null,
    supplier: values.supplier?.trim() || null,
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
    name: item.name ?? '',
    stock_quantity: Number(item.stock_quantity ?? 0),
    minimum_stock: Number(item.minimum_stock ?? 0),
    stock_reserved: Number(item.stock_reserved ?? 0),
    batch: item.batch ?? '',
    supplier: item.supplier ?? '',
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

onMounted(loadConsumables)
</script>
