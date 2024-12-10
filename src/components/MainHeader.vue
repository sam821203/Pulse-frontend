<script lang="ts" setup>
import { checkTextOverflow } from '@/utils/text'

defineProps({
  title: {
    type: String,
    required: true
  },
  iconType: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h2 class="header">
    <i :class="iconType" style="font-size: 1.75rem; color: #708090"></i>
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
  gap: 8px;
  margin-bottom: 16px;
  font-size: 24px;
}
</style>
