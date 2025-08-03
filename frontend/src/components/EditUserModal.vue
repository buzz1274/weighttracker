<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { UserModel } from '@/models/UserModel'
import { WeightModel } from '@/models/WeightModel'
import { computed, ref } from 'vue'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import { onClickOutside } from '@vueuse/core'
import type { UserSave } from '@/types/types.d.ts'

const store = useStore()
const { userModel, weightModel } = storeToRefs(store)
const user: UserModel = userModel.value
const weight: WeightModel = weightModel.value
const emit = defineEmits(['modalClose'])
const target = ref(null)
const updatedUser: ref<UserSave> = ref({})

const selectedSex = computed(() => {
  return updatedUser.value.sex || user.sex
})

const saveUser = async () => {
  const getFormElement = (id: string): string => {
    return String((document.getElementById(id) as HTMLInputElement).value)
  }

  updatedUser.value = {
    sex: getFormElement('sex'),
    height_m: getFormElement('height_m'),
    starting_weight_kg: getFormElement('starting_weight_kg'),
    weight_loss_start_date: getFormElement('weight_loss_start_date'),
    target_weight_kg: getFormElement('target_weight_kg'),
    intermediate_loss_target_kg: getFormElement('intermediate_loss_target_kg'),
    weight_loss_at_date: getFormElement('weight_loss_at_date'),
    target_weight_loss_percentage_per_week: getFormElement('target_weight_loss_percentage_per_week')
  }

  const [success, closeEditUser]: boolean = await user.save(updatedUser.value)

  if (closeEditUser) {
    if (success) {
      user.get()
      weight.get()
    }
    //display notification to show user registered or edited//
    close()
  }
}

const close = () => {
  updatedUser.value = {}
  user.errors([])
  emit('modalClose')
}

onClickOutside(target, () => close())
</script>

<template>
  <ModalComponent name="edit_user" :showCloseIcon="user.isRegistered()" @modalClose="close">
    <template #header>
      <span v-if="user.isRegistered()">Edit User</span>
      <span v-else>Register</span>
    </template>
    <template #content>
      <form class="w-100 p-3" @submit.prevent="saveUser()">
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
          <select id="sex" class="form-select">
            <option value="-">-</option>
            <option value="M" :selected="selectedSex === 'M'">Male</option>
            <option value="F" :selected="selectedSex === 'F'">Female</option>
          </select>
          <div v-if="user.errors()?.sex">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.sex"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group-lg mb-3">
          <label for="height_m">Height(m)</label>
          <input
            type="number"
            step=".01"
            class="form-control"
            id="height_m"
            :value="updatedUser.height_m || user.height_m"
          />
          <div v-if="user.errors()?.height_m">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.height_m"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group-lg mb-3">
          <label for="starting_weight_kg">Start Weight(kg)</label>
          <input
            type="number"
            step=".1"
            class="form-control"
            id="starting_weight_kg"
            :value="updatedUser.starting_weight_kg || user.starting_weight_kg"
          />
          <div v-if="user.errors()?.starting_weight_kg">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.starting_weight_kg"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group-lg mb-3">
          <label for="weight_loss_start_date">Weight Loss Start Date</label>
          <input
            type="date"
            class="form-control"
            id="weight_loss_start_date"
            :value="updatedUser.weight_loss_start_date || user.weight_loss_start_date"
          />
          <div v-if="user.errors()?.weight_loss_start_date">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.weight_loss_start_date"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group-lg mb-3">
          <label for="target_weight_kg">Target Weight(kg)</label>
          <input
            type="number"
            step=".1"
            class="form-control"
            id="target_weight_kg"
            :value="updatedUser.target_weight_kg || user.target_weight_kg"
          />
          <div v-if="user.errors()?.target_weight_kg">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.target_weight_kg"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group-lg mb-3">
          <label for="intermediate_loss_target_kg">Intermediate Step(kg)</label>
          <input
            type="number"
            step=".1"
            class="form-control"
            id="intermediate_loss_target_kg"
            :value="updatedUser.intermediate_loss_target_kg || user.intermediate_loss_target_kg"
          />
          <div v-if="user.errors()?.intermediate_loss_target_kg">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.intermediate_loss_target_kg"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="form-group-lg mb-3">
          <label for="starting_weight_kg">Weight at Date</label>
          <input
            type="date"
            class="form-control"
            id="weight_loss_at_date"
            :value="updatedUser.weight_loss_at_date || user.weight_loss_at_date"
          />
          <div v-if="user.errors()?.weight_loss_at_date">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.weight_loss_at_date"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
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
            :value="
              updatedUser.target_weight_loss_percentage_per_week ||
              user.target_weight_loss_percentage_per_week
            "
          />
          <div v-if="user.errors()?.target_weight_loss_percentage_per_week">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in user.errors()?.target_weight_loss_percentage_per_week"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
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
          <button type="submit" class="btn btn-primary" value="save">
            <span v-if="user.isRegistered()">Edit</span>
            <span v-else>Register</span>
          </button>
        </div>
      </form>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
