import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue';

export const useStore = defineStore('store', () => {
  const weights = ref(null)

  async function getWeights() {
    await fetch('/api/weights/', {method: "GET"}).then(
        response => response.json()
    ).then(data => {
      weights.value = data;
    }).catch((error) => {
      console.log(error)
    })
  }

  onMounted(async () => {
    await getWeights()
  })

  return { weights, }

});
