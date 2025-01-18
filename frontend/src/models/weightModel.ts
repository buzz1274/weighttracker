import { ref } from 'vue'

export class weightModel {
  weights = ref([])
  loaded = null
  //weight_values = ref([])
  //weight_dates = ref([])

  constructor() {
    this.loaded = ref(false)
  }

  wee() {
    return this.weights
  }

  lo() {
    return this.loaded
  }

  get(): void {
    console.log('FETCH')
    fetch('https://' + window.location.hostname + '/api/user/weights/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        console.log('FULFILLED')
        console.log(data)
        this.weights.value = data
        this.loaded = ref(true)
      })
      .then(() => {
        //this.extract_values_and_dates()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  extract_values_and_dates() {
    console.log('EXTRACT')

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
