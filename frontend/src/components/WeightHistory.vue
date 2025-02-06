<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores/store'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import AddEditWeightModal from '@/components/AddEditWeightModal.vue'
import DeleteWeightModal from '@/components/DeleteWeightModal.vue'

const store = useStore()
const { user_model, weight_model } = storeToRefs(store)

const page = ref(1)
const paging_limit = 20
const isAddEditModalOpened = ref(false)
const isDeleteModalOpened = ref(false)
const weightId = ref(NaN)
const wm = weight_model.value
const user = user_model.value
const modalAction = ref('')

const addEditDeleteWeight = (action?: string, id?: number, e?: SubmitEvent): void => {
  weightId.value = id
  modalAction.value = action

  console.log(id)
  console.log(e)
  console.log(action)
  console.log(modalAction.value)

  if (action && e) {
    if (action == 'add' || action == 'edit') {
      wm.add(e.target.elements.date.value, e.target.elements.weight_kg.value)
    } else if (action == 'delete') {
      wm.delete(id)
    }

    console.log('ON SUBMIT')
    console.log(wm.errors.value)

    if (!wm.errors.value) {
      isDeleteModalOpened.value = false
      isAddEditModalOpened.value = false
    }
  } else {
    console.log('ERRORS')
    console.log(wm.errors.value)

    if (!e && wm.errors.value) {
      wm.reset_errors()
    }

    if (!action) {
      isDeleteModalOpened.value = false
      isAddEditModalOpened.value = false
    } else if (action == 'add' || action == 'edit') {
      isAddEditModalOpened.value = true
    } else if (action == 'delete') {
      isDeleteModalOpened.value = true
    }
  }
}

const totalPages = computed((): number => {
  if (wm.weights.value) {
    return Math.ceil(wm.weights.value.length / paging_limit)
  }
  return 0
})

const weights_history = computed(() => {
  if (wm.weights.value) {
    return wm.weights.value.slice((page.value - 1) * paging_limit, page.value * paging_limit)
  }
  return []
})

const paginate = (next_page): void => {
  page.value = next_page
}

const changeClass = (change): string => {
  if (change == '-') return 'text-end'

  if (change > 0) return 'table-danger text-end'

  if (change <= 0 && change > user.target_weight_loss_percentage_per_week * -1)
    return 'table-success text-end'

  return 'table-success-minor text-end'
}
</script>

<template>
  <DeleteWeightModal
    :isOpen="isDeleteModalOpened"
    :errors="wm.errors"
    :weightId="weightId"
    @deleteWeight="addEditDeleteWeight"
    @modalClose="addEditDeleteWeight"
  />
  <AddEditWeightModal
    :isOpen="isAddEditModalOpened"
    :errors="wm.errors.value"
    :weightId="weightId"
    :modalAction="modalAction"
    @addEditDeleteWeight="addEditDeleteWeight"
    @modalClose="addEditDeleteWeight"
  />
  <div class="weight_history_container">
    <header>
      History
      <span class="float-end add_weight">
        <font-awesome-icon
          icon="fa-solid fa-plus"
          title="add weight"
          @click="addEditDeleteWeight('add')"
        />
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
              <font-awesome-icon
                icon="fa-solid fa-pen-to-square"
                title="edit weight"
                @click="addEditDeleteWeight('edit', weight.id)"
              />
            </span>
            <span class="action">
              <font-awesome-icon
                icon="fa-solid fa-trash"
                title="delete weight"
                @click="addEditDeleteWeight('delete', weight.id)"
              />
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
