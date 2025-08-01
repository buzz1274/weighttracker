import { ref } from 'vue'
import Cookies from 'js-cookie'
import type { Error, Notification } from '@/types/types.d.ts'

export class Model {
  _host: string = 'https://' + window.location.hostname + '/'
  _errors: ref<Array<Error> | null> = ref(null)
  _notification: ref<Notification | null> = ref(null)
  protected _data_fetched: boolean = false

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

  public dataFetched(): boolean {
    return this._data_fetched
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
    this._data_fetched = true
  }

  protected reset(): void {
    for (const property in this) {
      if (this.isPropertyOf(property)) {
        this[property as keyof this] = null
      }
    }
    this._data_fetched = false
  }

  protected isPropertyOf(property): boolean {
    return (
      Object.hasOwn(this, property) && typeof this[property] !== 'function' && property[0] !== '_'
    )
  }
}
