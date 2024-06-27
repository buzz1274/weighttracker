<script setup lang="ts">
import router from '../router/'

function cancel_registration() {
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
        <label for="exampleInputPassword1">Date of Birth</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Name" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="exampleInputPassword1">Sex</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Name" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="exampleInputPassword1">Height(cm)</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Name" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="exampleInputPassword1">Weight(kg)</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Name" />
      </div>
      <div class="form-group-lg mb-3">
        <label for="exampleInputPassword1">Target Weight(kg)</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Name" />
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
