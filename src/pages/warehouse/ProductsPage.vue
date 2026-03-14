<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-sm">Almacen · Productos</div>

    <q-card class="q-mb-md">
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-12 col-md">
          <div class="text-subtitle1">Submodulo: {{ currentModuleLabel }}</div>
          <div class="text-caption text-grey-7">
            Cambia entre captura de productos, movimientos y retornos.
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <q-btn-toggle
            v-model="productModule"
            no-caps
            unelevated
            color="primary"
            toggle-color="primary"
            :options="moduleOptions"
            @update:model-value="onChangeModule"
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

    <q-banner v-if="errorMessage" dense rounded class="bg-red-1 text-red-8 q-mb-md">
      {{ errorMessage }}
    </q-banner>

    <q-card v-show="productModule === 'nuevo'" class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Nuevo producto</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form ref="createFormRef" class="row q-col-gutter-md" @submit="onCreateProduct">
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
          <!-- <div class="col-12 col-md-4">
            <q-select
              v-model="form.inventory_status"
              label="Estado inventario"
              outlined
              dense
              :options="inventoryStatusOptions"
              :error="Boolean(fieldErrors.inventory_status)"
              :error-message="fieldErrors.inventory_status"
            />
          </div> -->
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

    <q-card v-show="productModule === 'movimientos'" class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Movimientos masivos de equipos</div>
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
              v-model="movementForm.date_out"
              outlined
              dense
              type="date"
              label="Fecha salida"
              :error="Boolean(movementFieldErrors.date_out)"
              :error-message="movementFieldErrors.date_out"
            />
          </div>
          <div class="col-12 col-md-3" v-if="requiresReturnDate">
            <q-input
              v-model="movementForm.date_return"
              outlined
              dense
              type="date"
              label="Fecha retorno"
              :error="Boolean(movementFieldErrors.date_return)"
              :error-message="movementFieldErrors.date_return"
            />
          </div>
          <div class="col-12 col-md-4" v-if="showMovementClient">
            <q-select
              v-model="movementForm.client_id"
              outlined
              dense
              clearable
              label="Cliente por defecto"
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
              :model-value="selectedClientLocation?.label || 'Sin ubicacion de cliente'"
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

        <q-banner
          v-if="movementForm.type === 'renta'"
          dense
          rounded
          class="bg-blue-1 text-blue-9 q-mb-md"
        >
          En renta, la ubicacion del equipo se tomara automaticamente desde el cliente seleccionado.
        </q-banner>

        <div class="bulk-grid-wrapper">
          <table class="bulk-grid">
            <thead>
              <tr>
                <th>#</th>
                <th>Equipo</th>
                <th v-if="showMovementClient">Cliente fila</th>
                <th>Estado actual</th>
                <th v-if="showLocationColumn">Ubicacion destino</th>
                <th>Contador B/N</th>
                <th>Contador color</th>
                <th>Fecha conteo</th>
                <th>Nota fila</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in movementRows" :key="row.row_key">
                <td class="index-cell">{{ index + 1 }}</td>
                <td>
                  <q-select
                    v-model="row.product_id"
                    outlined
                    dense
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="movementProductOptions"
                    :error="Boolean(getMovementRowError(index, 'product_id'))"
                    :error-message="getMovementRowError(index, 'product_id')"
                  />
                </td>
                <td v-if="showMovementClient">
                  <q-select
                    v-model="row.client_id"
                    outlined
                    dense
                    clearable
                    label="Cliente"
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="clientOptions"
                    :error="Boolean(getMovementRowError(index, 'client_id'))"
                    :error-message="getMovementRowError(index, 'client_id')"
                  />
                </td>
                <td>
                  <q-input
                    :model-value="getProductStatusLabel(row.product_id)"
                    outlined
                    dense
                    readonly
                  />
                  <div
                    v-if="movementForm.type === 'renta'"
                    class="text-caption text-primary q-mt-xs"
                  >
                    Destino final:
                    {{ getDestinationLabelForRow(row) }}
                  </div>
                </td>
                <td v-if="showLocationColumn">
                  <q-select
                    v-model="row.location_id"
                    outlined
                    dense
                    clearable
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="getDestinationLocationOptionsForProductRow(row)"
                    :error="Boolean(getMovementRowError(index, 'location_id'))"
                    :error-message="getMovementRowError(index, 'location_id')"
                  />
                </td>
                <td>
                  <q-input
                    v-model.number="row.current_counter_bw"
                    type="number"
                    min="0"
                    outlined
                    dense
                    :error="Boolean(getMovementRowError(index, 'current_counter_bw'))"
                    :error-message="getMovementRowError(index, 'current_counter_bw')"
                  />
                </td>
                <td>
                  <q-input
                    v-model.number="row.current_counter_color"
                    type="number"
                    min="0"
                    outlined
                    dense
                    :error="Boolean(getMovementRowError(index, 'current_counter_color'))"
                    :error-message="getMovementRowError(index, 'current_counter_color')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="row.counter_read_at"
                    type="date"
                    outlined
                    dense
                    :error="Boolean(getMovementRowError(index, 'counter_read_at'))"
                    :error-message="getMovementRowError(index, 'counter_read_at')"
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
            @click="onSubmitEquipmentBulk"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card v-show="productModule === 'retornos'" class="q-mb-md">
      <q-card-section class="row items-center justify-between q-col-gutter-md">
        <div class="col">
          <div class="text-subtitle1">Retornos de renta</div>
          <div class="text-caption text-grey-7">
            Selecciona equipos rentados, define fecha de retorno y ubicacion final.
          </div>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            no-caps
            color="primary"
            icon="refresh"
            label="Recargar retornos"
            :loading="loadingRentals"
            @click="loadOpenRentals"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="returnForm.date_return"
              outlined
              dense
              type="date"
              label="Fecha retorno"
              :error="Boolean(returnFieldErrors.date_return)"
              :error-message="returnFieldErrors.date_return"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="returnForm.location_id"
              outlined
              dense
              clearable
              label="Ubicacion global de retorno"
              option-label="label"
              option-value="id"
              emit-value
              map-options
              :options="returnLocationOptions"
              :error="Boolean(returnFieldErrors.location_id)"
              :error-message="returnFieldErrors.location_id"
            />
          </div>
          <div class="col-12 col-md-4 flex items-center">
            <q-checkbox v-model="allReturnsSelected" label="Seleccionar todos" />
          </div>
        </div>

        <q-banner v-if="returnFieldErrors.rows" dense rounded class="bg-red-1 text-red-8 q-mb-sm">
          {{ returnFieldErrors.rows }}
        </q-banner>

        <div class="bulk-grid-wrapper">
          <table class="bulk-grid">
            <thead>
              <tr>
                <th style="width: 56px">Sel</th>
                <th>Equipo</th>
                <th>Cliente</th>
                <th>Fecha salida</th>
                <th>Ubicacion retorno</th>
                <th>Contador B/N</th>
                <th>Contador color</th>
                <th>Fecha conteo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rentalReturnRows" :key="row.movement_id">
                <td class="text-center">
                  <q-checkbox v-model="row.selected" />
                </td>
                <td>{{ row.product_label }}</td>
                <td>{{ row.client_label }}</td>
                <td>{{ row.date_out || '-' }}</td>
                <td>
                  <q-select
                    v-model="row.location_id"
                    outlined
                    dense
                    clearable
                    option-label="label"
                    option-value="id"
                    emit-value
                    map-options
                    :options="returnLocationOptions"
                    :error="Boolean(returnFieldErrors[`rows.${index}.location_id`])"
                    :error-message="returnFieldErrors[`rows.${index}.location_id`]"
                  />
                </td>
                <td>
                  <q-input
                    v-model.number="row.current_counter_bw"
                    type="number"
                    min="0"
                    outlined
                    dense
                  />
                </td>
                <td>
                  <q-input
                    v-model.number="row.current_counter_color"
                    type="number"
                    min="0"
                    outlined
                    dense
                  />
                </td>
                <td>
                  <q-input v-model="row.counter_read_at" type="date" outlined dense />
                </td>
              </tr>
              <tr v-if="!loadingRentals && rentalReturnRows.length === 0">
                <td colspan="8" class="text-center text-grey-7 q-pa-md">
                  No hay equipos rentados pendientes de retorno.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn
            color="primary"
            no-caps
            icon="assignment_return"
            label="Registrar retornos seleccionados"
            :loading="savingReturns"
            :disable="loadingRentals || rentalReturnRows.length === 0"
            @click="onSubmitRentalReturns"
          />
        </div>
      </q-card-section>
    </q-card>

    <div v-show="productModule === 'nuevo'" class="row items-center q-col-gutter-md q-mb-md">
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

    <q-card v-show="productModule === 'nuevo'">
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
            <!-- <div class="col-12 col-md-4">
              <q-select
                v-model="editForm.inventory_status"
                label="Estado inventario"
                outlined
                dense
                :options="inventoryStatusOptions"
                :error="Boolean(editFieldErrors.inventory_status)"
                :error-message="editFieldErrors.inventory_status"
              />
            </div> -->
            <!-- <div class="col-12 col-md-4">
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
            </div> -->
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
            <!-- <div class="col-12 col-md-4">
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
            </div> -->
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
import {
  createEquipmentMovementsBulk,
  createRetornoMovement,
  listEquipmentMovements,
  // updateEquipmentMovement,
} from 'src/services/equipment-movements-service'
import { listPersonnel } from 'src/services/personnel-service'
import { listClients } from 'src/services/clients-service'
import { listAlmacen } from 'src/services/almacen-service'

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
const locationsRaw = ref([])
const locationOptions = ref([])
const locationLoading = ref(false)
const allPersonnel = ref([])
const personnelOptions = ref([])
const personnelLoading = ref(false)
const allClients = ref([])
const clientOptions = ref([])
const savingMovementBulk = ref(false)
const movementFieldErrors = ref({})
const loadWarningsShown = ref({
  locations: false,
  personnel: false,
})
const loadingRentals = ref(false)
const savingReturns = ref(false)
const returnFieldErrors = ref({})
const returnForm = ref({
  date_return: '',
  location_id: null,
})
const rentalReturnRows = ref([])
const productModule = ref('nuevo')

