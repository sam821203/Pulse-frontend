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
  <StockDetailHeader
    :stock-data="stockData"
    :pe-ratio="equitiesData.peRatio"
    :industry="industryLabel"
  />

  <Tabs value="0">
    <TabList>
      <Tab value="0">即時走勢</Tab>
      <Tab value="1">技術分析</Tab>
      <Tab value="2">籌碼分析</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <StockRealtimeTab :chart-data="chartData" :stock-data="stockData" />
      </TabPanel>
      <TabPanel value="1">
        <FeatureComingSoon
          icon="pi pi-chart-line"
          subtitle="技術分析即將推出，敬請期待。"
        />
      </TabPanel>
      <TabPanel value="2">
        <FeatureComingSoon
          icon="pi pi-users"
          subtitle="籌碼分析即將推出，敬請期待。"
        />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
