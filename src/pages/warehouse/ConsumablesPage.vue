<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacen · Consumibles</div>
        <div class="text-grey-7">Submodulo: {{ currentModuleLabel }}</div>
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

    <q-card class="q-mb-md">
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-12 col-md">
          <div class="text-subtitle1">Operacion de consumibles</div>
          <div class="text-caption text-grey-7">Separa captura de altas y movimientos.</div>
        </div>
        <div class="col-12 col-md-auto">
          <q-btn-toggle
            v-model="consumableModule"
            no-caps
            unelevated
            color="primary"
            toggle-color="primary"
            :options="moduleOptions"
          />
        </div>
      </q-card-section>
    </q-card>

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

    <q-card v-show="consumableModule === 'altas'" class="q-mb-md">
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

    <q-card v-show="consumableModule === 'movimientos'" class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Movimientos masivos de consumibles</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-3">
            <q-select
              v-model="movementForm.type"
              outlined
              dense
              label="Tipo"
              :options="movementTypeOptions"
              :error="Boolean(movementFieldErrors.type)"
              :error-message="movementFieldErrors.type"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="movementForm.personnel_id"
              outlined
              dense
              label="Responsable"
              option-label="label"
              option-value="id"
              emit-value
              map-options
              :options="personnelOptions"
              :error="Boolean(movementFieldErrors.personnel_id)"
              :error-message="movementFieldErrors.personnel_id"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="movementForm.movement_date"
              outlined
              dense
              type="date"
              label="Fecha"
              :error="Boolean(movementFieldErrors.movement_date)"
              :error-message="movementFieldErrors.movement_date"
            />
          </div>
          <div class="col-12 col-md-4" v-if="showMovementClient">
            <q-select
              v-model="movementForm.client_id"
              outlined
              dense
              clearable
              label="Cliente"
              option-label="label"
              option-value="id"
              emit-value
              map-options
              :options="clientOptions"
              :error="Boolean(movementFieldErrors.client_id)"
              :error-message="movementFieldErrors.client_id"
            />
          </div>
          <div class="col-12 col-md-4" v-if="showMovementClient">
            <q-input
              :model-value="selectedConsumableClientLocation?.label || 'Sin ubicacion de cliente'"
              outlined
              dense
              readonly
              label="Ubicacion cliente"
            />
          </div>
          <div class="col-12 col-md-8">
            <q-input v-model="movementForm.notes" outlined dense label="Nota general" />
          </div>
        </div>

        <div class="bulk-grid-wrapper">
          <table class="bulk-grid">
            <thead>
              <tr>
                <th>#</th>
                <th>Consumible</th>
                <th>Stock actual</th>
                <th>Ubicacion actual</th>
                <th v-if="showMovementClientColumn">Cliente fila</th>
                <th v-if="showMovementClientColumn">Ubicacion cliente</th>
                <th v-if="showFromLocationColumn">Ubicacion origen</th>
                <th v-if="showToLocationColumn">Ubicacion destino</th>
                <th>Cantidad</th>
                <th>Nota fila</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in movementRows" :key="row.row_key">
                <td class="index-cell">{{ index + 1 }}</td>
                <td>
                  <q-select
                    v-model="row.consumable_id"
                    outlined
                    dense
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="movementConsumableOptions"
                    @update:model-value="onChangeMovementConsumable(row)"
                    :error="Boolean(getMovementRowError(index, 'consumable_id'))"
                    :error-message="getMovementRowError(index, 'consumable_id')"
                  />
                </td>
                <td>
                  <q-input
                    :model-value="getConsumableStockLabel(row.consumable_id)"
                    outlined
                    dense
                    readonly
                  />
                </td>
                <td>
                  <q-input
                    :model-value="getConsumableLocationLabel(row.consumable_id)"
                    outlined
                    dense
                    readonly
                  />
                </td>
                <td v-if="showMovementClientColumn">
                  <q-select
                    v-model="row.client_id"
                    outlined
                    dense
                    clearable
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="clientOptions"
                    :error="Boolean(getMovementRowError(index, 'client_id'))"
                    :error-message="getMovementRowError(index, 'client_id')"
                  />
                </td>
                <td v-if="showMovementClientColumn">
                  <q-input :model-value="getRowClientLocationLabel(row)" outlined dense readonly />
                </td>
                <td v-if="showFromLocationColumn">
                  <q-select
                    v-model="row.from_location_id"
                    outlined
                    dense
                    clearable
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="getSourceLocationOptionsForConsumableRow(row)"
                    :error="Boolean(getMovementRowError(index, 'from_location_id'))"
                    :error-message="getMovementRowError(index, 'from_location_id')"
                  />
                </td>
                <td v-if="showToLocationColumn">
                  <q-select
                    v-model="row.location_id"
                    outlined
                    dense
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="getDestinationLocationOptionsForConsumableRow(row)"
                    :error="Boolean(getMovementRowError(index, 'location_id'))"
                    :error-message="getMovementRowError(index, 'location_id')"
                  />
                </td>
                <td>
                  <q-input
                    v-model.number="row.quantity"
                    type="number"
                    min="1"
                    outlined
                    dense
                    :error="Boolean(getMovementRowError(index, 'quantity'))"
                    :error-message="getMovementRowError(index, 'quantity')"
                  />
                </td>
                <td>
                  <q-input v-model="row.notes" outlined dense />
                </td>
                <td class="text-center">
                  <q-btn
                    flat
                    dense
                    round
                    icon="delete"
                    color="negative"
                    :disable="movementRows.length <= 1"
                    @click="removeMovementRow(index)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row justify-between items-center q-mt-md q-gutter-sm">
          <div>
            <q-btn
              flat
              no-caps
              color="primary"
              icon="add"
              label="Agregar fila"
              @click="addMovementRow"
            />
            <q-btn
              flat
              no-caps
              color="grey-8"
              label="Limpiar"
              class="q-ml-sm"
              @click="resetMovementBulk"
            />
          </div>
          <q-btn
            color="primary"
            no-caps
            icon="save"
            label="Guardar movimientos"
            :loading="savingMovementBulk"
            @click="onSubmitConsumableBulk"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card v-show="consumableModule === 'altas'">
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
import {
  createConsumableMovementsBulk,
  listConsumableMovements,
} from 'src/services/consumable-movements-service'
import { listLocations } from 'src/services/locations-service'
import { listPersonnel } from 'src/services/personnel-service'
import { listClients } from 'src/services/clients-service'

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
const rawLocations = ref([])
// const locationsRaw = ref([])
const locationOptions = ref([])
const locationLoading = ref(false)
const allPersonnel = ref([])
const personnelOptions = ref([])
const personnelLoading = ref(false)
const allClients = ref([])
const clientOptions = ref([])
const savingMovementBulk = ref(false)
const movementFieldErrors = ref({})
const rawAlmacen = ref([])
const consumableLocationOptionsById = ref({})
const loadWarningsShown = ref({
  locations: false,
  personnel: false,
})
const consumableModule = ref('altas')

