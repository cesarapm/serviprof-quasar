<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-xl">
      <div class="text-h5 text-weight-bold text-grey-9">Panel principal</div>
      <div class="text-body2 text-grey-6 q-mt-xs">Bienvenido al sistema de gestión Serviprof</div>
    </div>

    <div class="row q-col-gutter-lg">
      <div v-for="item in modules" :key="item.route" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="spd-module-card cursor-pointer" flat @click="$router.push(item.route)">
          <q-card-section class="q-pa-lg">
            <div :class="`spd-module-icon bg-${item.color}-1`">
              <q-icon :name="item.icon" :color="item.color + '-8'" size="26px" />
            </div>
            <div class="spd-module-title q-mt-md">{{ item.title }}</div>
            <div class="spd-module-desc q-mt-xs">{{ item.description }}</div>
          </q-card-section>
          <div :class="`spd-module-bar bg-${item.color}`"></div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const modules = [
  {
    title: 'Equipos',
    description: 'Alta, movimientos y retornos de equipos',
    icon: 'inventory_2',
    color: 'blue',
    route: '/almacen/productos',
  },
  {
    title: 'Consumibles',
    description: 'Tóners, cartuchos y materiales de impresión',
    icon: 'print',
    color: 'purple',
    route: '/almacen/consumibles',
  },
  {
    title: 'Control de inventario',
    description: 'Vista general del estado del almacén',
    icon: 'fact_check',
    color: 'green',
    route: '/almacen/inventario',
  },
  {
    title: 'Historial de equipos',
    description: 'Movimientos y eventos registrados',
    icon: 'history',
    color: 'orange',
    route: '/almacen/historial-equipo',
  },
  {
    title: 'Ubicaciones',
    description: 'Almacenes, bodegas y locaciones de clientes',
    icon: 'warehouse',
    color: 'teal',
    route: '/almacen/ubicaciones',
  },
  {
    title: 'Clientes',
    description: 'Directorio y asignación de equipos',
    icon: 'groups',
    color: 'indigo',
    route: '/almacen/clientes',
  },
]
</script>

<style scoped>
.spd-module-card {
  border-radius: 16px !important;
  border: 1px solid #e2e8f0 !important;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06) !important;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  overflow: hidden;
  position: relative;
}

.spd-module-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12) !important;
  border-color: #bfdbfe !important;
}

.spd-module-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spd-module-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.spd-module-desc {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.5;
}

.spd-module-bar {
  height: 3px;
  width: 100%;
}
</style>
