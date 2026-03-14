<template>
  <q-layout view="hHh lpR fFf" class="spd-layout">
    <q-header class="spd-header" height-hint="64">
      <q-toolbar style="height: 64px; padding: 0 16px">
        <q-btn
          flat
          dense
          round
          icon="menu"
          color="white"
          class="q-mr-sm"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="spd-header-title">
          <q-icon name="inventory_2" size="22px" />
          <span class="q-ml-sm">Serviprof CRM</span>
        </q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="logout" color="white" @click="onLogout">
          <q-tooltip anchor="bottom middle" self="top middle">Cerrar sesión</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="spd-drawer" :width="256">
      <div class="spd-drawer-brand">
        <div class="spd-drawer-brand-icon">
          <q-icon name="inventory_2" size="24px" color="white" />
        </div>
        <div class="spd-drawer-brand-text">
          <div class="spd-brand-name">Serviprof</div>
          <div class="spd-brand-sub">Sistema de almacén</div>
        </div>
      </div>

      <q-scroll-area class="spd-drawer-scroll">
        <q-list padding class="q-px-sm">
          <div class="spd-nav-label">Principal</div>

          <q-item clickable v-ripple class="spd-nav-item" to="/" exact>
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="dashboard" size="20px" />
            </q-item-section>
            <q-item-section>Inicio</q-item-section>
          </q-item>

          <div class="spd-nav-label q-mt-sm">Almacén</div>

          <q-item clickable v-ripple class="spd-nav-item" to="/almacen/productos">
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="inventory_2" size="20px" />
            </q-item-section>
            <q-item-section>Productos</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="spd-nav-item" to="/almacen/consumibles">
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="print" size="20px" />
            </q-item-section>
            <q-item-section>Consumibles</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="spd-nav-item" to="/almacen/inventario">
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="fact_check" size="20px" />
            </q-item-section>
            <q-item-section>Control de inventario</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="spd-nav-item" to="/almacen/historial-equipo">
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="history" size="20px" />
            </q-item-section>
            <q-item-section>Historial del equipo</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="spd-nav-item" to="/almacen/ubicaciones">
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="warehouse" size="20px" />
            </q-item-section>
            <q-item-section>Ubicaciones</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="spd-nav-item" to="/almacen/clientes">
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="groups" size="20px" />
            </q-item-section>
            <q-item-section>Clientes</q-item-section>
          </q-item>

          <div class="spd-nav-label q-mt-sm">Próximamente</div>

          <q-item class="spd-nav-item spd-nav-disabled">
            <q-item-section avatar class="spd-nav-icon">
              <q-icon name="point_of_sale" size="20px" />
            </q-item-section>
            <q-item-section>Ventas</q-item-section>
            <q-item-section side>
              <q-badge outline color="blue-3" label="Pronto" />
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
/* Layout & header */
.spd-layout {
  background: #f1f5f9;
}

.spd-header {
  background: linear-gradient(135deg, #1b3a6b 0%, #1e4d8c 100%);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

.spd-header-title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
}

/* Drawer / sidebar */
.spd-drawer {
  background: #0f172a !important;
}

.spd-drawer .q-drawer__backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.spd-drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 18px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.spd-drawer-brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb, #1e4d8c);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.spd-brand-name {
  color: #f1f5f9;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

.spd-brand-sub {
  color: #64748b;
  font-size: 11px;
  margin-top: 2px;
}

.spd-drawer-scroll {
  height: calc(100% - 74px);
}

.spd-nav-label {
  color: #475569;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  padding: 12px 12px 5px;
}

.spd-nav-item {
  border-radius: 8px !important;
  margin: 1px 4px !important;
  color: #94a3b8 !important;
  min-height: 40px !important;
  font-size: 13.5px;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.spd-nav-icon {
  min-width: 36px !important;
}

.spd-nav-item .q-icon {
  color: #64748b !important;
  transition: color 0.15s ease;
}

.spd-nav-item:hover {
  background: rgba(255, 255, 255, 0.07) !important;
  color: #e2e8f0 !important;
}

.spd-nav-item:hover .q-icon {
  color: #94a3b8 !important;
}

.spd-nav-item.q-router-link--active,
.spd-nav-item.q-router-link--exact-active {
  background: rgba(59, 130, 246, 0.18) !important;
  color: #93c5fd !important;
}

.spd-nav-item.q-router-link--active .q-icon,
.spd-nav-item.q-router-link--exact-active .q-icon {
  color: #60a5fa !important;
}

.spd-nav-disabled {
  opacity: 0.38;
  pointer-events: none;
}
</style>