const moduleOptions = [
  { label: 'Nuevo', value: 'nuevo' },
  { label: 'Movimientos', value: 'movimientos' },
  { label: 'Retornos', value: 'retornos' },
]

const typeOptions = [
  'copiadora',
  'impresora',
  'multifuncional_laser',
  'multifuncional_tinta',
  'plotter',
]
const statusOptions = ['nuevo', 'usado', 'renta', 'reparacion']
// const inventoryStatusOptions = ['disponible', 'rentado', 'vendido', 'mantenimiento']
const classificationOptions = ['renta', 'venta', 'refaccion', 'demo', 'taller']
const commercialConditionOptions = ['a1', 'a2', 'b', 'c']
const movementTypeOptions = ['renta', 'venta', 'mantenimiento', 'movimiento_interno']

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
  personnel_id: '',
  entry_date: '',
  notes: '',
})

const form = ref(initialForm())
const editForm = ref(initialForm())
const createFormRef = ref(null)

const initialMovementForm = () => ({
  type: 'movimiento_interno',
  personnel_id: null,
  client_id: null,
  date_out: '',
  date_return: '',
  notes: '',
})

const movementForm = ref(initialMovementForm())

function createMovementRow() {
  return {
    row_key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    product_id: null,
    client_id: null,
    location_id: null,
    current_counter_bw: null,
    current_counter_color: null,
    counter_read_at: '',
    notes: '',
  }
}

