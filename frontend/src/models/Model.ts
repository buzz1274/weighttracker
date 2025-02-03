import { ref } from 'vue'
import Cookies from 'js-cookie'

type errorsArray = {
  error: string[]
}

export class Model {
  HOST: string = 'https://' + window.location.hostname + '/'
  errors: errorsArray = ref([])

  constructor() {}

  hydrate(data: object) {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = data[property]
      }
    }
  }

  set_errors(errors: errorsArray) {
    this.errors = errors
  }

  reset_errors() {
    this.set_errors([])
  }

  get_cookie(name: string): string {
    return Cookies.get(name)
  }

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}
