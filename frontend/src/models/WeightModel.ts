import { ref } from 'vue'
import { Model } from '@/models/Model'
import type { UserModel } from '@/models/UserModel'
import type { WeightType } from '@/types/types.d.ts'

export class WeightModel extends Model {
  user_model: ref<UserModel>
  weights: Array<WeightType>
  protected _frequency: string = 'Daily'

  constructor(user_model: ref<UserModel>) {
    super()

    this.user_model = user_model
  }

  public setFrequency(frequency: string): void {
    this._frequency = frequency
  }

  public frequency(): string {
    return this._frequency
  }

  public get(): void {
    let url: string = 'api/user/weights/'

    if (this._frequency !== 'Daily') {
      url += 'aggregate/?frequency=' + this.frequency().toLowerCase()
    }

    this.fetch(url, { method: 'GET' })
      .then((response) => {
        return response ? response.json() : null
      })
      .then((data) => {
        this.hydrate({ weights: data })
        this.weights = this.weights.reverse()
      })
      .catch((error) => {
        error.message && this.notification(error.message)
      })
  }

  public delete(weight: WeightType, isDeleteModalOpened: ref<boolean>): void {
    this.fetch('api/user/weights/' + weight.id, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken')
      }
    })
      .then((response) => {
        if (!response) throw new Error()

        if (response.status == 204) {
          this.get()
          this.user_model.get()

          this.notification({
            message: 'Weight Deleted',
            type: 'success'
          })

          isDeleteModalOpened.value = false
        } else {
          this.errors([{ error: 'Invalid weight' }])

          isDeleteModalOpened.value = true
        }
      })
      .catch((error) => {
        error.message && this.notification(error.message)
      })
  }

  public save(
    action: string,
    weight: WeightType | null,
    date: string,
    weight_kg: number,
    isAddEditModalOpened: ref<boolean>
  ): void {
    let response_status: number

    this.fetch('api/user/weights/' + (action == 'add' ? '' : weight?.id), {
      method: action == 'add' ? 'POST' : 'PUT',
      headers: {
        'X-CSRFToken': this.getCookie('csrftoken'),
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: weight?.id,
        weight_kg: weight_kg,
        date: date
      })
    })
      .then((response) => {
        if (!response) throw new Error()

        response_status = response.status

        return response.json()
      })
      .then((data) => {
        if (response_status == 200 || response_status == 201) {
          this.get()
          this.user_model.get()

          this.notification({
            message: action == 'add' ? 'Weight Added' : 'Weight Edited',
            type: 'success'
          })

          isAddEditModalOpened.value = false
        } else if (response_status == 400) {
          this.errors(data)
          isAddEditModalOpened.value = true
        } else {
          throw new Error(data['detail'])
        }
      })
      .catch((error) => {
        if (error.message) {
          this.notification({
            message: error,
            type: 'error'
          })
          isAddEditModalOpened.value = false
        }
      })
  }
}