const moduleOptions = [
  { label: 'Altas', value: 'altas' },
  { label: 'Movimientos', value: 'movimientos' },
]

const typeOptions = ['refaccion', 'tinta', 'toner', 'otras']
const defaultStatusOptions = ['nuevo', 'usado', 'renta', 'reparacion']
const unitOptions = ['pieza', 'caja', 'kit', 'litro', 'ml']
const inventoryStatusOptions = ['disponible', 'rentado', 'vendido', 'mantenimiento']
const movementTypeOptions = ['vendido', 'ajuste', 'movimiento_interno']

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

const initialMovementForm = () => ({
  type: 'movimiento_interno',
  personnel_id: null,
  movement_date: '',
  client_id: null,
  notes: '',
})

const movementForm = ref(initialMovementForm())

function createMovementRow() {
  return {
    row_key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    consumable_id: null,
    quantity: 1,
    from_location_id: null,
    location_id: null,
    client_id: null,
    notes: '',
  }
}

const movementRows = ref([createMovementRow()])

const statusOptions = computed(() => {
  const dynamicStatuses = consumables.value
    .map((item) => item?.status)
    .filter((status) => typeof status === 'string' && status.trim() !== '')

  return Array.from(new Set([...defaultStatusOptions, ...dynamicStatuses]))
})

const movementConsumableOptions = computed(() => {
  const restrictedTypes = ['movimiento_interno', 'ajuste']
  return consumables.value
    .filter((item) => {
      if (
        restrictedTypes.includes(movementForm.value.type) &&
        item.inventory_status === 'vendido'
      ) {
        return false
      }
      return true
    })
    .map((item) => ({
      id: item.id,
      label:
        item.name || item.part_number
          ? `${item.name || 'Consumible'} (${item.part_number || item.id})`
          : `Consumible ${item.id}`,
    }))
})