const movementRows = ref([createMovementRow()])

const movementProductOptions = computed(() => {
  const isInternalOrMaintenance = [
    'movimiento_interno',
    'mantenimiento',
    'renta',
    'venta',
  ].includes(movementForm.value.type)
  return rawProducts.value
    .filter((product) => {
      if (isInternalOrMaintenance && product.inventory_status === 'vendido') return false
      return true
    })
    .map((product) => ({
      id: product.id,
      label:
        `${product.brand || ''} ${product.model || ''} (${product.serial_number || product.id})`.trim(),
    }))
})

const showMovementClient = computed(() => ['renta', 'venta'].includes(movementForm.value.type))
const requiresClient = computed(() => ['renta', 'venta'].includes(movementForm.value.type))
const requiresReturnDate = computed(() => movementForm.value.type === 'renta')
const showLocationColumn = computed(() =>
  ['movimiento_interno', 'mantenimiento'].includes(movementForm.value.type),
)
const currentModuleLabel = computed(() => {
  const option = moduleOptions.find((item) => item.value === productModule.value)
  return option?.label || 'Nuevo'
})
const allReturnsSelected = computed({
  get: () =>
    rentalReturnRows.value.length > 0 && rentalReturnRows.value.every((row) => row.selected),
  set: (value) => toggleSelectAllReturns(value),
})

