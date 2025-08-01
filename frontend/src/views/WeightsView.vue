<script setup lang="ts">
import WeightStats from '../components/WeightStats.vue'
import WeightGraph from '../components/WeightGraph.vue'
import WeightHistory from '../components/WeightHistory.vue'
import { onBeforeMount } from 'vue'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { userModel, weightModel } = storeToRefs(store)

onBeforeMount(() => {
  if (userModel.value.isAuthenticated()) {
    if (!userModel.value.dataFetched()) {
      userModel.value.get()
    }
    if (!weightModel.value.dataFetched()) {
      weightModel.value.get()
    }
  }
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
