import { Model } from '@/models/Model'

export class UserModel extends Model {
  name: string
  logged_in: boolean
  access_token: string
  refresh_token: string
  registered: boolean
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

  constructor() {
    super()
  }

  get(): void {
    fetch(this.apiUrl('/api/user/'), { method: 'GET' })
      .then((response) => response.json())
      .then((data) => this.hydrate(data))
      .catch((error) => this.errors(error))
  }
}
