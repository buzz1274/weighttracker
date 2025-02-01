import { defineStore } from 'pinia'
import { ref } from 'vue'
import { WeightModel } from '@/models/WeightModel'
import { UserModel } from '@/models/UserModel'

export const useStore = defineStore('store', () => {
  const weight_model = ref(new WeightModel())
  const user_model = ref(new UserModel())

  return { weight_model, user_model }
})
