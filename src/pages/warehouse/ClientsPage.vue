<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col">
        <div class="text-h5">Almacén · Clientes</div>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Recargar"
          :loading="loading"
          @click="loadClients"
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
        <div class="text-subtitle1">Nuevo cliente</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onCreateClient">
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
              v-model="form.phone"
              label="Teléfono"
              outlined
              dense
              :error="Boolean(fieldErrors.phone)"
              :error-message="fieldErrors.phone"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.email"
              type="email"
              label="Email"
              outlined
              dense
              :error="Boolean(fieldErrors.email)"
              :error-message="fieldErrors.email"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.rfc"
              label="RFC"
              outlined
              dense
              :error="Boolean(fieldErrors.rfc)"
              :error-message="fieldErrors.rfc"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.company"
              label="Empresa"
              outlined
              dense
              :error="Boolean(fieldErrors.company)"
              :error-message="fieldErrors.company"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.contact_name"
              label="Nombre de contacto"
              outlined
              dense
              :error="Boolean(fieldErrors.contact_name)"
              :error-message="fieldErrors.contact_name"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.department"
              label="Departamento"
              outlined
              dense
              :error="Boolean(fieldErrors.department)"
              :error-message="fieldErrors.department"
            />
          </div>
          <div class="col-12">
            <q-input
              v-model="form.address"
              label="Dirección"
              outlined
              dense
              :error="Boolean(fieldErrors.address)"
              :error-message="fieldErrors.address"
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
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="No hay clientes registrados"
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              label="Editar"
              @click="onEditClient(props.row.id)"
            />
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              label="Eliminar"
              @click="onDeleteClient(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="width: 100%; max-width: 900px">
        <q-card-section>
          <div class="text-subtitle1">Editar cliente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form class="row q-col-gutter-md" @submit="onUpdateClient">
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.name"
                label="Nombre"
                outlined
                dense
                :error="Boolean(editFieldErrors.name)"
                :error-message="editFieldErrors.name"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.phone"
                label="Teléfono"
                outlined
                dense
                :error="Boolean(editFieldErrors.phone)"
                :error-message="editFieldErrors.phone"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.email"
                type="email"
                label="Email"
                outlined
                dense
                :error="Boolean(editFieldErrors.email)"
                :error-message="editFieldErrors.email"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.rfc"
                label="RFC"
                outlined
                dense
                :error="Boolean(editFieldErrors.rfc)"
                :error-message="editFieldErrors.rfc"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.company"
                label="Empresa"
                outlined
                dense
                :error="Boolean(editFieldErrors.company)"
                :error-message="editFieldErrors.company"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.contact_name"
                label="Nombre de contacto"
                outlined
                dense
                :error="Boolean(editFieldErrors.contact_name)"
                :error-message="editFieldErrors.contact_name"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForm.department"
                label="Departamento"
                outlined
                dense
                :error="Boolean(editFieldErrors.department)"
                :error-message="editFieldErrors.department"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="editForm.address"
                label="Dirección"
                outlined
                dense
                :error="Boolean(editFieldErrors.address)"
                :error-message="editFieldErrors.address"
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
  createClient,
  deleteClient,
  listClients,
  showClient,
  updateClient,
} from 'src/services/clients-service'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const backendUnavailable = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})
const editFieldErrors = ref({})
const editDialog = ref(false)
const editingClientId = ref(null)
const clients = ref([])

function initialForm() {
  return {
    name: '',
    phone: '',
    email: '',
    rfc: '',
    company: '',
    contact_name: '',
    department: '',
    address: '',
  }
}

const form = ref(initialForm())
const editForm = ref(initialForm())

function setEditFormFromClient(client) {
  editForm.value = {
    name: client.name ?? '',
    phone: client.phone ?? '',
    email: client.email ?? '',
    rfc: client.rfc ?? '',
    company: client.company ?? '',
    contact_name: client.contact_name ?? '',
    department: client.department ?? '',
    address: client.address ?? '',
  }
}

function sanitizeClientPayload(values) {
  return {
    name: values.name?.trim() || null,
    phone: values.phone?.trim() || null,
    email: values.email?.trim() || null,
    rfc: values.rfc?.trim() || null,
    company: values.company?.trim() || null,
    contact_name: values.contact_name?.trim() || null,
    department: values.department?.trim() || null,
    address: values.address?.trim() || null,
  }
}

