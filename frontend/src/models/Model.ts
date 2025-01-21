import { computed } from 'vue'

export class Model {
  HOST: string = 'https://' + window.location.hostname + '/'

  errors = computed(() => {
    return this.errors.value
  })

  constructor() {}

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}
