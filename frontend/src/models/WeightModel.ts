import { ref } from 'vue'
import { Model } from '@/models/Model'

export class weightModel extends Model {
  weights = ref([])
  errors = ref([])

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
        console.log(error)
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
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.status == 400) {
          this.errors.value = data.response
        }

        this.errors.value = data.response

        console.log('HERE')
        console.log(data)
        //add weight to weights store
      })
      .catch((error) => {
        console.log('HERP DERP')
        //console.log(error['weight_kg']['weight_kg'])
        this.errors.value = error
        console.log('ERROR CAUGHT')
      })
  }

  extract_values_and_dates() {
    this.weight_values.value = this.weights.value.reduce((weights, weight) => {
      weights.push(weight['weight_kg'])
      return weights
    }, [])

    this.weight_dates.value = this.weights.value.reduce((dates, weight) => {
      dates.push(weight['date'])
      return dates
    }, [])

    console.log(this.weight_dates)
  }
}
