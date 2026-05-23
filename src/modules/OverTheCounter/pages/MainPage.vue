<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTitle = computed(() => String(route.meta.title ?? ''))
</script>

<template>
  <MainHeader :title="pageTitle" iconType="pi pi-building" />
  <p class="text-gray-600 m-0 mt-3">
    請使用頂部搜尋列輸入上櫃股票代號或名稱，將導向個股詳情（market=otc）。
  </p>
</template>

<style scoped></style>
