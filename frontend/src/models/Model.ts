import { ref } from 'vue'
import Cookies from 'js-cookie'
import type { Error, Notification } from '@/types/types.d.ts'

export class Model {
  host: string = 'https://' + window.location.hostname + '/'
  _errors: ref<Array<Error> | null> = ref(null)
  _notification: ref<Notification | null> = ref(null)

  constructor() {
    this.notification = this.notification.bind(this)
    this.errors = this.errors.bind(this)
  }

  hydrate(data: object): void {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(this, property)) {
        this[property] = data[property]
      }
    }
  }

  notification(notification?: Notification): ref<Notification | null> {
    if (notification) {
      this._notification.value = notification
    }
    return this._notification.value
  }

  errors(errors?: Array<Error>): ref<Array<Error>> {
    if (errors) {
      this._errors.value = errors
    }
    return this._errors.value
  }

  getCookie(name: string): string {
    return Cookies.get(name)
  }

  apiUrl(endpoint: string): string {
    return this.host + endpoint
  }
}
