<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/helper/dates'
import AddEditWeightModal from '@/components/AddEditWeightModal.vue'
import DeleteWeightModal from '@/components/DeleteWeightModal.vue'
import { WeightType } from '@/types/types.d.ts'
import type { WeightModel } from '@/models/WeightModel'
import type { UserModel } from '@/models/UserModel'

const store = useStore()
const { userModel, weightModel } = storeToRefs(store)

const page: ref<number> = ref(1)
const paging_limit: number = 20
const isAddEditModalOpened = ref(false)
const isDeleteModalOpened = ref(false)
const selectedWeight: ref<object> = ref({})
const modalAction: ref<string> = ref('')
const wm: WeightModel = weightModel.value
const user: UserModel = userModel.value

watch([wm], () => {
  page.value = 1
})

const addEditDeleteWeight = (action?: string, weight?: WeightType, e?: SubmitEvent): void => {
  wm.errors([])

  selectedWeight.value = weight ?? {}
  modalAction.value = action ?? ''

  if (action && e) {
    if (action == 'add' || action == 'edit') {
      wm.save(
        action,
        selectedWeight?.value ?? null,
        e.target.elements.date.value,
        e.target.elements.weight_kg.value,
        isAddEditModalOpened
      )
    } else if (action == 'delete') {
      wm.delete(selectedWeight?.value, isDeleteModalOpened)
    }
  } else {
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
  if (wm.weights) {
    return Math.ceil(wm.weights.length / paging_limit)
  }
  return 0
})

const weights_history = computed<Array<WeightType>>(() => {
  if (wm.weights) {
    return wm.weights.slice((page.value - 1) * paging_limit, page.value * paging_limit)
  }
  return []
})

const paginate = (next_page): void => {
  page.value = next_page
}

const changeClass = (change): string => {
  if (change == '-') return 'text-end'

  if (change > 0) return 'table-danger text-end'

  let permittedChange = user.target_weight_loss_percentage_per_week * -1

  if (wm.frequency() == 'Daily') {
    permittedChange = permittedChange / 7
  } else if (wm.frequency() == 'Monthly') {
    permittedChange = (permittedChange * 52) / 12
  }
  if (wm.frequency() == 'Yearly') {
    permittedChange = permittedChange * 52
  }

  if (change <= 0 && change > permittedChange) return 'table-success text-end'

  return 'table-success-minor text-end'
}
</script>

<template>
  <DeleteWeightModal
    :isOpen="isDeleteModalOpened"
    :errors="wm.errors()"
    :weight="selectedWeight"
    @deleteWeight="addEditDeleteWeight"
    @modalClose="addEditDeleteWeight"
  />
  <AddEditWeightModal
    :isOpen="isAddEditModalOpened"
    :errors="wm.errors()"
    :weight="selectedWeight"
    :modalAction="modalAction"
    @addEditDeleteWeight="addEditDeleteWeight"
    @modalClose="addEditDeleteWeight"
  />
  <div class="weight_history_container">
    <header>
      {{ wm.frequency() }} History
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
          <th>Date{{ wm.frequency().toLowerCase() === 'weekly' ? '(w/c)' : '' }}</th>
          <th>Weight(kg)</th>
          <th>Change(%)</th>
          <th>Change(kg)</th>
          <th class="text-center">-</th>
        </tr>
      </thead>
      <tbody v-if="weights_history">
        <tr v-for="weight in weights_history" :key="weight.id">
          <td style="width: 42%; font-size: 0.99em">
            {{ formatDate(weight.date, wm.frequency()) }}
          </td>
          <td class="text-end" style="width: 8%">
            {{ weight.weight_kg }}
          </td>
          <td :class="changeClass(weight.previous_weight_change_percentage)" style="width: 7%">
            {{ weight.previous_weight_change_percentage }}
          </td>
          <td :class="changeClass(weight.previous_weight_change_percentage)" style="width: 7%">
            {{ weight.previous_weight_change_kg }}
          </td>
          <td class="text-center" style="width: 17%">
            <span class="action">
              <font-awesome-icon
                icon="fa-solid fa-pen-to-square"
                title="edit weight"
                :class="!weight.id ? 'disabled_icon' : ''"
                @click="weight.id && addEditDeleteWeight('edit', weight)"
              />
            </span>
            <span class="action">
              <font-awesome-icon
                icon="fa-solid fa-trash"
                title="delete weight"
                :class="!weight.id ? 'disabled_icon' : ''"
                @click="weight.id && addEditDeleteWeight('delete', weight)"
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
        Previous&raquo;&raquo;
      </p>
      <p v-else class="float-end navigation_link_disabled">Previous&raquo;&raquo;</p>
      <p v-if="page > 1" class="navigation_link" @click="paginate(page - 1)">&laquo;&laquo;Next</p>
      <p v-else class="navigation_link_disabled">&laquo;&laquo;Next</p>
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
.disabled_icon {
  color: #b1b1b1;
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
