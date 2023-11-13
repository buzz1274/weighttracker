import { defineStore } from 'pinia'
import { ref, onMounted, computed } from 'vue';

export const useStore = defineStore('store', () => {
  const weights = ref([])
  const weights_labels = ref([])
  const loaded = ref(false)
  const weights_weights = ref([])

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
  })

  return { weights, weights_weights, weights_labels, loaded, }

});
