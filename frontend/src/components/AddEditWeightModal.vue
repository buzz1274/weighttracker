<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'

const emit = defineEmits(['addEditDeleteWeight', 'modalClose'])
const props = defineProps({
  errors: Object,
  title: String,
  weight: Object,
  modalAction: String
})
</script>

<template>
  <ModalComponent name="add_edit_weight" @modalClose="emit('modalClose')">
    <template #header> {{ props.modalAction == 'add' ? 'Add' : 'Edit' }} Weight </template>
    <template #content>
      <form
        class="clearfix"
        @submit.prevent="emit('addEditDeleteWeight', props.modalAction, props.weight, $event)"
      >
        <div class="mb-3">
          <label for="date" class="form-label">Date</label>
          <input
            type="date"
            class="form-control"
            id="date"
            :value="!props.errors?.date ? props.weight?.date : ''"
          />
          <div v-if="props.errors?.date">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in props.errors.date"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="mb-3">
          <label for="weight_kg" class="form-label">Weight(kg)</label>
          <input
            type="number"
            step=".10"
            class="form-control"
            id="weight_kg"
            :value="!props.errors?.weight_kg ? props.weight?.weight_kg : ''"
          />
          <div v-if="props.errors?.weight_kg">
            <p
              class="alert alert-danger"
              style="margin-top: 10px"
              v-for="(error, key) in props.errors.weight_kg"
              :key="key"
            >
              {{ error }}
            </p>
          </div>
        </div>
        <div class="float-end">
          <button
            type="submit"
            class="btn btn-secondary"
            style="margin-right: 10px"
            @click="emit('modalClose')"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" value="save">Save</button>
        </div>
      </form>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
