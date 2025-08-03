import { Model } from '@/models/Model'
import type { UserSave } from '@/types/types.d.ts'

export class UserModel extends Model {
  protected _is_authenticated: boolean
  id: number
  name: string
  min_weight_kg: number
  max_weight_kg: number
  date_joined: string
  weight_loss_start_date: string
  bmi_boundaries: object = []
  average_weight_kg: number
  starting_weight_kg: number
  target_weight_kg: number
  current_weight_kg: number
  target_hit_date: string
  change_last_month_kg: number
  change_last_week_kg: number
  change_last_year_kg: number
  current_bmi: number
  target_weight_loss_percentage_per_week: number
  next_intermediate_target_date: string
  next_intermediate_target_kg: number
  percentage_weight_lost_of_target: number
  percentage_weight_lost: number
  estimated_weight_at_date: number
  weight_loss_at_date: string
  height_m: number
  intermediate_loss_target_kg: number
  email: string
  sex: string

  constructor() {
    super()

    if (localStorage.getItem('authenticated') === 'true') {
      this._is_authenticated = true
    }
  }

  public isAuthenticated(): boolean {
    return this._is_authenticated
  }

  public isRegistered(): boolean {
    return !(!this.sex || !this.height_m || !this.starting_weight_kg)
  }

  public get(): void {
    this.fetch('/api/user/', { method: 'GET' })
      .then((response) => {
        return response ? response.json() : null
      })
      .then((data) => this.hydrate(data))
      .catch((error) => error.message && this.notification(error.message))
  }

  public save(user: UserSave): Promise<[boolean, boolean]> {
    let response_status: number

    return this.fetch('api/user/' + this.id, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then((response) => {
        if (!response) throw new Error()

        response_status = response.status

        return response.json()
      })
      .then((data) => {
        if (response_status == 200 || response_status == 201) {
          return [true, true]
        } else if (response_status == 400) {
          this.errors(data)
          return [false, false]
        } else {
          throw new Error(data['detail'])
        }
      })
      .catch((error) => {
        if (error.message) {
          this.notification({
            message: error,
            type: 'error'
          })
        }
        return [false, true]
      })
  }

  public logout(): Promise<boolean> {
    return this.fetch('/api/user/logout/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        'Content-Type': 'application/json'
      }
    }).then(() => {
      this.handle_logout()

      return true
    })
  }

  public login(credentials: string, backend: string): Promise<boolean> {
    return this.fetch('/api/user/login/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        credentials: credentials,
        authentication_backend: backend
      })
    }).then((response) => {
      if (!response || response.status !== 202) {
        this.handle_logout()

        return false
      } else {
        this.handle_login()

        return true
      }
    })
  }

  private handle_login(): void {
    this._is_authenticated = true
    localStorage.setItem('authenticated', String(true))
  }

  private handle_logout(): void {
    this._is_authenticated = false
    localStorage.setItem('authenticated', '')
  }
}
