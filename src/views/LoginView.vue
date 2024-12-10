<script setup>
// import { useUserStore } from '@/stores'
// import { storeToRefs } from 'pinia'
import LoginForm from '@/components/login/LoginForm.vue'
import RegisterForm from '@/components/login/RegisterForm.vue'

// const userStore = useUserStore()
// const { event } = storeToRefs(userStore)

// const checked = ref(false)
// const currentEvent = ref('login')

const tabs = ref([
  { title: '登入', value: '0' },
  { title: '註冊', value: '1' }
])

// watch(event, (newEvent) => {
//   currentEvent.value = newEvent
// })
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen min-w-full overflow-hidden"
  >
    <Card>
      <template #content>
        <Tabs value="0">
          <TabList>
            <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.title }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
              <h2 class="py-2 text-center text-3xl font-bold text-primary">{{ tab.title }}</h2>
              <template v-if="tab.title === '登入'">
                <LoginForm />
              </template>
              <template v-else-if="tab.title === '註冊'">
                <RegisterForm />
              </template>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
