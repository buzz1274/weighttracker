import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { WeightModel } from '@/models/WeightModel'
import { UserModel } from '@/models/UserModel'
import type { Notification } from '@/types/types.d.ts'

export const useStore = defineStore('store', () => {
  const userModel = ref(new UserModel())
  const weightModel = ref(new WeightModel(userModel.value))
  const hasNotification: ref<boolean> = ref(false)
  const notification: ref<Notification | null> = ref(null)

  watch([weightModel.value.notification, userModel.value.notification], (n) => {
    hasNotification.value = true
    notification.value = n[0]
  })

  return { userModel, weightModel, hasNotification, notification }
})
