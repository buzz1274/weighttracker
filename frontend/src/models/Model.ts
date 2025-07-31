import { ref } from 'vue'
import Cookies from 'js-cookie'
import type { Error, Notification } from '@/types/types.d.ts'

export class Model {
  _host: string = 'https://' + window.location.hostname + '/'
  _errors: ref<Array<Error> | null> = ref(null)
  _notification: ref<Notification | null> = ref(null)

  constructor() {
    this.notification = this.notification.bind(this)
    this.errors = this.errors.bind(this)
  }

  public notification(notification?: Notification): ref<Notification | null> {
    if (notification) {
      this._notification.value = notification
    }
    return this._notification.value
  }

  public errors(errors?: Array<Error>): ref<Array<Error>> {
    if (errors) {
      this._errors.value = errors
    }
    return this._errors.value
  }

  protected getCookie(name: string): string {
    return Cookies.get(name)
  }

  protected apiUrl(endpoint: string): string {
    return this._host + endpoint
  }

  protected hydrate(data: object): void {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property] = data[property]
      }
    }
  }

  protected reset(): void {
    for (const property in this) {
      if (this.isPropertyOf(property)) {
        this[property as keyof this] = null
      }
    }
  }

  protected isPropertyOf(property): boolean {
    return (
      Object.hasOwn(this, property) && typeof this[property] !== 'function' && property[0] !== '_'
    )
  }
}
