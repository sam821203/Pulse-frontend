<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToDetail = () => {
  router.push('/listedCompany/detail')
}
</script>
<template>
  <MainHeader title="上櫃公司群組" iconType="UserFilled" />
  <button @click="navigateToDetail">查看詳情</button>
  <router-view></router-view>
</template>

<style scoped></style>
