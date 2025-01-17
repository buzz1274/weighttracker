import { ref } from 'vue'

export class weightModel {
  loaded = ref()
  weights = ref([])
  weight_values = ref([])
  weight_dates = ref([])

  get(): void {
    console.log('FETCH')
    fetch('https://' + window.location.hostname + '/api/user/weights/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        this.weights.value = data
        //this.loaded.value = true
      })
      .then(() => {
        this.extract_values_and_dates()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  extract_values_and_dates() {
    console.log('EXTRACT')

    this.weight_values.value = this.weights.reduce((weights, weight) => {
      weights.push(weight['weight_kg'])
      return weights
    }, [])

    this.weight_dates.value = this.weights.reduce((dates, weight) => {
      dates.push(weight['date'])
      return dates
    }, [])

    console.log(this.weight_dates)
  }
}
