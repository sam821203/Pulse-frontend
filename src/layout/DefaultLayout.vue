<script setup lang="ts">
import { useLayout } from '@/layout/composables/layout'
import { computed, ref, watch } from 'vue'
import MainFooter from '@/components/MainFooter.vue'
import MainMenu from '@/components/MainMenu.vue'
import MainTopbar from '@/components/MainTopbar.vue'

const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useLayout()

const outsideClickListener = ref<((event: MouseEvent) => void) | null>(null)

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener()
  } else {
    unbindOutsideClickListener()
  }
})

const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive':
      layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive
  }
})

function bindOutsideClickListener() {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event: MouseEvent) => {
      if (isOutsideClicked(event)) {
        resetMenu()
      }
    }
    document.addEventListener('click', outsideClickListener.value)
  }
}

function unbindOutsideClickListener() {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener.value)
    outsideClickListener.value = null
  }
}

function isOutsideClicked(event: MouseEvent) {
  const sidebarEl = document.querySelector('.layout-sidebar')
  const topbarEl = document.querySelector('.layout-menu-button')
  if (!sidebarEl || !topbarEl) return true

  const target = event.target
  if (!(target instanceof Node)) return true

  return !(
    sidebarEl.isSameNode(target) ||
    sidebarEl.contains(target) ||
    topbarEl.isSameNode(target) ||
    topbarEl.contains(target)
  )
}
</script>

<template>
  <!-- <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/stock">Stock</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <div class="main-container flex flex-col">
    <RouterView />
  </div> -->
  <div class="layout-wrapper" :class="containerClass">
    <MainTopbar />
    <div class="layout-sidebar">
      <MainMenu />
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <RouterView />
      </div>
      <MainFooter />
    </div>
    <div class="layout-mask animate-fadein"></div>
  </div>
</template>

<style lang="scss"></style>
