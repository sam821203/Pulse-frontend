<script setup lang="ts">
import StockBidAskRatioBar from './StockBidAskRatioBar.vue'
import StockOrderBook from './StockOrderBook.vue'
import StockQuoteFieldGrid from './StockQuoteFieldGrid.vue'
import { useStockQuotePanel } from '../composables/useStockQuotePanel'
import type { StockData } from '../model/interface'

const props = defineProps<{
  stockData: StockData
  peRatio?: string
}>()

const accordionValue = ref<string[]>(['報價摘要', '五檔'])

const { leftFields, rightFields, bidAskRatio, orderBook } = useStockQuotePanel(
  () => props.stockData,
  () => props.peRatio ?? ''
)
</script>

<template>
  <aside class="stock-sidebar min-w-0">
    <div class="hidden xl:block stock-sidebar__panel space-y-3">
      <StockQuoteFieldGrid :left-fields="leftFields" :right-fields="rightFields" />
      <StockBidAskRatioBar :ratio="bidAskRatio" />
      <StockOrderBook :order-book="orderBook" />
    </div>

    <Accordion v-model:value="accordionValue" class="xl:hidden stock-sidebar__accordion" multiple>
      <AccordionPanel value="報價摘要">
        <AccordionHeader>報價摘要</AccordionHeader>
        <AccordionContent>
          <div class="space-y-3 pt-1">
            <StockQuoteFieldGrid :left-fields="leftFields" :right-fields="rightFields" />
            <StockBidAskRatioBar :ratio="bidAskRatio" />
          </div>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="五檔">
        <AccordionHeader>五檔</AccordionHeader>
        <AccordionContent>
          <div class="pt-1">
            <StockOrderBook :order-book="orderBook" />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </aside>
</template>

<style scoped lang="scss">
.stock-sidebar {
  :deep(.p-accordionheader) {
    font-size: 0.875rem;
    font-weight: 600;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  :deep(.p-accordioncontent-content) {
    padding-top: 0;
    padding-bottom: 0.5rem;
  }
}
</style>
