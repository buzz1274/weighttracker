<script setup lang="ts">
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import moment from 'moment'

const { userModel } = storeToRefs(useStore())
const user = userModel.value

const weightToTarget = computed(() => {
  return (user.current_weight_kg - user.target_weight_kg).toFixed(2)
})

const totalWeightLost = computed(() => {
  return (user.current_weight_kg - user.max_weight_kg).toFixed(2)
})

const showNextTargetDate = computed(() => {
  return user.next_intermediate_target_date != '-' && user.next_intermediate_target_kg != '-'
})

const changeClass = (change) => {
  return change == '-' ? '' : change < 0 ? 'text-success' : 'text-danger'
}
</script>

<template>
  <div class="stats_container">
    <header>
      Stats&nbsp;
      <p>(from {{ moment(user.weight_loss_start_date).format('MMMM Do, YYYY') }})</p>
    </header>
    <table class="table table-sm table-hover">
      <tbody>
        <tr>
          <td>Start weight(kg)</td>
          <td class="stats text-end">{{ user.starting_weight_kg }}</td>
        </tr>
        <tr>
          <td>Current weight(kg)</td>
          <td class="stats text-end">{{ user.current_weight_kg }}</td>
        </tr>
        <tr>
          <td>Highest weight(kg)</td>
          <td class="stats text-end">{{ user.max_weight_kg }}</td>
        </tr>
        <tr>
          <td>Lowest weight(kg)</td>
          <td class="stats text-end">{{ user.min_weight_kg }}</td>
        </tr>
        <tr>
          <td style="line-height: 20px">
            Average weight(kg)<br />
            (from {{ moment(user.date_joined).format('MMMM Do, YYYY') }})
          </td>
          <td class="stats text-end" style="vertical-align: middle">
            {{ user.average_weight_kg }}
          </td>
        </tr>
        <tr>
          <td>Target weight(kg)</td>
          <td class="stats text-end">{{ user.target_weight_kg }}</td>
        </tr>
        <tr>
          <td>Target hit date(approx)</td>
          <td class="stats text-end">
            {{ user.target_hit_date ? moment(user.target_hit_date).format('MMMM Do, YYYY') : '-' }}
          </td>
        </tr>
        <tr v-if="showNextTargetDate">
          <td style="line-height: 20px">
            Intermediate({{ user.next_intermediate_target_kg }}kg) target<br />
            hit date(approx)
          </td>
          <td class="stats text-end" style="vertical-align: middle">
            {{ moment(user.next_intermediate_target_date).format('MMMM Do, YYYY') }}
          </td>
        </tr>
        <tr>
          <td>Weight to target(kg)</td>
          <td class="stats text-end">{{ weightToTarget }}</td>
        </tr>
        <tr>
          <td>Change last week(kg)</td>
          <td :class="changeClass(user.change_last_week_kg)" class="stats text-end">
            {{ user.change_last_week_kg }}
          </td>
        </tr>
        <tr>
          <td>Change last month(kg)</td>
          <td :class="changeClass(user.change_last_month_kg)" class="stats text-end">
            {{ user.change_last_month_kg }}
          </td>
        </tr>
        <tr>
          <td>Change last year(kg)</td>
          <td :class="changeClass(user.change_last_year_kg)" class="stats text-end">
            {{ user.change_last_year_kg }}
          </td>
        </tr>
        <tr>
          <td>Total weight lost(kg)</td>
          <td :class="changeClass(totalWeightLost)" class="stats text-end">
            {{ totalWeightLost }}({{ user.percentage_weight_lost_of_target }}%)
          </td>
        </tr>
        <tr>
          <td>BMI</td>
          <td class="stats text-end">{{ user.current_bmi }}</td>
        </tr>
        <tr>
          <td>Weekly target loss(%)</td>
          <td class="stats text-end">{{ user.target_weight_loss_percentage_per_week }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.stats_container {
  order: 1;
  margin-bottom: 10px;
}
table {
  font-size: 0.75em;
  line-height: 15px;
  margin-bottom: 10px;
}
td:first-child {
  padding-left: 0.8em;
  font-weight: bold;
}
td.stats {
  padding-right: 0.8em;
}
p {
  display: inline;
  color: #ffffff;
  font-size: 0.8em;
  font-weight: bold;
}
</style>
