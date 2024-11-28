<script setup>
import { _login } from '../api/auth/index'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

const user = ref({
  phone: '0912345678',
  password: '123456'
})
const checked = ref(false)
const show = () => {
  console.log('12')
  toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 })
}
const login = async () => {
  const res = await _login(user.value)

  if (res.token) {
    localStorage.setItem('token', res.token)
    localStorage.setItem('userId', res.userId)
  }
}
</script>

<template>
  <Button label="Show" @click="show()" />
  <div
    class="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen min-w-full overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="rounded-[56px] p-1 bg-gradient-to-b from-primary to-transparent">
        <label for="phone" class="block text-gray-900 dark:text-white text-xl font-medium mb-2"
          >手機號碼</label
        >
        <InputText
          id="phone"
          type="text"
          placeholder="手機號碼"
          class="w-full md:w-[30rem] mb-8"
          v-model="user.phone"
        />

        <label for="password1" class="block text-gray-900 dark:text-white font-medium text-xl mb-2"
          >Password</label
        >
        <Password
          id="password1"
          v-model="user.password"
          placeholder="Password"
          :toggleMask="true"
          class="mb-4"
          fluid
          :feedback="false"
        ></Password>

        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
          <!-- <div class="flex items-center">
            <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
            <label for="rememberme1">Remember me</label>
          </div>
          <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"
            >Forgot password?</span
          > -->
          <Button label="註冊" class="w-full" as="router-link" to="/register"></Button>
          <Button label="登入" class="w-full" @click="login"></Button>
        </div>
      </div>
    </div>
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
