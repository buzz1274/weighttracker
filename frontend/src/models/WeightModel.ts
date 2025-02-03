import { ref } from 'vue'
import { Model } from '@/models/Model'
import type { UserModel } from '@/models/UserModel'

export class WeightModel extends Model {
  user_model: UserModel
  weights = ref([])
  status = null

  constructor(user_model: UserModel) {
    super()

    this.user_model = user_model
  }

  get(): void {
    fetch(this.api_url('api/user/weights/'), { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        this.weights.value = data
      })
      .catch((error) => {
        console.log(error)
        //this.errors = error
      })
  }

  add(date: string, weight_kg: number): void {
    let response_status = null

    fetch(this.api_url('api/user/weights/'), {
      method: 'POST',
      headers: {
        'X-CSRFToken': this.get_cookie('csrftoken'),
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
        } else {
          console.log(response_status)
          console.log(data)
          //log error
        }
      })
      .catch((error) => {
        console.log('ERROR')
        console.log(error)
        //this.api_errors.value = error
      })
  }
}