const showMovementClient = computed(() => ['salida', 'vendido'].includes(movementForm.value.type))
const showMovementClientColumn = computed(() =>
  ['salida', 'vendido'].includes(movementForm.value.type),
)

const selectedConsumableClientLocation = computed(() => {
  const clientId = Number(movementForm.value.client_id)
  if (!clientId) return null
  const client = allClients.value.find((c) => Number(c.id) === clientId)
  if (!client?.location_id) return null
  const locationInAlmacen = allLocations.value.find(
    (loc) => Number(loc.id) === Number(client.location_id),
  )
  const label =
    locationInAlmacen?.label || client.location_name || `Ubicacion ${client.location_id}`
  return { id: Number(client.location_id), label }
})
const showFromLocationColumn = computed(() =>
  ['movimiento_interno', 'salida', 'vendido'].includes(movementForm.value.type),
)
const showToLocationColumn = computed(() => movementForm.value.type === 'movimiento_interno')
// Alias para compatibilidad con onChangeMovementConsumable
const showLocationColumn = showFromLocationColumn
const currentModuleLabel = computed(() => {
  const option = moduleOptions.find((item) => item.value === consumableModule.value)
  return option?.label || 'Altas'
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
  {
    name: 'location_summary',
    label: 'Ubicaciones',
    field: 'location_summary',
    align: 'left',
    sortable: false,
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
    location_summary:
      Array.isArray(item.almacen) && item.almacen.length > 0
        ? item.almacen
            .map((entry) => {
              const locationLabel =
                entry.location?.name ||
                (entry.location_id ? `Ub ${entry.location_id}` : 'Sin ubicacion')
              return `${locationLabel}: ${Number(entry.quantity ?? 0)}`
            })
            .join(' | ')
        : item.location?.name || (item.location_id ? `Ub ${item.location_id}` : '-'),
    batch: item.batch ?? '-',
    supplier: item.supplier ?? '-',
  })),
)

function buildLocationsFromProducts() {
  const seen = new Set()
  const locations = []

  // Fuente primaria: rawLocations de /api/locations (todas las ubicaciones del sistema)
  if (rawLocations.value.length > 0) {
    for (const location of rawLocations.value) {
      console.log('Procesando location:', location)

      if (location && (location.id || location.location_id)) {
        const locationId = location.id || location.location_id
        if (!seen.has(locationId)) {
          seen.add(locationId)
          const normalizedLoc = {
            id: locationId,
            name: location.name || `Ubicacion ${locationId}`,
            type: location.type || 'almacen',
          }
          locations.push({
            id: normalizedLoc.id,
            label: `${normalizedLoc.name} (${normalizedLoc.type})`,
            type: normalizedLoc.type,
          })
        }
      }
    }
  } else {
    // Fallback: usar almacen[] embebido en consumibles
    console.log('Fallback: usando ubicaciones de consumibles')
    for (const consumable of consumables.value) {
      const entries = Array.isArray(consumable.almacen) ? consumable.almacen : []
      for (const entry of entries) {
        const loc = entry.location
        if (loc && !seen.has(loc.id)) {
          seen.add(loc.id)
          locations.push({ id: loc.id, label: `${loc.name} (${loc.type || 'almacen'})` })
        }
      }
    }
  }

  allLocations.value = locations
  locationOptions.value = [...locations]
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
  } catch {
    allPersonnel.value = []
    personnelOptions.value = []

    if (!loadWarningsShown.value.personnel) {
      $q.notify({
        type: 'warning',
        message: 'No se pudo cargar personal. Puedes continuar y recargar despues.',
      })
      loadWarningsShown.value.personnel = true
    }
  } finally {
    personnelLoading.value = false
  }
}

