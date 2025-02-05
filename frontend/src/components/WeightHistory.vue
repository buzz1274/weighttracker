<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores/store'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import AddEditWeightModal from '@/components/AddEditWeightModal.vue'

const store = useStore()
const { user_model, weight_model } = storeToRefs(store)

const page = ref(1)
const paging_limit = 20
const isModalOpened = ref(false)
const wm = weight_model.value
const user = user_model.value

const weights_history = computed(() => {
  if (wm.weights.value) {
    return wm.weights.value.slice((page.value - 1) * paging_limit, page.value * paging_limit)
  }
  return []
})

const addWeight = (e = null): void => {
  if (!e) {
    toggleModal()
  } else {
    wm.add(e.target.elements.date.value, e.target.elements.weight_kg.value)

    if (!wm.errors) {
      toggleModal()
    }
  }
}

const delete_weight = (id: number): void => {
  console.log('DELETE WEIGHT ' + id)
}

const edit_weight = (id): void => {
  console.log('EDIT WEIGHT ' + id)
}

const totalPages = computed((): number => {
  if (wm.weights.value) {
    return Math.ceil(wm.weights.value.length / paging_limit)
  }
  return 0
})

const toggleModal = (): void => {
  if (isModalOpened.value) {
    wm.reset_errors()
  }

  isModalOpened.value = !isModalOpened.value
}

const paginate = (next_page): void => {
  page.value = next_page
}

const changeClass = (change): string => {
  if (change == '-') return 'text-end'

  if (change > 0) return 'table-danger text-end'

  if (change < 0 && change > user.target_weight_loss_percentage_per_week * -1)
    return 'table-success text-end'

  return 'table-success-minor text-end'
}
</script>

<template>
  <AddEditWeightModal
    :isOpen="isModalOpened"
    :errors="wm.errors"
    @addWeight="addWeight"
    @modalClose="toggleModal"
  />
  <div class="weight_history_container">
    <header>
      History
      <span class="float-end add_weight">
        <font-awesome-icon icon="fa-solid fa-plus" @click="addWeight()" />
      </span>
    </header>
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight(kg)</th>
          <th>Change(%)</th>
          <th>Change(kg)</th>
          <th class="text-center">-</th>
        </tr>
      </thead>
      <tbody v-if="weights_history">
        <tr v-for="weight in weights_history" :key="weight.id">
          <td style="width: 40%">
            {{ moment(weight.date).format('MMM Do, YYYY') }}
          </td>
          <td class="text-end" style="width: 8%">
            {{ weight.weight_kg }}
          </td>
          <td :class="changeClass(weight.week_weight_change_percentage)" style="width: 8%">
            {{ weight.week_weight_change_percentage }}
          </td>
          <td :class="changeClass(weight.week_weight_change_percentage)" style="width: 8%">
            {{ weight.week_weight_change_kg }}
          </td>
          <td class="text-center" style="width: 15%">
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
      <p v-if="page < totalPages" class="float-end navigation_link" @click="paginate(page + 1)">
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
.form-label {
  font-weight: normal;
  font-size: smaller;
}
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
.table-success-minor {
  background-color: #17b169;
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
