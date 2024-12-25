<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

const handleGetUser = async () => {
  const res = await userStore.getUserInfoData('6756a49f61958e097867ee6c')
  console.log('res:', res)
}

const goListedCompany = async () => {
  router.push({ name: 'listedCompany' })
}
</script>

<template>
  <main>
    <h2>Dashboard</h2>
    <!-- <div class="card flex justify-center gap-4">
      <Button label="取得 UserInfo" @click="handleGetUser" />
      <Button label="上市股票" @click="goListedCompany" />
    </div> -->
  </main>
</template>
