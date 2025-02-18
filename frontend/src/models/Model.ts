import { ref } from 'vue'
import Cookies from 'js-cookie'

type errorsArray = {
  error: string[]
}

export class Model {
  host: string = 'https://' + window.location.hostname + '/'
  errors = ref([])
  criticalErrors = ref('')

  constructor() {}

  hydrate(data: object): void {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = data[property]
      }
    }
  }

  getErrors(type?: string): ref<errorsArray> {
    if (type === 'critical') {
      return this.criticalErrors
    } else {
      return this.errors
    }
  }

  set_errors(errors, type?: string): void {
    if (type === 'critical') {
      this.criticalErrors = errors
    } else {
      this.errors = errors
    }
  }

  resetErrors(): void {
    this.set_errors([])
  }

  getCookie(name: string): string {
    return Cookies.get(name)
  }

  apiUrl(endpoint: string): string {
    return this.host + endpoint
  }
}