const formDefaults = {
  name: '',
  phone: '',
  email: '',
  rfc: '',
  company: '',
  contact_name: '',
  department: '',
  address: '',
}

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'rfc', label: 'RFC', field: 'rfc', align: 'left', sortable: true },
  { name: 'company', label: 'Empresa', field: 'company', align: 'left', sortable: true },
  {
    name: 'contact_name',
    label: 'Contacto',
    field: 'contact_name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'department',
    label: 'Departamento',
    field: 'department',
    align: 'left',
    sortable: true,
  },
  { name: 'phone', label: 'Teléfono', field: 'phone', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  {
    name: 'equipment_movements_count',
    label: 'Movimientos',
    field: 'equipment_movements_count',
    align: 'right',
    sortable: true,
  },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const rows = computed(() =>
  clients.value.map((item) => ({
    id: item.id,
    name: item.name ?? '-',
    rfc: item.rfc ?? '-',
    company: item.company ?? '-',
    contact_name: item.contact_name ?? '-',
    department: item.department ?? '-',
    phone: item.phone ?? '-',
    email: item.email ?? '-',
    equipment_movements_count: item.equipment_movements_count ?? 0,
  })),
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
  form.value = { ...formDefaults }
  fieldErrors.value = {}
}

function closeEditDialog() {
  editDialog.value = false
  editingClientId.value = null
  editFieldErrors.value = {}
  editForm.value = { ...formDefaults }
}

async function loadClients(options = {}) {
  const { silent = false } = options

  loading.value = true

  if (!silent) {
    errorMessage.value = ''
  }

  try {
    const data = await listClients()
    clients.value = normalizePayload(data)
    backendUnavailable.value = false
  } catch (error) {
    if (!silent) {
      clients.value = []
      backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
      if (!backendUnavailable.value) {
        errorMessage.value = error.response?.data?.message || 'No fue posible cargar clientes.'
      }
    }
  } finally {
    loading.value = false
  }
}

async function onCreateClient() {
  saving.value = true
  fieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false
  const payload = sanitizeClientPayload(form.value)

  try {
    const created = await createClient(payload)
    const createdItem = normalizeSingleItem(created)

    if (createdItem) {
      const exists = clients.value.some((item) => item.id === createdItem.id)

      if (!exists) {
        clients.value = [createdItem, ...clients.value]
      }
    } else {
      clients.value = [
        {
          id: `tmp-${Date.now()}`,
          ...payload,
          equipment_movements_count: 0,
        },
        ...clients.value,
      ]
    }

    $q.notify({ type: 'positive', message: 'Cliente registrado.' })
    resetForm()
    await loadClients({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    fieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(fieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible guardar cliente.'
    }
  } finally {
    saving.value = false
  }
}

async function onEditClient(id) {
  editingClientId.value = id
  editFieldErrors.value = {}
  errorMessage.value = ''

  try {
    const detail = await showClient(id)
    const client = normalizeSingleItem(detail)

    if (!client) {
      errorMessage.value = 'No fue posible obtener el detalle del cliente.'
      return
    }

    setEditFormFromClient(client)
    editDialog.value = true
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'

    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible cargar el cliente.'
    }
  }
}

async function onUpdateClient() {
  if (!editingClientId.value) {
    return
  }

  saving.value = true
  editFieldErrors.value = {}
  errorMessage.value = ''
  backendUnavailable.value = false

  const payload = sanitizeClientPayload(editForm.value)

  try {
    await updateClient(editingClientId.value, payload)
    $q.notify({ type: 'positive', message: 'Cliente actualizado.' })
    closeEditDialog()
    await loadClients({ silent: true })
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    editFieldErrors.value = mapValidationErrors(error)

    if (!backendUnavailable.value && Object.keys(editFieldErrors.value).length === 0) {
      errorMessage.value = error.response?.data?.message || 'No fue posible actualizar cliente.'
    }
  } finally {
    saving.value = false
  }
}

async function onDeleteClient(id) {
  try {
    await deleteClient(id)
    $q.notify({ type: 'positive', message: 'Cliente eliminado.' })
    await loadClients()
  } catch (error) {
    backendUnavailable.value = !error?.response || error?.code === 'ERR_NETWORK'
    if (!backendUnavailable.value) {
      errorMessage.value = error.response?.data?.message || 'No fue posible eliminar cliente.'
    }
  }
}

onMounted(loadClients)
</script>
