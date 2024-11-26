<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <div
        style="
          border-radius: 56px;
          padding: 0.3rem;
          background: linear-gradient(
            180deg,
            rgba(220, 53, 69, 0.4) 10%,
            rgba(33, 150, 243, 0) 30%
          );
        "
      >
        <div
          class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
          style="border-radius: 53px"
        >
          <div class="grid flex flex-column align-items-center">
            <span class="text--danger font-bold text-3xl">{{ route.query?.status }}</span>
            <h1 class="text-900 font-bold text-5xl mb-2">
              {{ route.query?.msg || '系統發生異常' }}
            </h1>
            <div class="col-12 mt-5 text-center">
              <i
                class="pi pi-fw pi-arrow-left text--primary mr-2"
                style="vertical-align: center"
              ></i>
              <router-link to="/" class="text--primary">回去首頁</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const route = useRoute()
</script>
