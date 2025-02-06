<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import ErrorModalComponent from '@/components/base/ErrorModalComponent.vue'
import { ref } from 'vue'

const store = useStore()
const { user_model } = storeToRefs(store)
const user = user_model.value
const isErrorModalOpen = ref(false)

console.log(user.get_errors('critical'))

const modalClose = () => {
  isErrorModalOpen.value = false
}
</script>

<template>
  <ErrorModalComponent :isOpen="isErrorModalOpen" @modalClose="modalClose" />
  <header>
    <RouterLink to="/">
      <h1>WeightTracker</h1>
    </RouterLink>
    <nav v-if="user.name">
      <div>
        <table style="float: right">
          <tr>
            <td>
              Welcome back, {{ user.name }}
              &nbsp;|&nbsp;
              <font-awesome-icon
                class="icon"
                style="padding-top: 2px"
                title="edit user"
                icon="fa-solid fa-pen-to-square"
              />
              &nbsp;|&nbsp;
            </td>
            <td>
              <font-awesome-icon
                class="icon"
                style="padding-top: 2px"
                title="sign out"
                icon="fa-solid fa-sign-out"
              />
            </td>
          </tr>
        </table>
      </div>
    </nav>
  </header>
  <div class="main">
    <RouterView />
  </div>
  <footer>
    &copy; zz50.co.uk
    <div class="version">weighttracker v0.1</div>
  </footer>
</template>

<style scoped>
header {
  top: 0;
  width: 100%;
  height: 80px;
  background-color: #000;
  line-height: 1.5;
  display: flex;
  padding: 0 1em 0 1em;
  color: #fff;
}
nav {
  float: right;
  text-align: right;
  margin-left: auto;
  order: 2;
  font-size: 0.85rem;
  padding-top: 0.5em;
}
.icon {
  cursor: pointer;
}
a {
  color: #fff;
  text-decoration: none;
  padding-top: 1em;
}
.main {
  min-height: 950px;
}
footer {
  width: 100%;
  height: 28px;
  display: flex;
  place-items: center;
  font-weight: bold;
  font-size: 0.75em;
  padding: 0 1em 0 1em;
  background-color: #000;
  color: #fff;
}
.version {
  float: right;
  text-align: left;
  margin-left: auto;
  order: 2;
  font-weight: bold;
  padding: 0 1em 0 1em;
}
</style>
