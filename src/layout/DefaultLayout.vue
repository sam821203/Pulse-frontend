<script setup lang="ts">
// import { DArrowLeft } from "@element-plus/icons-vue";
// import MainNavbar from "@/components/MainNavbar.vue";
// import MainMenu from "@/components/MainMenu.vue";
import { RouterLink, RouterView } from 'vue-router'

const isVisible = ref(true)

const handleToggle = () => {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <!-- <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/stock">Stock</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <div class="main-container flex flex-col">
    <RouterView />
  </div> -->
  <main class="default-layout">
    <aside :class="['default-sidebar', { 'is-show': isVisible }]">
      <!-- <router-link to="/" class="logo">
        <img class="icon-logo" src="@/assets/images/logo-icon.svg" alt="Govern.IQ" />
        <img class="logo-img" src="@/assets/images/logo.svg" alt="Govern.IQ" />
      </router-link> -->
      <!-- <MainMenu :isCollapse="!isVisible" /> -->
      <!-- <el-button class="btn-toggle" @click="handleToggle">
        <el-icon><DArrowLeft /></el-icon>
      </el-button> -->
    </aside>
    <section class="container">
      <!-- <MainNavbar />
      <el-scrollbar wrap-class="content-container">
    </el-scrollbar> -->
      <RouterView />
    </section>
  </main>
</template>

<style lang="scss">
.default-layout {
  position: relative;
  display: flex;
  padding: 32px 24px;
  gap: 26px;
  background-color: #f2f3f5;
  box-sizing: border-box;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    height: 70px;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    color: #303133;
    border-bottom: 1px solid #e4e7ed;
  }

  .icon-logo {
    width: 28px;
    height: 28px;
  }

  .logo-img {
    width: 0;
    height: 44px;
    transition-property: width;
    transition-delay: 0.3s;
    overflow: hidden;
  }

  .container {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 24px;
    min-width: 0;
  }

  .el-scrollbar {
    flex: 1;
  }

  .default-sidebar {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 54px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 0 12px 0 rgba($color: #000000, $alpha: 0.12);
    transition: width 0.2s;

    &.is-show {
      width: 200px;

      .btn-toggle {
        .el-icon {
          transform: rotate(0);
        }
      }

      .icon-logo {
        display: none;
      }

      .logo-img {
        width: auto;
      }
    }
  }

  .btn-toggle {
    position: absolute;
    width: 28px;
    height: 28px;
    padding: 0;
    top: 54px;
    right: -14px;
    border: 1px solid #e4e7ed;
    box-shadow: 0 0 12px 0 rgba($color: #000000, $alpha: 0.12);
    background-color: #f2f3f5;
    cursor: pointer;

    .el-icon {
      transform: rotate(180deg);
    }
  }

  .content-container {
    height: var(--content-height);
  }
}
</style>
