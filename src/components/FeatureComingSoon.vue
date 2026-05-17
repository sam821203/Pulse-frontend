<script setup lang="ts">
defineProps<{
  icon: string
  title?: string
  subtitle: string
}>()
</script>

<template>
  <div class="feature-coming-soon">
    <i :class="[icon, 'feature-coming-soon__icon']" aria-hidden="true" />
    <p class="feature-coming-soon__title">{{ title ?? '功能開發中' }}</p>
    <p class="feature-coming-soon__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped lang="scss">
.feature-coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
  padding: 2rem;
  text-align: center;
  color: #6b7280;

  &__icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  &__title {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
  }

  &__subtitle {
    margin: 0;
    font-size: 0.875rem;
  }
}
</style>
