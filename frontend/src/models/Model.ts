import { computed } from 'vue'
import Cookies from 'js-cookie'

interface ResponseDataObject {
  [key: string | number]: string | number | object
}

export class Model {
  HOST: string = 'https://' + window.location.hostname + '/'
  response: Promise<ResponseDataObject>

  errors = computed(() => {
    return this.errors.value
  })

  get_cookie(name) {
    return Cookies.get(name)
  }

  constructor() {}

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}

//export { Model, ResponseDataObject }
