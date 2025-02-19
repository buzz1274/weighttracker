import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { WeightModel } from '@/models/WeightModel'
import { UserModel } from '@/models/UserModel'

export const useStore = defineStore('store', () => {
  const userModel = ref(new UserModel())
  const weightModel = ref(new WeightModel(userModel.value))
  const criticalErrors: ref<string | null> = ref(null)
  const hasCriticalErrors: ref<boolean> = ref(false)

  watch([weightModel.value, userModel.value], () => {
    if (weightModel.value.criticalErrors) {
      criticalErrors.value = weightModel.value.criticalErrors
      hasCriticalErrors.value = true
    }

    if (userModel.value.criticalErrors) {
      criticalErrors.value = userModel.value.getErrors('critical')
      hasCriticalErrors.value = true
    }
  })

  return { userModel, weightModel, criticalErrors, hasCriticalErrors }
})
