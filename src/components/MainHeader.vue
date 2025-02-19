<script lang="ts" setup>
import { checkTextOverflow } from '@/utils/text'

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h2 class="header">
    <span
      v-tooltip.top="{
        value: title,
        pt: {
          text: '!whitespace-nowrap !overflow-hidden !text-ellipsis'
        },
        disabled: !checkTextOverflow(title, 12, 320)
      }"
    >
      {{ title }}
    </span>
  </h2>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  margin-right: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
