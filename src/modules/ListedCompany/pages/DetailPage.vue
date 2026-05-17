<script setup lang="ts">
import { useStockDetail } from '../composables/useStockDetail'

const { currentStock, stockData, chartData, equitiesData, setupLifecycle } = useStockDetail()

setupLifecycle()

const industryLabel = computed(() => {
  const value = currentStock.industry
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : String(value)
})
</script>

<template>
  <div class="stock-detail flex flex-col gap-4 md:gap-5">
    <StockDetailHeader
      :stock-data="stockData"
      :pe-ratio="equitiesData.peRatio"
      :industry="industryLabel"
    />

    <div class="card stock-detail__tabs">
      <Tabs value="0">
        <TabList class="stock-detail__tab-list">
          <Tab value="0">即時走勢</Tab>
          <Tab value="1">技術分析</Tab>
          <Tab value="2">籌碼分析</Tab>
        </TabList>  
        <TabPanels>
          <TabPanel value="0" class="stock-detail__tab-panel">
            <StockRealtimeTab
              :chart-data="chartData"
              :stock-data="stockData"
              :pe-ratio="equitiesData.peRatio"
            />
          </TabPanel>
          <TabPanel value="1" class="stock-detail__tab-panel">
            <FeatureComingSoon
              icon="pi pi-chart-line"
              subtitle="技術分析即將推出，敬請期待。"
            />
          </TabPanel>
          <TabPanel value="2" class="stock-detail__tab-panel">
            <FeatureComingSoon
              icon="pi pi-users"
              subtitle="籌碼分析即將推出，敬請期待。"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stock-detail {
  &__tabs {
    padding-bottom: 1rem;
  }

  &__tab-list {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex-wrap: nowrap;

    :deep([role='tablist']) {
      flex-wrap: nowrap;
      min-width: min-content;
    }

    :deep([data-pc-name='tab']) {
      white-space: nowrap;
      flex-shrink: 0;
      font-size: 1rem;

      @media (min-width: 640px) {
        font-size: 1.0625rem;
      }
    }
  }

  &__tab-panel {
    padding-top: 0.75rem;

    @media (min-width: 768px) {
      padding-top: 1rem;
    }
  }
}
</style>
