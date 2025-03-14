import { ref } from 'vue'
import { Model } from '@/models/Model'
import type { UserModel } from '@/models/UserModel'

export class WeightModel extends Model {
  user_model: ref<UserModel>
  weights: Array<object>

  constructor(user_model: ref<UserModel>) {
    super()

    this.user_model = user_model
  }

  get(): void {
    fetch(this.apiUrl('api/user/weights/'), { method: 'GET' })
      .then((response) => response.json())
      .then((data) => this.hydrate({ weights: data }))
      .catch((error) => this.setErrors(error, 'critical'))
  }

  delete(weightId: number, isDeleteModalOpened: ref<boolean>): void {
    fetch(this.apiUrl('api/user/weights/' + weightId), {
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

  add(date: string, weight_kg: number, isAddEditModalOpened: ref<boolean>): void {
    let response_status: number

    fetch(this.apiUrl('api/user/weights/'), {
      method: 'POST',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
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
        } else {
          this.setErrors(data)
          isAddEditModalOpened.value = true
        }
      })
      .catch((error) => {
        this.setErrors(error, 'critical')
        isAddEditModalOpened.value = false
      })
  }
}
