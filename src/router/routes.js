const routes = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'almacen/productos',
        component: () => import('pages/warehouse/ProductsPage.vue'),
      },
      {
        path: 'almacen/inventario',
        component: () => import('pages/warehouse/InventoryPage.vue'),
      },
      {
        path: 'almacen/historial-equipo',
        component: () => import('pages/warehouse/EquipmentHistoryPage.vue'),
      },
      {
        path: 'almacen/consumibles',
        component: () => import('pages/warehouse/ConsumablesPage.vue'),
      },
      {
        path: 'almacen/ubicaciones',
        component: () => import('pages/warehouse/LocationsPage.vue'),
      },
      {
        path: 'almacen/clientes',
        component: () => import('pages/warehouse/ClientsPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
