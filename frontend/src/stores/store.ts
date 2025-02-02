import { defineStore } from 'pinia'
import { ref } from 'vue'
import { WeightModel } from '@/models/WeightModel'
import { UserModel } from '@/models/UserModel'

export const useStore = defineStore('store', () => {
  const user_model = ref(new UserModel())
  const weight_model = ref(new WeightModel(user_model))

  return { weight_model, user_model }
})
