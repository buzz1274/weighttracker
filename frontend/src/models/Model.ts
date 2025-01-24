import { computed } from 'vue'

interface ResponseDataObject {
  [key: string | number]: string | number | object
}

export class Model {
  HOST: string = 'https://' + window.location.hostname + '/'
  response: Promise<ResponseDataObject>

  errors = computed(() => {
    return this.errors.value
  })

  constructor() {}

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}

//export { Model, ResponseDataObject }
