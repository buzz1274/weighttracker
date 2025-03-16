import { ref } from 'vue'
import Cookies from 'js-cookie'

export type Error = {
  key: string
  error: string
}

export class Model {
  host: string = 'https://' + window.location.hostname + '/'
  errors: ref<Array<Error>> = ref([])
  criticalErrors: ref<string | null> = ref(null)

  constructor() {}

  hydrate(data: object): void {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = data[property]
      }
    }
  }

  getErrors(type?: string): ref<Array<Error> | string | null> {
    if (type === 'critical') {
      return this.criticalErrors
    } else {
      return this.errors
    }
  }

  setErrors(errors: ref<string | null | Array<Error>>, type?: string): void {
    if (type === 'critical') {
      this.criticalErrors = errors
    } else {
      this.errors = errors
    }
  }

  resetErrors(type?: string): void {
    this.setErrors([], type)
  }

  getCookie(name: string): string {
    return Cookies.get(name)
  }

  apiUrl(endpoint: string): string {
    return this.host + endpoint
  }
}
