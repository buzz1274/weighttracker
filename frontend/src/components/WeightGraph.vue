<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/store'
import {
  Chart as ChartJS,
  Title,
  Legend,
  LineElement,
  Filler,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import type { WeightModel } from '@/models/WeightModel'
import type { UserModel } from '@/models/UserModel'
import { formatDate } from '@/helper/dates'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Legend)

const { weightModel, userModel } = storeToRefs(useStore())
const wm: WeightModel = weightModel.value
const user = computed<UserModel>(() => {
  return userModel.value
})

const frequencyChange = (e?: SubmitEvent) => {
  wm.setFrequency(e.target.value)
  wm.get()
}

const labels = computed(() => {
  if (wm.weights) {
    return wm.weights
      .reduce((weights, weight) => {
        weights.push(formatDate(weight['date'], wm.frequency()))
        return weights
      }, [])
      .reverse()
  }
  return []
})

const data = computed(() => {
  if (wm.weights) {
    return wm.weights
      .reduce((weights, weight) => {
        weights.push(weight['weight_kg'])
        return weights
      }, [])
      .reverse()
  }
  return []
})

const chartData = computed(() => {
  return {
    labels: labels.value,
    datasets: [
      {
        label: 'remove',
        pointStyle: 'line',
        borderColor: 'rgba(220, 53, 69, 0.1)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: '1',
        order: 1,
        data: new Array(data.value.length).fill(
          Math.ceil(parseFloat(user.value.max_weight_kg_all_time) / 10) * 10
        )
      },
      {
        label: 'Obese',
        pointStyle: 'line',
        borderColor: 'rgba(220, 53, 69, 0.0)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: '-1',
        order: 1,
        data: new Array(data.value.length).fill(
          user.value.bmi_boundaries ? user.value.bmi_boundaries.obese : 0
        )
      },
      {
        label: 'remove',
        pointStyle: 'line',
        borderColor: 'rgba(243, 171, 133, 0.0)',
        backgroundColor: 'rgba(243, 171, 133, 0.3)',
        fill: '-1',
        order: 1,
        data: new Array(data.value.length).fill(
          user.value.bmi_boundaries ? user.value.bmi_boundaries.obese : 0
        )
      },
      {
        label: 'Overweight',
        pointStyle: 'line',
        borderColor: 'rgba(243, 171, 133, 0.0)',
        backgroundColor: 'rgba(243, 171, 133, 0.3)',
        fill: '-2',
        order: 1,
        data: new Array(data.value.length).fill(
          user.value.bmi_boundaries ? user.value.bmi_boundaries.overweight : 0
        )
      },
      {
        label: 'Normal',
        pointStyle: 'line',
        borderColor: 'rgba(155, 238, 105, 0.0)',
        backgroundColor: 'rgba(155, 238, 105, 0.3)',
        fill: false,
        order: 1,
        data: new Array(data.value.length).fill(
          user.value.bmi_boundaries
            ? Math.floor(parseFloat(user.value.bmi_boundaries.normal) / 10) * 10
            : 0
        )
      },
      {
        label: 'remove',
        pointStyle: 'line',
        borderColor: 'rgba(155, 238, 105, 0.0)',
        backgroundColor: 'rgba(155, 238, 105, 0.3)',
        fill: '-1',
        order: 1,
        data: new Array(data.value.length).fill(
          user.value.bmi_boundaries ? user.value.bmi_boundaries.overweight : 0
        )
      },
      {
        label: 'Current Weight',
        borderColor: 'rgba(0, 0, 0, 1)',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        pointStyle: false,
        borderWidth: '2',
        borderJoinStyle: 'round',
        tension: '1',
        data: data.value
      },
      {
        label: 'Average Weight',
        borderColor: 'rgba(128, 126, 126, 1)',
        backgroundColor: 'rgba(128, 126, 126, 1)',
        pointStyle: 'line',
        borderWidth: '1',
        data: new Array(data.value.length).fill(user.value.average_weight_kg)
      },
      {
        label: 'Target Weight',
        borderColor: 'rgba(10, 149, 6, 1)',
        backgroundColor: 'rgba(10, 149, 6, 1)',
        pointStyle: 'line',
        borderWidth: '1',
        data: new Array(data.value.length).fill(user.value.target_weight_kg)
      }
    ]
  }
})
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        callback: function (value: number) {
          return value + 'kg'
        }
      },
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        filter: (item) => item.text !== 'remove'
      }
    }
  }
}
</script>

<template>
  <div v-if="data" class="graph_container">
    <header>
      Graph
      <div id="frequency_select">
        <select id="frequency" @change="frequencyChange($event)">
          <option value="Daily" :selected="wm.frequency() == 'Daily'">Daily</option>
          <option value="Weekly" :selected="wm.frequency() == 'Weekly'">Weekly</option>
          <option value="Monthly" :selected="wm.frequency() == 'Monthly'">Monthly</option>
          <option value="Yearly" :selected="wm.frequency() == 'Yearly'">Yearly</option>
        </select>
      </div>
    </header>

    <div class="graph">
      <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<style scoped>
.graph_container {
  width: 868px;
  height: 900px;
  order: 2;
}
#frequency_select {
  float: right;
  padding-right: 5px;
}
.graph {
  margin-top: 70px;
  height: 100%;
}
</style>
