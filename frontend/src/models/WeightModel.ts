import { ref } from 'vue'
import { Model } from '@/models/Model'
import type { UserModel } from '@/models/UserModel'

export class WeightModel extends Model {
  user_model: ref<UserModel>
  weights: ref<Array<object>> = ref([])

  constructor(user_model: ref<UserModel>) {
    super()

    this.user_model = user_model
  }

  get(): void {
    fetch(this.apiUrl('api/user/weights/'), { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        this.weights.value = data
      })
      .catch((error) => {
        this.set_errors(error, 'critical')
      })
  }

  delete(weight_id: number): void {
    console.log('DELETE  ' + weight_id)
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
          this.set_errors(data)
          isAddEditModalOpened.value = true
        }
      })
      .catch((error) => {
        this.set_errors(error, 'critical')
        isAddEditModalOpened.value = false
      })
  }
}
