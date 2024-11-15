<script setup lang="ts">
import { _hello } from '../api/user/index'

_hello().then((res) => {
  console.log(res)
})
</script>

<template>
  <main>
    <h2>Login 頁面</h2>
  </main>
</template>
