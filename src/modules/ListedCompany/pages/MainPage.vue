<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
<template>
  <MainHeader :title="router.currentRoute.value.meta.title" iconType="pi pi-building" />
</template>

<style scoped></style>
