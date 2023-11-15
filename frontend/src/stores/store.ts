import { defineStore } from 'pinia'
import { ref, onMounted, } from 'vue';

export const useStore = defineStore('store', () => {
  const weights = ref([])
  const weights_labels = ref([])
  const loaded = ref(false)
  const weights_weights = ref([])
  const user = ref([])

  function retrieveUser() {
    fetch('/api/user/2', {method: "GET"}).then(
        response => response.json()
    ).then(data => {
      user.value = data
    }).catch((error) => {
      console.log(error)
    })
  }

  function retrieveWeights() {
    fetch('/api/weights/', {method: "GET"}).then(
        response => response.json()
    ).then(data => {
      weights.value = data

      weights_weights.value = weights.value.reduce((
          weights,
          weight
      ) => {
        weights.push(weight['weight'])
        return weights
      }, [])

      weights_labels.value = weights.value.reduce((
          dates,
          weight
      ) => {
        dates.push(weight['date'])
        return dates
      }, [])

      loaded.value = true

    }).catch((error) => {
      console.log(error)
    })
  }

  onMounted(() => {
    retrieveWeights()
    retrieveUser()
  })

  return { weights, weights_weights, weights_labels, loaded, user }

});
