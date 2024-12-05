<script setup lang="ts">
import router from '@/router'
import { getUserInfo } from '../api/user/index'

const handleGetUser = async () => {
  const res = await getUserInfo('67513ead23b91593f61167e8')
  console.log('res:', res)
}

const goListedCompany = async () => {
  router.push({ name: 'listedCompany' })
}
</script>

<template>
  <main>
    <h2>Dashboard</h2>
    <div class="card flex justify-center gap-4">
      <Button label="取得 UserInfo" @click="handleGetUser" />
      <Button label="上市股票" @click="goListedCompany" />
    </div>
  </main>
</template>