const selectedClientLocation = computed(() => {
  const clientId = Number(movementForm.value.client_id)

  if (!clientId) {
    return null
  }

  const locationByClient = locationsRaw.value.find(
    (location) => location.type === 'cliente' && Number(location.client_id) === clientId,
  )

  if (locationByClient) {
    return {
      id: locationByClient.id,
      label: locationByClient.name || `Ubicacion ${locationByClient.id}`,
    }
  }

  const selectedClient = allClients.value.find((client) => Number(client.id) === clientId)
  if (!selectedClient?.location_id) {
    return null
  }

  const locationOption = allLocations.value.find(
    (option) => Number(option.id) === Number(selectedClient.location_id),
  )

  return {
    id: Number(selectedClient.location_id),
    label: locationOption?.label || `Ubicacion ${selectedClient.location_id}`,
  }
})

function getEffectiveRowClientId(row) {
  return row.client_id || movementForm.value.client_id || null
}

function getClientLocationByClientId(clientId) {
  const normalizedClientId = Number(clientId)

  if (!normalizedClientId) {
    return null
  }

  const locationByClient = locationsRaw.value.find(
    (location) => location.type === 'cliente' && Number(location.client_id) === normalizedClientId,
  )

  if (locationByClient) {
    return {
      id: Number(locationByClient.id),
      label: locationByClient.name || `Ubicacion ${locationByClient.id}`,
    }
  }

  const selectedClient = allClients.value.find((client) => Number(client.id) === normalizedClientId)
  if (!selectedClient?.location_id) {
    return null
  }

  const locationOption = allLocations.value.find(
    (option) => Number(option.id) === Number(selectedClient.location_id),
  )

  return {
    id: Number(selectedClient.location_id),
    label: locationOption?.label || `Ubicacion ${selectedClient.location_id}`,
  }
}

function getDestinationLabelForRow(row) {
  const clientId = getEffectiveRowClientId(row)
  const clientLocation = getClientLocationByClientId(clientId)

  return clientLocation?.label || 'Selecciona cliente con ubicacion'
}

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

