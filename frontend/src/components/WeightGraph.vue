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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Legend)

const { loaded, weights_weights, weights_labels, user } = storeToRefs(useStore())
const labels = computed(() => {
  return weights_labels.value.slice(0).reverse()
})
const data = computed(() => {
  return weights_weights.value.slice(0).reverse()
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
        data: new Array(weights_weights.value.length).fill(user.value.max_weight_kg)
      },
      {
        label: 'Obese',
        pointStyle: 'line',
        borderColor: 'rgba(220, 53, 69, 0.0)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        fill: '-1',
        order: 1,
        data: new Array(weights_weights.value.length).fill(user.value.bmi_boundaries.obese)
      },
      {
        label: 'remove',
        pointStyle: 'line',
        borderColor: 'rgba(243, 171, 133, 0.0)',
        backgroundColor: 'rgba(243, 171, 133, 0.3)',
        fill: '-1',
        order: 1,
        data: new Array(weights_weights.value.length).fill(user.value.bmi_boundaries.obese)
      },
      {
        label: 'Overweight',
        pointStyle: 'line',
        borderColor: 'rgba(243, 171, 133, 0.0)',
        backgroundColor: 'rgba(243, 171, 133, 0.3)',
        fill: '-2',
        order: 1,
        data: new Array(weights_weights.value.length).fill(user.value.bmi_boundaries.overweight)
      },
      {
        label: 'Normal',
        pointStyle: 'line',
        borderColor: 'rgba(155, 238, 105, 0.0)',
        backgroundColor: 'rgba(155, 238, 105, 0.3)',
        fill: false,
        order: 1,
        data: new Array(weights_weights.value.length).fill(user.value.bmi_boundaries.normal)
      },
      {
        label: 'remove',
        pointStyle: 'line',
        borderColor: 'rgba(155, 238, 105, 0.0)',
        backgroundColor: 'rgba(155, 238, 105, 0.3)',
        fill: '-1',
        order: 1,
        data: new Array(weights_weights.value.length).fill(user.value.bmi_boundaries.overweight)
      },
      {
        label: 'Current Weigh',
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
        data: new Array(weights_weights.value.length).fill(user.value.average_weight_kg)
      },
      {
        label: 'Target Weight',
        borderColor: 'rgba(10, 149, 6, 1)',
        backgroundColor: 'rgba(10, 149, 6, 1)',
        pointStyle: 'line',
        borderWidth: '1',
        data: new Array(weights_weights.value.length).fill(user.value.target_weight_kg)
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
  <div v-if="loaded" class="graph_container">
    <header>Graph</header>

    <div class="graph">
      <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<style scoped>
.graph_container {
  width: 868px;
  height: 700px;
  order: 2;
}
.graph {
  margin-top: 75px;
  height: 100%;
}
</style>
