<template>
  <q-layout view="lHh Lpr lFf" class="spd-auth-layout">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.spd-auth-layout {
  background: linear-gradient(145deg, #0f172a 0%, #1b3a6b 55%, #1e4d8c 100%);
  min-height: 100vh;
}
</style>
