<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { UserModel } from '@/models/UserModel'
import { ref } from 'vue'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'

const store = useStore()
const { userModel } = storeToRefs(store)
const user: UserModel = userModel.value
const emit = defineEmits(['modalClose'])
const target = ref(null)

const saveUser = () => {
  console.log('saveUser')
}

onClickOutside(target, () => emit('modalClose'))
</script>

<template>
  <ModalComponent
    name="edit_user"
    :showCloseIcon="user.isRegistered()"
    @modalClose="emit('modalClose')"
  >
    <template #header>
      <span v-if="user.isRegistered()">Edit</span>
      <span v-else>Register</span>
    </template>
    <template #content>
      <form class="w-100 p-3">
        <div class="form-group-lg mb-3">
          <label for="email">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email"
            disabled="disabled"
            :value="user.email"
          />
        </div>
        <div class="form-group-lg mb-3">
          <label for="email">Name</label>
          <input
            type="email"
            class="form-control"
            id="email"
            disabled="disabled"
            :value="user.name"
          />
        </div>
        <div class="form-group-lg mb-3">
          <label for="sex">Sex</label>
          <select id="frequency" class="form-select">
            <option value="-">-</option>
            <option value="Male" :selected="user.sex === 'M'">Male</option>
            <option value="Female" :selected="user.sex == 'F'">Female</option>
          </select>
        </div>
        <div class="form-group-lg mb-3">
          <label for="height_m">Height(m)</label>
          <input
            type="number"
            step=".01"
            class="form-control"
            id="height_m"
            :value="user.height_m"
          />
        </div>
        <div class="form-group-lg mb-3">
          <label for="starting_weight_kg">Start Weight(kg)</label>
          <input
            type="number"
            step=".1"
            class="form-control"
            id="starting_weight_kg"
            :value="user.starting_weight_kg"
          />
        </div>
        <div class="form-group-lg mb-3">
          <label for="weight_loss_start_date">Weight Loss Start Date</label>
          <input
            type="date"
            class="form-control"
            id="weight_loss_start_date"
            :value="user.weight_loss_start_date"
          />
        </div>
        <div class="form-group-lg mb-3">
          <label for="target_weight_kg">Target Weight(kg)</label>
          <input
            type="number"
            step=".1"
            class="form-control"
            id="target_weight_kg"
            :value="user.target_weight_kg"
          />
        </div>
        <div class="form-group-lg mb-3">
          <label for="intermediate_loss_target_kg">Intermediate Step(kg)</label>
          <input
            type="number"
            step=".1"
            class="form-control"
            id="intermediate_loss_target_kg"
            :value="user.intermediate_loss_target_kg"
          />
        </div>
        <div class="form-group-lg mb-3">
          <label for="starting_weight_kg">Weight at Date</label>
          <input
            type="date"
            class="form-control"
            id="weight_loss_at_date"
            :value="user.weight_loss_at_date"
          />
        </div>

        <div class="form-group-lg mb-3">
          <label for="target_weight_loss_percentage_per_week">
            Target Weight Loss Percentage Per Week(%)
          </label>
          <input
            type="number"
            step=".001"
            class="form-control"
            id="target_weight_loss_percentage_per_week"
            :value="user.target_weight_loss_percentage_per_week"
          />
        </div>
        <div class="home_buttons">
          <button
            v-if="user.isRegistered()"
            type="button"
            class="btn btn-secondary"
            @click="emit('modalClose')"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-primary" @click="saveUser">
            <span v-if="user.isRegistered()">Edit</span>
            <span v-else>Register</span>
          </button>
        </div>
      </form>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
