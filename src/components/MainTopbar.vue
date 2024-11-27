<script setup>
import { useLayout } from '@/layout/composables/layout'

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout()
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container">
      <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_60_5208)">
            <path
              d="M0 25.5H8.5V32C8.5 33.1046 7.60457 34 6.5 34H2C0.89543 34 0 33.1046 0 32V25.5Z"
              fill="#2BB2FE"
            />
            <rect y="17" width="8.5" height="8.5" fill="#2BB2FE" />
            <path d="M0 10.5C0 9.39543 0.895431 8.5 2 8.5H8.5V17H0V10.5Z" fill="#2BB2FE" />
            <path d="M8.5 2C8.5 0.89543 9.39543 0 10.5 0H17V8.5H8.5V2Z" fill="#883DCF" />
            <rect x="8.5" y="17" width="8.5" height="8.5" fill="#883DCF" />
            <path d="M17 0H23.5C24.6046 0 25.5 0.895431 25.5 2V8.5H17V0Z" fill="#F9C80E" />
            <path d="M17 17H25.5V23.5C25.5 24.6046 24.6046 25.5 23.5 25.5H17V17Z" fill="#F9C80E" />
            <path
              d="M25.5 8.5H32C33.1046 8.5 34 9.39543 34 10.5V15C34 16.1046 33.1046 17 32 17H25.5V8.5Z"
              fill="#F9C80E"
            />
          </g>
          <defs>
            <clipPath id="clip0_60_5208">
              <rect width="34" height="34" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span class="font-semibold">Pulse</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
        <div class="relative">
          <button
            v-styleclass="{
              selector: '@next',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-scalein',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeout',
              hideOnOutsideClick: true
            }"
            type="button"
            class="layout-topbar-action layout-topbar-action-highlight"
          >
            <i class="pi pi-palette"></i>
          </button>
        </div>
      </div>

      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true
        }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-calendar"></i>
            <span>Calendar</span>
          </button>
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-inbox"></i>
            <span>Messages</span>
          </button>
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-user"></i>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
