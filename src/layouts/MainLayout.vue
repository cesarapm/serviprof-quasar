<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="ALM__toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="q-mr-sm"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title shrink class="row items-center no-wrap">
          <q-icon name="inventory_2" size="24px" />
          <span class="q-ml-sm">Serviprof CRM</span>
        </q-toolbar-title>

        <q-space />

        <q-btn flat dense no-caps color="grey-8" label="Cerrar sesión" @click="onLogout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-white" :width="260">
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-item-label header class="text-weight-bold">Módulos</q-item-label>

          <q-item clickable class="ALM__drawer-item" to="/" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Inicio</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="ALM__drawer-item" to="/almacen/productos">
            <q-item-section avatar>
              <q-icon name="inventory_2" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Alta de productos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="ALM__drawer-item" to="/almacen/inventario">
            <q-item-section avatar>
              <q-icon name="fact_check" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Control de inventario</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="ALM__drawer-item" to="/almacen/historial-equipo">
            <q-item-section avatar>
              <q-icon name="history" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Historial del equipo</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="ALM__drawer-item" to="/almacen/consumibles">
            <q-item-section avatar>
              <q-icon name="print" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Consumibles</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="ALM__drawer-item" to="/almacen/ubicaciones">
            <q-item-section avatar>
              <q-icon name="warehouse" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ubicaciones</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="ALM__drawer-item" to="/almacen/clientes">
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Clientes</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable class="ALM__drawer-item" disable>
            <q-item-section avatar>
              <q-icon name="point_of_sale" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ventas (próximamente)</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'

export default {
  name: 'MyLayout',

  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const leftDrawerOpen = ref(false)

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    async function onLogout() {
      await auth.logout()
      await router.push('/login')
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      onLogout,
    }
  },
}
</script>

<style>
.ALM__toolbar {
  height: 64px;
}

.ALM__drawer-item {
  border-radius: 0 24px 24px 0;
  margin-right: 12px;
}
</style>
