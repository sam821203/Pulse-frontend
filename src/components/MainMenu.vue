<script setup lang="ts">
import MainMenuItem from './MainMenuItem.vue'
import { mainMenuModel } from '@/config/mainMenu'

const model = ref(mainMenuModel)
</script>

<template>
  <div class="layout-menu">
    <template v-for="(item, i) in model" :key="item.label">
      <main-menu-item :item="item" :index="i" />
    </template>
  </div>
</template>

<style lang="scss"></style>