function normalizeDateForInput(value) {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return value.slice(0, 10)
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
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

const rawAlmacen = ref([])

async function loadAlmacen() {
  try {
    // Sin filtro kind para obtener TODAS las ubicaciones del sistema
    const data = await listAlmacen({ per_page: 500 })
    rawAlmacen.value = normalizePayload(data)
  } catch {
    rawAlmacen.value = []
  }
}

function buildLocationsFromProducts() {
  const seen = new Set()
  const rawLocs = []

  // Fuente primaria: rawAlmacen de /api/almacen (ubicaciones reales)
  if (rawAlmacen.value.length > 0) {
    for (const entry of rawAlmacen.value) {
      const loc = entry.location
      if (loc && !seen.has(loc.id)) {
        seen.add(loc.id)
        rawLocs.push(loc)
      }
    }
  } else {
    // Fallback: almacen embebido en cada producto
    for (const product of rawProducts.value) {
      const loc = product.almacen?.location
      if (loc && !seen.has(loc.id)) {
        seen.add(loc.id)
        rawLocs.push(loc)
      }
    }
  }

  locationsRaw.value = rawLocs
  allLocations.value = rawLocs.map((loc) => ({
    id: loc.id,
    label: `${loc.name} (${loc.type || 'almacen'})`,
    type: loc.type || 'almacen',
  }))
  locationOptions.value = [...allLocations.value]
}

const returnLocationOptions = computed(() =>
  allLocations.value.filter((loc) => loc.type !== 'cliente'),
)

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
    }))

    clientOptions.value = allClients.value
  } catch {
    clientOptions.value = []
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

function mapMovementValidationErrors(error) {
  if (error?.response?.status !== 422) {
    return {}
  }

  const errors = error.response.data?.errors ?? {}

  return Object.entries(errors).reduce((accumulator, [field, messages]) => {
    accumulator[field] = Array.isArray(messages) ? messages[0] : String(messages)
    return accumulator
  }, {})
}

function getMovementRowError(index, field) {
  return movementFieldErrors.value[`rows.${index}.${field}`] || ''
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

function getProductStatusLabel(productId) {
  if (!productId) return 'Sin seleccion'

  const product = rawProducts.value.find((item) => item.id === Number(productId))
  if (!product) return 'No encontrado'

  const status = product.inventory_status || 'sin estado'
  const location =
    product.almacen?.location?.name ||
    (product.almacen?.location_id ? `Ub ${product.almacen.location_id}` : 'sin ubicacion')

  return `${status} · ${location}`
}

function getProductCurrentLocationId(productId) {
  if (!productId) return null

  const product = rawProducts.value.find((item) => item.id === Number(productId))
  if (!product) return null

  if (product.almacen?.location_id) {
    return Number(product.almacen.location_id)
  }

  return product.location_id ? Number(product.location_id) : null
}

function getEffectiveLocationOptions() {
  const map = new Map()

  // Ubicaciones de rawAlmacen (todas las del sistema)
  allLocations.value.forEach((loc) => {
    map.set(Number(loc.id), loc)
  })

  // Ubicaciones adicionales del locationsRaw (por si hubiera más)
  locationsRaw.value.forEach((loc) => {
    const id = Number(loc.id)
    if (id && !map.has(id)) {
      map.set(id, { id, label: `${loc.name} (${loc.type || 'almacen'})` })
    }
  })

  return Array.from(map.values())
}

function getDestinationLocationOptionsForProductRow(row) {
  const baseOptions = getEffectiveLocationOptions()
  const currentLocationId = getProductCurrentLocationId(row.product_id)

  if (!currentLocationId) {
    return baseOptions
  }

  return baseOptions.filter((option) => Number(option.id) !== currentLocationId)
}

async function loadOpenRentals() {
  loadingRentals.value = true

  try {
    const data = await listEquipmentMovements()
    const movements = normalizePayload(data)

    rentalReturnRows.value = movements
      .filter((movement) => movement.type === 'renta' && !movement.date_return)
      .map((movement) => ({
        movement_id: movement.id,
        product_label:
          movement.product?.serial_number || movement.product?.model
            ? `${movement.product?.brand || ''} ${movement.product?.model || ''} (${movement.product?.serial_number || movement.product_id})`.trim()
            : `Equipo ${movement.product_id || movement.id}`,
        client_label: movement.client?.name || movement.client_id || '-',
        date_out: movement.date_out ? String(movement.date_out).slice(0, 10) : '',
        location_id: null,
        current_counter_bw: null,
        current_counter_color: null,
        counter_read_at: '',
        selected: false,
      }))
  } finally {
    loadingRentals.value = false
  }
}

function toggleSelectAllReturns(value) {
  rentalReturnRows.value = rentalReturnRows.value.map((row) => ({
    ...row,
    selected: value,
  }))
}

async function onChangeModule(value) {
  productModule.value = value

  if (value === 'retornos' && rentalReturnRows.value.length === 0 && !loadingRentals.value) {
    await loadOpenRentals()
  }
}

async function onSubmitRentalReturns() {
  returnFieldErrors.value = {}

  if (!returnForm.value.date_return) {
    returnFieldErrors.value.date_return = 'La fecha de retorno es obligatoria.'
    return
  }

  const selectedRows = rentalReturnRows.value.filter((row) => row.selected)
  if (!selectedRows.length) {
    returnFieldErrors.value.rows = 'Selecciona al menos un equipo para retornar.'
    return
  }

  const rowsWithoutLocation = selectedRows.filter(
    (row) => !(row.location_id || returnForm.value.location_id),
  )

  if (rowsWithoutLocation.length) {
    returnFieldErrors.value.location_id =
      'Selecciona ubicacion global o ubicacion por fila para todos los retornos.'
    return
  }

  savingReturns.value = true

  try {
    let successCount = 0

    for (const row of selectedRows) {
      const returnPayload = {
        date_return: returnForm.value.date_return,
        location_id: Number(row.location_id || returnForm.value.location_id),
      }
      if (row.current_counter_bw !== null && row.current_counter_bw !== '') {
        returnPayload.current_counter_bw = Number(row.current_counter_bw)
      }
      if (row.current_counter_color !== null && row.current_counter_color !== '') {
        returnPayload.current_counter_color = Number(row.current_counter_color)
      }
      if (row.counter_read_at) {
        returnPayload.counter_read_at = row.counter_read_at
      }
      await createRetornoMovement(row.movement_id, returnPayload)

      successCount += 1
    }

    $q.notify({ type: 'positive', message: `${successCount} retorno(s) registrado(s).` })
    returnForm.value = { date_return: '', location_id: null }
    await Promise.all([loadOpenRentals(), loadProducts({ silent: true })])
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'No fue posible registrar los retornos.',
    })
  } finally {
    savingReturns.value = false
  }
}

