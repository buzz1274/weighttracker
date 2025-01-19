import { computed, ref } from 'vue'

export class Model {
  HOST = 'https://' + window.location.hostname + '/'
  api_errors = ref([])
  form_errors = ref([])

  errors = computed(() => {
    return this.errors.value
  })

  constructor() {}

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}
