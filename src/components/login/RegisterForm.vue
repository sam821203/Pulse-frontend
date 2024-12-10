<script setup>
import { register } from '../../api/auth/index'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { useToast } from 'primevue/usetoast'
import * as yup from 'yup'

const toast = useToast()

const formData = reactive({
  name: '',
  password: ''
})

const schema = yup.object().shape({
  name: yup.string().required('名稱欄位為必填'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      '密碼必須包含大小寫英文和數字，且至少8個字符'
    )
    .required('密碼欄位為必填')
})

const resolver = yupResolver(schema)

const handleRegister = async ({ valid }) => {
  if (valid) {
    const res = await register(formData)
    if (res.code === 0) {
      toast.add({
        severity: 'success',
        summary: res.msg,
        life: 3000
      })
    }
  }
}
</script>

<template>
  <div class="rounded-[56px] p-1 bg-gradient-to-b from-primary to-transparent">
    <Form
      v-slot="$form"
      :formData
      :resolver
      :validateOnValueUpdate="true"
      :validateOnBlur="true"
      @submit="handleRegister"
      class="flex flex-col gap-4 w-full md:w-[30rem]"
    >
      <div class="flex flex-col gap-1">
        <label for="name" class="block text-gray-900 dark:text-white text-xl font-medium mb-2"
          >使用者名稱<span class="text-red-500 ml-1">*</span></label
        >
        <InputText
          v-model="formData.name"
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
          v-model="formData.password"
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
      <Button label="註冊" type="submit" class="w-full mt-2 mb-8" />
    </Form>
  </div>
</template>

<style scoped></style>
