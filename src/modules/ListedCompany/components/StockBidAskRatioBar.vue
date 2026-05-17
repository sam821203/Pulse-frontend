<script setup lang="ts">
import type { BidAskRatio } from '../utils/bidAskRatio'

const props = defineProps<{
  ratio?: BidAskRatio | null
}>()

const isEmpty = computed(() => !props.ratio)

const innerWidth = computed(() => (props.ratio ? `${props.ratio.innerPct}%` : '50%'))
const outerWidth = computed(() => (props.ratio ? `${props.ratio.outerPct}%` : '50%'))

const formatPct = (value: number): string =>
  new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
</script>

<template>
  <section
    class="bid-ask-ratio"
    aria-label="內盤外盤比例"
    :aria-busy="isEmpty"
  >
    <header class="bid-ask-ratio__labels flex justify-between items-baseline text-sm mb-1">
      <span class="inline-flex items-baseline gap-1">
        <span class="text-gray-900">內盤</span>
        <span
          class="font-semibold bid-ask-ratio__inner-pct"
          :class="{ 'bid-ask-ratio__pct--empty': isEmpty }"
        >
          {{ isEmpty ? '—' : `${formatPct(ratio!.innerPct)}%` }}
        </span>
      </span>
      <span class="inline-flex items-baseline gap-1">
        <span
          class="font-semibold bid-ask-ratio__outer-pct"
          :class="{ 'bid-ask-ratio__pct--empty': isEmpty }"
        >
          {{ isEmpty ? '—' : `${formatPct(ratio!.outerPct)}%` }}
        </span>
        <span class="text-gray-900">外盤</span>
      </span>
    </header>
    <div
      v-if="isEmpty"
      class="bid-ask-ratio__track bid-ask-ratio__track--empty flex gap-px h-3"
      role="presentation"
    >
      <span class="bid-ask-ratio__inner-bar bid-ask-ratio__inner-bar--empty block h-full flex-1" />
      <span class="bid-ask-ratio__outer-bar bid-ask-ratio__outer-bar--empty block h-full flex-1" />
    </div>
    <div v-else class="bid-ask-ratio__track flex gap-px h-3" role="presentation">
      <span
        class="bid-ask-ratio__inner-bar block h-full bg-[#00b74a]"
        :style="{ width: innerWidth }"
      />
      <span
        class="bid-ask-ratio__outer-bar block h-full bg-[#eb3d4d]"
        :style="{ width: outerWidth }"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.bid-ask-ratio {
  &__inner-pct {
    color: #00b74a;
  }

  &__outer-pct {
    color: #eb3d4d;
  }

  &__pct--empty {
    color: #9ca3af;
    font-weight: 500;
  }

  &__track {
    background-color: #fff;
  }

  &__track--empty {
    background-color: #f3f4f6;
  }

  &__inner-bar--empty {
    background-color: #d1fae5;
  }

  &__outer-bar--empty {
    background-color: #fee2e2;
  }
}
</style>