function validateMovementBulk() {
  const errors = {}

  if (!movementForm.value.type) errors.type = 'Selecciona el tipo.'
  if (!movementForm.value.personnel_id) errors.personnel_id = 'Selecciona responsable.'
  if (!movementForm.value.date_out) errors.date_out = 'La fecha salida es obligatoria.'

  const activeRows = movementRows.value
    .map((row, index) => ({ row, index }))
    .filter(
      ({ row }) =>
        row.product_id ||
        row.location_id ||
        row.notes ||
        row.current_counter_bw !== null ||
        row.current_counter_color !== null ||
        row.counter_read_at,
    )

  if (!activeRows.length) {
    errors.rows = 'Agrega al menos una fila.'
  }

  activeRows.forEach(({ row, index }) => {
    if (!row.product_id) {
      errors[`rows.${index}.product_id`] = 'Selecciona equipo.'
    }

    const effectiveClientId = getEffectiveRowClientId(row)
    if (requiresClient.value && !effectiveClientId) {
      errors[`rows.${index}.client_id`] = 'Cliente obligatorio para renta y venta.'
    }

    if (movementForm.value.type === 'renta' && effectiveClientId) {
      const clientLocation = getClientLocationByClientId(effectiveClientId)

      if (!clientLocation) {
        errors[`rows.${index}.client_id`] = 'El cliente de la fila no tiene ubicacion asignada.'
      }
    }

    if (showLocationColumn.value && !row.location_id) {
      errors[`rows.${index}.location_id`] = 'Ubicacion destino obligatoria para este tipo.'
    } else if (showLocationColumn.value) {
      const currentLocationId = getProductCurrentLocationId(row.product_id)

      if (currentLocationId && Number(row.location_id) === currentLocationId) {
        errors[`rows.${index}.location_id`] = 'El destino no puede ser la misma ubicacion actual.'
      }
    }

    if (row.current_counter_bw !== null && Number(row.current_counter_bw) < 0) {
      errors[`rows.${index}.current_counter_bw`] = 'Contador B/N debe ser mayor o igual a 0.'
    }

    if (row.current_counter_color !== null && Number(row.current_counter_color) < 0) {
      errors[`rows.${index}.current_counter_color`] = 'Contador color debe ser mayor o igual a 0.'
    }

    const hasAnyCounter = row.current_counter_bw !== null || row.current_counter_color !== null
    if (hasAnyCounter && !row.counter_read_at) {
      errors[`rows.${index}.counter_read_at`] =
        'La fecha de conteo es obligatoria cuando capturas contadores.'
    }
  })

  movementFieldErrors.value = errors
  return { isValid: Object.keys(errors).length === 0, activeRows }
}

