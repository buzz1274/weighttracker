import { ref } from 'vue'
import Cookies from 'js-cookie'

type errorsArray = {
  error: string[]
}

export class Model {
  host: string = 'https://' + window.location.hostname + '/'
  errors = ref([])
  criticalErrors = ref([])
  criticalModal: ref<boolean>

  constructor() {}

  hydrate(data: object): void {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = data[property]
      }
    }
  }

  setCriticalModal(criticalModal: ref<boolean>): void {
    this.criticalModal = criticalModal
  }

  getErrors(type?: string): ref<errorsArray> {
    if (type === 'critical') {
      return this.criticalErrors.value
    } else {
      return this.errors
    }
  }

  set_errors(errors, type?: string): void {
    console.log(errors)
    if (type === 'critical') {
      this.criticalModal.value = Boolean(errors)
      this.criticalErrors.value = errors
    } else {
      this.errors.value = errors
    }
  }

  reset_errors(): void {
    this.set_errors([])
  }

  get_cookie(name: string): string {
    return Cookies.get(name)
  }

  api_url(endpoint: string): string {
    return this.host + endpoint
  }
}
