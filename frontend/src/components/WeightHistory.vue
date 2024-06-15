<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores/store'
import moment from 'moment'
import { storeToRefs } from 'pinia'

const store = useStore()
const { weights } = storeToRefs(store)
const page = ref(1)
const paging_limit = 20

const weights_history = computed(() => {
  return weights.value.slice((page.value - 1) * paging_limit, page.value * paging_limit)
})

const add_weight = () => {
  console.log('ADD WEIGHT')
}

const delete_weight = (id) => {
  console.log('DELETE WEIGHT ' + id)
}

const edit_weight = (id) => {
  console.log('EDIT WEIGHT ' + id)
}

const total_pages = computed(() => {
  return Math.ceil(weights.value.length / paging_limit)
})

const paginate = (next_page) => {
  page.value = next_page
}

const changeClass = (change) => {
  return (
    (change == '-' ? '' : change <= 0 ? 'table-success text-success' : 'table-danger text-danger') +
    ' text-end fw-bold'
  )
}
</script>

<template>
  <div class="weight_history_container">
    <header>
      History
      <span class="float-end add_weight">
        <font-awesome-icon icon="fa-solid fa-plus" @click="add_weight()" />
      </span>
    </header>
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight(kg)</th>
          <th>Change(kg)</th>
          <th class="text-center">-</th>
        </tr>
      </thead>
      <tbody v-if="weights_history">
        <tr v-for="weight in weights_history" :key="weight.id">
          <td style="width: 45%">
            {{ moment(weight.date).format('MMMM Do, YYYY') }}
          </td>
          <td class="text-end" style="width: 10%">
            {{ weight.weight_kg }}
          </td>
          <td :class="changeClass(weight.week_weight_change_kg)" style="width: 10%">
            {{ weight.week_weight_change_kg }}
          </td>
          <td class="text-center">
            <span class="action">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" @click="edit_weight(weight.id)" />
            </span>
            <span class="action">
              <font-awesome-icon icon="fa-solid fa-trash" @click="delete_weight(weight.id)" />
            </span>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4" class="text-center">Loading...</td>
        </tr>
      </tbody>
    </table>
    <div v-if="weights_history" class="history_navigation">
      <p v-if="page < total_pages" class="float-end navigation_link" @click="paginate(page + 1)">
        Next&raquo;&raquo;
      </p>
      <p v-else class="float-end navigation_link_disabled">Next&raquo;&raquo;</p>
      <p v-if="page > 1" class="navigation_link" @click="paginate(page - 1)">
        &laquo;&laquo;Previous
      </p>
      <p v-else class="navigation_link_disabled">&laquo;&laquo;Previous</p>
    </div>
  </div>
</template>

<style scoped>
font-awesome-icon {
  margin: 0;
  padding: 0;
}
.weight_history_container {
  order: 2;
}
.history_navigation {
  width: 70%;
  margin: 0 auto;
}
table {
  font-size: 0.75em;
  line-height: 15px;
  margin-bottom: 10px;
}
.add_weight {
  margin-right: 20px;
  cursor: pointer;
}
th {
  font-weight: bold;
}
th:first-child {
  padding-left: 0.8em;
}
td:first-child {
  padding-left: 0.8em;
}
span.action {
  margin-right: 5px;
  cursor: pointer;
}
p {
  font-size: 0.75em;
  font-weight: bold;
  margin: 0;
  padding: 0;
}
p.navigation_link_disabled {
  color: #b6b8ba;
}
p.navigation_link {
  cursor: pointer;
}
</style>
