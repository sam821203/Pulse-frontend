<script setup lang="ts">
import { EMPTY, fieldGroups, fieldLabels } from '../constants/stockFields'
import type { StockData } from '../model/interface'

const props = defineProps<{
  stockData: StockData
}>()

const displayFieldValue = (key: keyof StockData): string => {
  const value = props.stockData[key]
  if (value === undefined || value === null || value === '') return EMPTY
  return String(value)
}
</script>

<template>
  <aside class="w-full lg:w-1/4 lg:pl-2">
    <section v-for="group in fieldGroups" :key="group.title" class="mb-5">
      <h4 class="text-sm font-semibold text-gray-500 mb-2">{{ group.title }}</h4>
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <template v-for="key in group.keys" :key="key">
          <dt class="text-gray-400">{{ fieldLabels[key] }}</dt>
          <dd class="font-medium m-0 text-gray-800">{{ displayFieldValue(key) }}</dd>
        </template>
      </dl>
    </section>
  </aside>
</template>
