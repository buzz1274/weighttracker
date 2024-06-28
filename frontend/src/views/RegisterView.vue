<script setup lang="ts">
import router from '../router/'
import { ref } from 'vue'

const error = ref('')

const cancel_registration = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('registered')

  router.push('/')
}
</script>

<template>
  <main class="full_screen">
    <form class="w-100 p-3">
      <div class="form-group-lg mb-3">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email" disabled="disabled" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="date_of_birth">Date of Birth</label>
        <input type="text" class="form-control" id="date_of_birth" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="sex">Sex</label>
        <input type="text" class="form-control" id="sex" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="height_cm">Height(cm)</label>
        <input type="text" class="form-control" id="height_cm" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="weight_kg">Weight(kg)</label>
        <input type="text" class="form-control" id="weight_kg" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="target_weight_kg">Target Weight(kg)</label>
        <input type="text" class="form-control" id="target_weight_kg" />
      </div>
      <div class="home_buttons">
        <button type="button" class="btn btn-secondary" @click="cancel_registration">Cancel</button>
        <button type="button" class="btn btn-dark">Register</button>
      </div>
    </form>
    <div v-if="error">An error occurred</div>
  </main>
</template>

<style>
label {
  font-weight: bold;
}
</style>
