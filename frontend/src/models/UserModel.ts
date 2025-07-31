import { Model } from '@/models/Model'

export class UserModel extends Model {
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
  is_authenticated: boolean

  constructor() {
    super()

    if (localStorage.getItem('authenticated') === 'true') {
      this.get()
      this.is_authenticated = true
    }
  }

  get(): void {
    fetch(this.apiUrl('/api/user/'), { method: 'GET' })
      .then((response) => response.json())
      .then((data) => this.hydrate(data))
      .catch((error) => this.errors(error))
  }

  logout(): void {
    this.is_authenticated = false
    localStorage.setItem('authenticated', '')
  }

  login(credentials: string, backend: string): Promise<boolean> {
    return fetch('https://' + window.location.hostname + '/api/user/login/', {
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
      if (response.status === 202) {
        this.get()

        this.is_authenticated = true
        localStorage.setItem('authenticated', String(true))

        return true
      } else {
        this.is_authenticated = false
        localStorage.setItem('authenticated', '')

        return false
      }
    })
  }
}
