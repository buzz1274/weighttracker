export type Error = {
  key?: string | number
  error: string
}

export type Notification = {
  type: string
  message: string
}

export type WeightType = {
  id: number
  date: string
  weight_kg: number
  previous_weight_change_kg: number
  previous_weight_change_percentage: number
}

export type UserSave = {
  sex?: string
  height_m?: string
  starting_weight_kg?: string
  weight_loss_start_date?: string
  target_weight_kg?: string
  intermediate_loss_target_kg?: string
  weight_loss_at_date?: string
  target_weight_loss_percentage_per_week?: string
}
