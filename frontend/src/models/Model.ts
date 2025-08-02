import { ref } from 'vue'
import Cookies from 'js-cookie'
import router from '@/router'
import type { Error, Notification } from '@/types/types.d.ts'

export class Model {
  protected _host: string = 'https://' + window.location.hostname + '/'
  protected _errors: ref<Array<Error> | null> = ref(null)
  protected _notification: ref<Notification | null> = ref(null)
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

  public reset(): void {
    for (const property in this) {
      if (this.isPropertyOf(property)) {
        this[property as keyof this] = null
      }
    }
    this._data_fetched = false
  }

  protected fetch(url: string, request: RequestInit): Promise<Response | void> {
    const HTTP_FORBIDDEN = 403

    return fetch(this.apiUrl(url), request)
      .then((response) => {
        if (response.status === HTTP_FORBIDDEN) {
          throw new Error(String(HTTP_FORBIDDEN))
        } else {
          return response
        }
      })
      .catch((error) => {
        if (error.message === String(HTTP_FORBIDDEN)) {
          router.push('/logout').then(() => {})
        }
        throw new Error()
      })
  }

  protected getCookie(name: string): string {
    return Cookies.get(name)
  }

  protected hydrate(data: object): void {
    for (const property in data) {
      if (this.isPropertyOf(property)) {
        this[property] = data[property]
      }
    }
    this._data_fetched = true
  }

  protected isPropertyOf(property): boolean {
    return (
      Object.hasOwn(this, property) && typeof this[property] !== 'function' && property[0] !== '_'
    )
  }

  private apiUrl(endpoint: string): string {
    return this._host + endpoint
  }
}
