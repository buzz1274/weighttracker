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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Legend
)

const store = useStore()
const { loaded, weights_weights, weights_labels, } = storeToRefs(store)
const chartData = computed(() => {
  return ({
    labels: weights_labels.value,
    datasets: [
      {
        label: 'Current Weight',
        backgroundColor: '#000',
        borderColor: '#000',
        pointStyle: 'line',
        data: weights_weights.value,
      },
      {
        label: 'Target Weight',
        backgroundColor: '#0A9506FF',
        borderColor: '#0A9506FF',
        pointStyle: 'line',
        data: new Array(weights_weights.value.length).fill(81),
      },
      {
        label: 'Normal Weight',
        pointStyle: 'line',
        backgroundColor: '#eeeeee',
        borderColor: '#eeeeee',
        fill: false,
        data: new Array(weights_weights.value.length).fill(61.3)
      },
      {
        label: 'remove',
        pointStyle: 'line',
        borderColor: '#eeeeee',
        backgroundColor: '#eeeeee',
        fill: '-1',
        data: new Array(weights_weights.value.length).fill(82.8)
      },
    ]
  })
})
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        callback: function(value: number) {
          return value + 'kg';
        },
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
        filter: item => item.text !== 'remove'
      }
    }
  }
}
</script>

<template>
  <div v-if="loaded" class="graph_container">
    <header>Graph</header>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>

<style scoped>
.graph_container {
  width:868px;
  order:2;
  height:700px;
}
</style>
