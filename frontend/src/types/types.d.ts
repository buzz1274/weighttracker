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
