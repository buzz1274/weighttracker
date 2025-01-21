import { ref } from 'vue'
import { Model } from '@/models/Model'

export class WeightModel extends Model {
  weights = ref([])

  constructor() {
    super()
  }

  get(): void {
    fetch(this.api_url('/api/user/weights/'), { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        this.weights.value = data
      })
      .catch((error) => {
        //this.errors = error
      })
  }

  add(date: string, weight_kg: number): void {
    fetch(this.api_url('/api/user/weights/'), {
      method: 'POST',
      body: JSON.stringify({
        weight_kg: weight_kg,
        date: date
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          this.get()
        } else {
          //this.errors = data.response
        }
      })
      .catch((error) => {
        //this.api_errors.value = error
      })
  }
}
