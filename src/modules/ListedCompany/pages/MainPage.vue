<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTitle = computed(() => String(route.meta.title ?? ''))
</script>
<template>
  <MainHeader :title="pageTitle" iconType="pi pi-building" />
</template>

<style scoped></style>