async function onSubmitEquipmentBulk() {
  savingMovementBulk.value = true
  movementFieldErrors.value = {}

  const { isValid, activeRows } = validateMovementBulk()
  if (!isValid) {
    savingMovementBulk.value = false
    return
  }

  try {
    const groupedByClient = new Map()

    activeRows.forEach(({ row }) => {
      const effectiveClientId = getEffectiveRowClientId(row)
      const groupKey = requiresClient.value ? Number(effectiveClientId) : 0
      const locationFromClient = ['renta', 'venta'].includes(movementForm.value.type)
        ? getClientLocationByClientId(effectiveClientId)
        : null

      if (!groupedByClient.has(groupKey)) {
        groupedByClient.set(groupKey, [])
      }

      groupedByClient.get(groupKey).push({
        product_id: Number(row.product_id),
        location_id: row.location_id
          ? Number(row.location_id)
          : locationFromClient
            ? Number(locationFromClient.id)
            : null,
        current_counter_bw:
          row.current_counter_bw === '' || row.current_counter_bw === null
            ? null
            : Number(row.current_counter_bw),
        current_counter_color:
          row.current_counter_color === '' || row.current_counter_color === null
            ? null
            : Number(row.current_counter_color),
        counter_read_at: row.counter_read_at || null,
        notes: row.notes?.trim() || null,
      })
    })

    let savedCount = 0

    for (const [clientKey, groupedRows] of groupedByClient.entries()) {
      const payload = {
        type: movementForm.value.type,
        personnel_id: Number(movementForm.value.personnel_id),
        client_id: requiresClient.value ? Number(clientKey) : null,
        date_out: movementForm.value.date_out || null,
        date_return: movementForm.value.date_return || null,
        notes: movementForm.value.notes?.trim() || null,
        rows: groupedRows,
      }

      await createEquipmentMovementsBulk(payload)
      savedCount += groupedRows.length
    }

    $q.notify({
      type: 'positive',
      message: `${savedCount} movimiento(s) de equipo registrado(s).`,
    })
    resetMovementBulk()
    await loadProducts({ silent: true })
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
  Object.assign(form.value, initialForm())
  fieldErrors.value = {}
  createFormRef.value?.resetValidation()
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
    personnel_id: values.personnel_id ? Number(values.personnel_id) : null,
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
    status: product.status ?? 'nuevo',
    inventory_status: product.inventory_status ?? 'disponible',
    classification: product.classification ?? 'renta',
    commercial_condition: product.commercial_condition ?? 'a1',
    acquisition_cost: product.acquisition_cost ?? null,
    supplier: product.supplier ?? '',
    acquisition_date: normalizeDateForInput(product.acquisition_date),
    book_value: product.book_value ?? null,
    depreciation_amount: product.depreciation_amount ?? null,
    location_id: product.almacen?.location_id ?? product.location_id ?? '',
    personnel_id: product.personnel_id ?? product.personal_id ?? product.personnel?.id ?? '',
    entry_date: normalizeDateForInput(product.entry_date),
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
  errorMessage.value = ''
  backendUnavailable.value = false

  try {
    await deleteProduct(id)
    $q.notify({ type: 'positive', message: 'Producto eliminado.', position: 'top', timeout: 2000 })
    await loadProducts()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    const message =
      error.response?.data?.message ||
      (backendUnavailable.value
        ? 'No hay conexión con el backend para eliminar el producto.'
        : 'No fue posible eliminar el producto.')

    $q.notify({ type: 'negative', message, position: 'top', timeout: 2500 })

    if (!backendUnavailable.value) {
      errorMessage.value = message
    }
  }
}

onMounted(async () => {
  await Promise.allSettled([
    loadProducts(),
    loadAlmacen(),
    loadPersonnel(),
    loadClients(),
    loadOpenRentals(),
  ])
  buildLocationsFromProducts()
})
</script>

<style scoped>
.bulk-grid-wrapper {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.bulk-grid {
  width: 100%;
  min-width: 1450px;
  border-collapse: collapse;
}

.bulk-grid th {
  background: #f8fafc;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-size: 10.5px;
  font-weight: 700;
  border-bottom: 2px solid #e2e8f0;
  border-right: 1px solid #e8edf3;
  padding: 11px 10px;
  white-space: nowrap;
}

.bulk-grid th:last-child {
  border-right: none;
}

.bulk-grid td {
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  padding: 8px 10px;
  vertical-align: top;
}

.bulk-grid td:last-child {
  border-right: none;
}

.bulk-grid tbody tr:last-child td {
  border-bottom: none;
}

.bulk-grid tbody tr:hover td {
  background: #f8fafc;
}

.index-cell {
  width: 48px;
  text-align: center;
  color: #94a3b8;
  font-weight: 700;
  font-size: 13px;
}
</style>
