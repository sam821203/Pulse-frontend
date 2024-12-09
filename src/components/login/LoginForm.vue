<script setup>
import { login } from '../../api/auth/index'
import router from '@/router/index'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import loading from '@/utils/loading'
import * as yup from 'yup'
import { useUserStore, useToastStore } from '@/stores'
import isEmpty from 'lodash/isEmpty'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const toastStore = useToastStore()
const { toastMsg } = storeToRefs(toastStore)

const submitData = reactive({
  name: '',
  password: ''
})

const schema = yup.object().shape({
  name: yup
    .string()
    // .matches(/^[0-9]+$/, '手機欄位必須為數字')
    .required('手機欄位為必填'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      '密碼必須包含大小寫英文和數字，且至少8個字符'
    )
    .required('密碼欄位為必填')
})

const resolver = yupResolver(schema)

const handleLogin = async ({ valid }) => {
  loading.start()
  try {
    if (valid) {
      const res = await login(submitData)
      if (!isEmpty(res.data)) {
        console.log('res 1', res)

        localStorage.setItem('token', res.data.token)
        try {
          await userStore.getUserInfoData(res.data.userId)
          router.replace('/')
        } catch {
          console.error('Get user info error')
        }
      } else {
        toastMsg.value = res.msg
      }
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.stop()
  }
}

// const alter = () => {
//   userStore.setEvent('alter')
// }
</script>

<template>
  <div class="rounded-[56px] p-1 bg-gradient-to-b from-primary to-transparent">
    <Form
      v-slot="$form"
      :submitData
      :resolver
      :validateOnValueUpdate="true"
      :validateOnBlur="true"
      @submit="handleLogin"
      class="flex flex-col gap-4 w-full md:w-[30rem]"
    >
      <div class="flex flex-col gap-1">
        <label for="name" class="block text-gray-900 dark:text-white text-xl font-medium mb-2"
          >使用者名稱<span class="text-red-500 ml-1">*</span></label
        >
        <InputText
          v-model="submitData.name"
          name="name"
          type="text"
          placeholder="請輸入使用者名稱"
          fluid
        />
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
          $form.name.error.message
        }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <label for="password" class="block text-gray-900 dark:text-white font-medium text-xl mb-2"
          >密碼<span class="text-red-500 ml-1">*</span></label
        >
        <Password
          v-model="submitData.password"
          name="password"
          type="password"
          placeholder="請輸入密碼"
          :feedback="false"
          toggleMask
          fluid
        />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error.message
        }}</Message>
      </div>
      <Button label="登入" type="submit" class="w-full mt-2 mb-8" />
    </Form>
  </div>
</template>

<style scoped></style>
