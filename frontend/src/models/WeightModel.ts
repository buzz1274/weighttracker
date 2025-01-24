import { ref } from 'vue'
import { Model } from '@/models/Model'

export class WeightModel extends Model {
  weights = ref([])
  status = null

  constructor() {
    super()
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
        } else {
          console.log(response_status)
          console.log(data)
          //log error
        }
      })
      .catch((error) => {
        console.log(error)
        //this.api_errors.value = error
      })
  }
}
