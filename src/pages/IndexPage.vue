<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Panel principal</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Alta de productos</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" to="/almacen/productos" label="Abrir" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Control de inventario</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" to="/almacen/inventario" label="Abrir" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Historial del equipo</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" to="/almacen/historial-equipo" label="Abrir" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Consumibles</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" to="/almacen/consumibles" label="Abrir" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Ubicaciones</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" to="/almacen/ubicaciones" label="Abrir" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Clientes</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" to="/almacen/clientes" label="Abrir" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup></script>