async function loadClients() {
  try {
    const data = await listClients()
    const clients = normalizePayload(data)

    allClients.value = clients.map((client) => ({
      id: client.id,
      label: client.name || `Cliente ${client.id}`,
      location_id: client.location_id ?? client.location?.id ?? null,
      location_name: client.location?.name ?? null,
    }))

    clientOptions.value = allClients.value
  } catch {
    clientOptions.value = []
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

function mapMovementValidationErrors(error) {
  if (error?.response?.status !== 422) return {}
  const errors = error.response.data?.errors ?? {}

  return Object.entries(errors).reduce((accumulator, [field, messages]) => {
    accumulator[field] = Array.isArray(messages) ? messages[0] : String(messages)
    return accumulator
  }, {})
}

function getMovementRowError(index, field) {
  return movementFieldErrors.value[`rows.${index}.${field}`] || ''
}

function getConsumableStockLabel(consumableId) {
  if (!consumableId) return 'Sin seleccion'
  const item = consumables.value.find((row) => row.id === Number(consumableId))
  if (!item) return 'No encontrado'
  return `${Number(item.stock_quantity ?? 0)} ${item.unit || 'pzas'}`
}

function getConsumableLocationLabel(consumableId) {
  if (!consumableId) return 'Sin ubicacion'

  const item = consumables.value.find((row) => row.id === Number(consumableId))
  if (!item) return 'No encontrado'

  if (Array.isArray(item.almacen) && item.almacen.length > 0) {
    return item.almacen
      .map((entry) => {
        const locationLabel =
          entry.location?.name || (entry.location_id ? `Ub ${entry.location_id}` : 'Sin ubicacion')
        const qty = Number(entry.quantity ?? 0)
        return `${locationLabel}: ${qty}`
      })
      .join(' | ')
  }

  return item.location?.name || (item.location_id ? `Ub ${item.location_id}` : 'Sin ubicacion')
}

function getRowClientLocationLabel(row) {
  const clientId = Number(row.client_id || movementForm.value.client_id)
  if (!clientId) return 'Sin ubicacion de cliente'
  const client = allClients.value.find((c) => Number(c.id) === clientId)
  if (!client?.location_id) return 'Sin ubicacion de cliente'
  const loc = allLocations.value.find((l) => Number(l.id) === Number(client.location_id))
  return loc?.label || client.location_name || `Ubicacion ${client.location_id}`
}

function getConsumableCurrentLocationId(consumableId) {
  if (!consumableId) return null

  const item = consumables.value.find((row) => row.id === Number(consumableId))
  if (!item) return null

  if (Array.isArray(item.almacen) && item.almacen.length > 0) {
    return Number(item.almacen[0].location_id) || null
  }

  return item.location_id ? Number(item.location_id) : null
}

function getSourceLocationOptionsForConsumableRow(row) {
  if (!row.consumable_id) {
    return []
  }

  return consumableLocationOptionsById.value[Number(row.consumable_id)] || []
}

function getEffectiveLocationOptions() {
  // Usar directamente allLocations.value que ya tiene todas las ubicaciones cargadas desde /api/locations
  return allLocations.value
}

function onChangeMovementConsumable(row) {
  if (!showLocationColumn.value) {
    return
  }

  const sourceOptions = getSourceLocationOptionsForConsumableRow(row)
  const selectedSourceIsValid = sourceOptions.some(
    (option) => Number(option.id) === Number(row.from_location_id),
  )

  if (!selectedSourceIsValid) {
    row.from_location_id = sourceOptions[0]?.id || null
  }

  if (
    row.location_id &&
    row.from_location_id &&
    Number(row.location_id) === Number(row.from_location_id)
  ) {
    row.location_id = null
  }
}

function getDestinationLocationOptionsForConsumableRow(row) {
  const baseOptions = getEffectiveLocationOptions()
  // Filtrar ubicaciones de clientes y la ubicación actual
  const filteredOptions = baseOptions.filter((option) => option.type !== 'cliente')
  const currentLocationId = row.from_location_id
    ? Number(row.from_location_id)
    : getConsumableCurrentLocationId(row.consumable_id)

  if (!currentLocationId) {
    return filteredOptions
  }

  return filteredOptions.filter((option) => Number(option.id) !== currentLocationId)
}

async function loadLocations() {
  try {
    // Obtener TODAS las ubicaciones del sistema usando el endpoint correcto
    const data = await listLocations({ per_page: 1000 })
    console.log('Respuesta cruda del backend (locations):', data)

    rawLocations.value = normalizePayload(data)
    console.log(
      'rawLocations después de normalizar:',
      rawLocations.value.length,
      rawLocations.value,
    )

    // Si normalizePayload no funcionó bien, intentar acceso directo
    if (rawLocations.value.length === 0 && data) {
      console.log('Intentando acceso directo a data:', data)
      if (Array.isArray(data)) {
        rawLocations.value = data
      } else if (data.data && Array.isArray(data.data)) {
        rawLocations.value = data.data
      } else if (data.items && Array.isArray(data.items)) {
        rawLocations.value = data.items
      } else if (data.locations && Array.isArray(data.locations)) {
        rawLocations.value = data.locations
      }
      console.log(
        'rawLocations después de acceso directo:',
        rawLocations.value.length,
        rawLocations.value,
      )
    }
  } catch (error) {
    console.error('Error cargando ubicaciones:', error)
    rawLocations.value = []
  }
}

async function loadConsumableLocationOptions() {
  const map = {}

  function registerLocation(consumableId, locationId, locationName, quantity, unit) {
    const cId = Number(consumableId)
    const lId = Number(locationId)
    if (!cId || !lId) return

    if (!map[cId]) map[cId] = []

    const idx = map[cId].findIndex((o) => Number(o.id) === lId)
    const baseName = locationName || `Ub ${lId}`
    const label =
      quantity !== null && quantity !== undefined
        ? `${baseName}: ${Number(quantity)} ${unit || 'pzas'}`
        : baseName

    if (idx !== -1) {
      if (quantity !== null && quantity !== undefined) {
        map[cId][idx].label = label
        map[cId][idx].quantity = Number(quantity)
      }
      return
    }

    map[cId].push({ id: lId, label, quantity: quantity != null ? Number(quantity) : null })
  }

  // Fuente primaria: tabla almacen con cantidad exacta por ubicacion
  if (rawAlmacen.value.length > 0) {
    rawAlmacen.value.forEach((entry) => {
      const unit = entry.consumable?.unit || entry.unit || null
      registerLocation(
        entry.consumable_id,
        entry.location_id,
        entry.location?.name || null,
        entry.quantity,
        unit,
      )
    })
  } else {
    // Fallback: almacen[] embebido en el consumable
    consumables.value.forEach((item) => {
      if (Array.isArray(item.almacen) && item.almacen.length > 0) {
        item.almacen.forEach((entry) => {
          registerLocation(
            item.id,
            entry.location_id,
            entry.location?.name || null,
            entry.quantity,
            item.unit,
          )
        })
      } else {
        registerLocation(item.id, item.location_id, item.location?.name || null, null, item.unit)
      }
    })
  }

  // Enriquecer con ubicaciones del historial (sin cantidad — solo para no perder opciones históricas)
  try {
    const data = await listConsumableMovements()
    const movements = normalizePayload(data)

    movements.forEach((movement) => {
      const consumableId = movement.consumable_id ?? movement.consumable?.id
      registerLocation(
        consumableId,
        movement.from_location_id,
        movement.from_location?.name || null,
        null,
        null,
      )
      registerLocation(
        consumableId,
        movement.from_location?.id,
        movement.from_location?.name || null,
        null,
        null,
      )
      registerLocation(
        consumableId,
        movement.location_id,
        movement.location?.name || null,
        null,
        null,
      )
      registerLocation(
        consumableId,
        movement.location?.id,
        movement.location?.name || null,
        null,
        null,
      )
    })
  } catch {
    // Si falla historial, se mantiene solo la ubicacion de almacen.
  }

  consumableLocationOptionsById.value = map
}

function addMovementRow() {
  movementRows.value.push(createMovementRow())
}

function removeMovementRow(index) {
  if (movementRows.value.length <= 1) return
  movementRows.value.splice(index, 1)
}

function resetMovementBulk() {
  movementForm.value = initialMovementForm()
  movementRows.value = [createMovementRow()]
  movementFieldErrors.value = {}
}

function validateMovementBulk() {
  const errors = {}

  if (!movementForm.value.type) errors.type = 'Selecciona el tipo.'
  if (!movementForm.value.personnel_id) errors.personnel_id = 'Selecciona responsable.'
  if (!movementForm.value.movement_date) errors.movement_date = 'La fecha es obligatoria.'

  const activeRows = movementRows.value
    .map((row, index) => ({ row, index }))
    .filter(
      ({ row }) =>
        row.consumable_id ||
        row.from_location_id ||
        row.location_id ||
        row.notes ||
        Number(row.quantity) > 1,
    )

  if (!activeRows.length) {
    errors.rows = 'Agrega al menos una fila.'
  }

  activeRows.forEach(({ row, index }) => {
    if (!row.consumable_id) errors[`rows.${index}.consumable_id`] = 'Selecciona consumible.'
    if (!row.quantity || Number(row.quantity) < 1) {
      errors[`rows.${index}.quantity`] = 'Cantidad minima 1.'
    }
    if (showFromLocationColumn.value && !row.from_location_id) {
      errors[`rows.${index}.from_location_id`] = 'Selecciona la ubicacion de origen.'
    }

    if (showToLocationColumn.value && !row.location_id) {
      errors[`rows.${index}.location_id`] = 'Ubicacion destino obligatoria en movimiento interno.'
    } else if (showToLocationColumn.value) {
      const currentLocationId = row.from_location_id
        ? Number(row.from_location_id)
        : getConsumableCurrentLocationId(row.consumable_id)

      if (currentLocationId && Number(row.location_id) === currentLocationId) {
        errors[`rows.${index}.location_id`] = 'El destino no puede ser la misma ubicacion actual.'
      }
    }
  })

  movementFieldErrors.value = errors
  return { isValid: Object.keys(errors).length === 0, activeRows }
}

async function onSubmitConsumableBulk() {
  savingMovementBulk.value = true
  movementFieldErrors.value = {}

  const { isValid, activeRows } = validateMovementBulk()
  if (!isValid) {
    savingMovementBulk.value = false
    return
  }

  const payload = {
    type: movementForm.value.type,
    personnel_id: Number(movementForm.value.personnel_id),
    movement_date: movementForm.value.movement_date,
    client_id: movementForm.value.client_id ? Number(movementForm.value.client_id) : null,
    notes: movementForm.value.notes?.trim() || null,
    rows: activeRows.map(({ row }) => {
      const rowPayload = {
        consumable_id: Number(row.consumable_id),
        quantity: Number(row.quantity || 0),
        notes: row.notes?.trim() || null,
      }

      if (movementForm.value.type === 'movimiento_interno') {
        // Origen y destino explícitos
        rowPayload.from_location_id = row.from_location_id ? Number(row.from_location_id) : null
        rowPayload.location_id = row.location_id ? Number(row.location_id) : null
      } else if (['salida', 'vendido'].includes(movementForm.value.type)) {
        // El origen seleccionado es la ubicación de la que se resta stock
        rowPayload.location_id = row.from_location_id ? Number(row.from_location_id) : null
        // Cliente de la fila tiene prioridad sobre el cliente general del formulario
        const effectiveClientId = row.client_id || movementForm.value.client_id
        if (effectiveClientId) rowPayload.client_id = Number(effectiveClientId)
      } else {
        rowPayload.location_id = row.location_id ? Number(row.location_id) : null
      }

      return rowPayload
    }),
  }

  try {
    await createConsumableMovementsBulk(payload)
    $q.notify({
      type: 'positive',
      message: `${payload.rows.length} movimiento(s) de consumible registrado(s).`,
    })
    resetMovementBulk()
    await Promise.all([loadConsumables({ silent: true }), loadConsumableLocationOptions()])
  } catch (error) {
    movementFieldErrors.value = mapMovementValidationErrors(error)

    if (!Object.keys(movementFieldErrors.value).length) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'No fue posible guardar el lote.',
      })
    }
  } finally {
    savingMovementBulk.value = false
  }
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
  await Promise.allSettled([loadConsumables(), loadLocations(), loadPersonnel(), loadClients()])
  buildLocationsFromProducts()
  await loadConsumableLocationOptions()
})
</script>

<style scoped>
.bulk-grid-wrapper {
  overflow-x: auto;
  border: 1px solid #d6dce5;
  border-radius: 8px;
  background: #fff;
}

.bulk-grid {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.bulk-grid th {
  background: #eef3fb;
  color: #324a6d;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 11px;
  border-bottom: 1px solid #d6dce5;
  border-right: 1px solid #e7ebf0;
  padding: 10px 8px;
  white-space: nowrap;
}

.bulk-grid td {
  border-bottom: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  padding: 8px;
  vertical-align: top;
}

.index-cell {
  width: 48px;
  text-align: center;
  color: #4e617e;
  font-weight: 600;
}
</style>
