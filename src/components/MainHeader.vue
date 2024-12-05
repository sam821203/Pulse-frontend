<script lang="ts" setup>
import { checkTextOverflow } from '@/utils/text'
import { Document, Operation, UserFilled } from '@element-plus/icons-vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  iconType: {
    type: String as () => keyof typeof icons,
    required: true
  }
})

const icons = {
  Document,
  Operation,
  UserFilled
}
</script>

<template>
  <h2 class="header">
    <el-icon :size="24"><component :is="icons[iconType]" /></el-icon>
    <el-tooltip popper-class="tooltip" :disabled="!checkTextOverflow(title, 12, 320)">
      <template #content>
        <p>{{ title }}</p>
      </template>
      <p>{{ title }}</p>
    </el-tooltip>
  </h2>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 24px;
  .el-tooltip__trigger {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
