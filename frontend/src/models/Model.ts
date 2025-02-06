import { ref } from 'vue'
import Cookies from 'js-cookie'

type errorsArray = {
  error: string[]
}

export class Model {
  HOST: string = 'https://' + window.location.hostname + '/'
  errors = ref([])
  criticalErrors: errorsArray = ref([])

  constructor() {}

  hydrate(data: object): void {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = data[property]
      }
    }
  }

  get_errors(type?: string) {
    if (type === 'critical') {
      return this.criticalErrors
    } else {
      return this.errors
    }
  }

  set_errors(errors): void {
    this.errors.value = errors
  }

  reset_errors(): void {
    this.set_errors([])
  }

  get_cookie(name: string): string {
    return Cookies.get(name)
  }

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}
