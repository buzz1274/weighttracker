import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export const use_weight_store = defineStore('weight_store', () => {
  const weights = ref([])
  const weights_labels = ref([])
  const loaded = ref(false)
  const weights_weights = ref([])
  const errors = ref([])

  function add(date: string, weight_kg: number): void {
    fetch('https://' + window.location.hostname + '/api/user/weights/', {
      method: 'POST',
      body: JSON.stringify({
        weight_kg: weight_kg,
        date: date
      })
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.status == 400) {
          errors.value = data.response
        }

        errors.value = data.response

        console.log('HERE')
        console.log(data)
        //add weight to weights store
      })
      .catch((error) => {
        console.log('HERP DERP')
        //console.log(error['weight_kg']['weight_kg'])
        errors.value = error
        console.log('ERROR CAUGHT')
      })
  }

  function get() {
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
    get()
  })

  return { weights, weights_weights, weights_labels, loaded, errors, get, add }
})
