<script setup lang="ts">
import type { QuoteField, QuoteTone } from '../composables/useStockQuotePanel'

defineProps<{
  leftFields: QuoteField[]
  rightFields: QuoteField[]
}>()

const toneClass = (tone: QuoteTone): string => {
  switch (tone) {
    case 'up':
    case 'ask':
      return 'quote-field__value--up'
    case 'down':
    case 'bid':
      return 'quote-field__value--down'
    case 'flat':
      return 'quote-field__value--flat'
    default:
      return ''
  }
}
</script>

<template>
  <div class="quote-field-grid grid grid-cols-2 gap-x-3 sm:gap-x-4">
    <div
      v-for="(fields, colIndex) in [leftFields, rightFields]"
      :key="colIndex"
      class="quote-field-grid__col flex flex-col divide-y divide-gray-100 min-w-0"
    >
      <div
        v-for="field in fields"
        :key="field.label"
        class="quote-field-grid__row grid grid-cols-[auto_1fr] gap-x-2 py-1.5 first:pt-0 last:pb-0"
      >
        <span class="quote-field__label text-sm text-gray-500 leading-tight">{{ field.label }}</span>
        <span
          class="quote-field__value text-sm font-semibold tabular-nums text-gray-800 text-right leading-tight"
          :class="toneClass(field.tone)"
        >
          {{ field.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.quote-field {
  &__value--up {
    color: #eb3d4d;
  }

  &__value--down {
    color: #00b74a;
  }

  &__value--flat {
    color: #6b7280;
  }
}
</style>
