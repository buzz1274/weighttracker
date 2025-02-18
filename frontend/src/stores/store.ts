import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { WeightModel } from '@/models/WeightModel'
import { UserModel } from '@/models/UserModel'

export const useStore = defineStore('store', () => {
  const user_model = ref(new UserModel())
  const weight_model = ref(new WeightModel(user_model.value))
  const criticalErrors = ref('')

  watch([weight_model.value, user_model.value], () => {
    if (weight_model.value.criticalErrors) {
      criticalErrors.value = weight_model.value.criticalErrors
    }
    //console.log("IN WATCH")
    //console.log(criticalErrors.value)
    //console.log(criticalErrors.value.length)
  })

  return { weight_model, user_model, criticalErrors }
})
