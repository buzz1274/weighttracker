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

  constructor() {}

  handle_error(error: object) {
    console.log(error)
  }

  hydrate(data: object) {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = data[property]
      }
    }
  }

  get_cookie(name) {
    return Cookies.get(name)
  }

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}
