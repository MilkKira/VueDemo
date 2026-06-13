<script setup lang="ts">
import PigFooter from './components/PigFooter.vue'
import PigHeader from './components/pigHeader.vue'
</script>

<template>
  <div class="app-shell">
    <PigHeader />
    <RouterView />
    <PigFooter />
  </div>
</template>
