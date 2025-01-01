import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export const useStore = defineStore('store', () => {
  const weights = ref([])
  const weights_labels = ref([])
  const loaded = ref(false)
  const weights_weights = ref([])
  const user = ref({
    name: null,
    logged_in: false,
    access_token: null,
    refresh_token: null,
    registered: null,
    bmi_boundaries: [],
    stats: []
  })

  function retrieveWeights() {
    fetch('https://' + window.location.hostname + '/api/user/weights/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        weights.value = data

        weights_weights.value = weights.value.reduce((weights, weight) => {
          weights.push(weight['weight_kg'])
          return weights
        }, [])

        weights_labels.value = weights.value.reduce((dates, weight) => {
          dates.push(weight['date'])
          return dates
        }, [])

        loaded.value = true
      })
      .catch((error) => {
        console.log(error)
      })
  }

  onMounted(() => {
    retrieveWeights()
  })

  return { weights, weights_weights, weights_labels, loaded, user }
})
