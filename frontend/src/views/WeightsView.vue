<script setup lang="ts">
import WeightStats from '../components/WeightStats.vue'
import WeightGraph from '../components/WeightGraph.vue'
import WeightHistory from '../components/WeightHistory.vue'
import { onMounted } from 'vue'
import { use_weight_store } from '@/stores/weights'

const weight_store = use_weight_store()
const { get } = weight_store

onMounted(() => {
  get()
})
</script>

<template>
  <main>
    <nav>
      <WeightStats />
      <WeightHistory />
    </nav>
    <WeightGraph />
  </main>
</template>

<style>
nav {
  width: 380px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  order: 1;
  margin-right: 10px;
}
</style>
