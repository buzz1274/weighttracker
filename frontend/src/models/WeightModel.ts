import { ref } from 'vue'
import { Model } from '@/models/Model'
import type { UserModel } from '@/models/UserModel'

export type WeightType = {
  id: number
  date: string
  weight_kg: number
  previous_weight_change_kg: number
  previous_weight_change_percentage: number
}

export class WeightModel extends Model {
  user_model: ref<UserModel>
  weights: Array<WeightType>
  frequency: string = 'Daily'

  constructor(user_model: ref<UserModel>) {
    super()

    this.user_model = user_model
  }

  get(): void {
    let url: string = 'api/user/weights/'

    if (this.frequency !== 'Daily') {
      url += 'aggregate/?frequency=' + this.frequency.toLowerCase()
    }

    fetch(this.apiUrl(url), { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        this.hydrate({ weights: data })
        this.weights = this.weights.reverse()
      })
      .catch((error) => this.setErrors(error, 'critical'))
  }

  delete(weight: WeightType, isDeleteModalOpened: ref<boolean>): void {
    fetch(this.apiUrl('api/user/weights/' + weight.id), {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken')
      }
    })
      .then((response) => {
        if (response.status == 204) {
          this.get()
          this.user_model.get()
          isDeleteModalOpened.value = false
        } else {
          this.setErrors({ error: 'Invalid weight' })
          isDeleteModalOpened.value = true
        }
      })
      .catch((error) => this.setErrors(error, 'critical'))
  }

  save(
    action: string,
    weight: WeightType | null,
    date: string,
    weight_kg: number,
    isAddEditModalOpened: ref<boolean>
  ): void {
    let response_status: number

    fetch(this.apiUrl('api/user/weights/' + (action == 'add' ? '' : weight?.id)), {
      method: action == 'add' ? 'POST' : 'PUT',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        weight_id: weight?.id,
        weight_kg: weight_kg,
        date: date
      })
    })
      .then((response) => {
        response_status = response.status

        return response.json()
      })
      .then((data) => {
        if (response_status == 200 || response_status == 201) {
          this.get()
          this.user_model.get()
          isAddEditModalOpened.value = false
        } else if (response_status == 400) {
          this.setErrors(data)
          isAddEditModalOpened.value = true
        } else {
          throw new Error(data['detail'])
        }
      })
      .catch((error) => {
        this.setErrors(error, 'critical')
        isAddEditModalOpened.value = false
      })
  }
}
