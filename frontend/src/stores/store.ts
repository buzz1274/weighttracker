import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export const useStore = defineStore('store', () => {
  const user = ref({
    name: null,
    logged_in: false,
    access_token: null,
    refresh_token: null,
    registered: null,
    bmi_boundaries: [],
    stats: []
  })

  function retrieveUser() {
    fetch('https://' + window.location.hostname + '/api/user/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        user.value = data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  onMounted(() => {
    retrieveUser()
  })

  return { user }
})
