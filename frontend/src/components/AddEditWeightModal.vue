<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['addWeight', 'modalClose'])
</script>

<template>
  <ModalComponent name="add_edit_weight" @modalClose="emit('modalClose')">
    <template #header> Add Weight </template>
    <template #content>
      <form class="clearfix" @submit.prevent="emit('addWeight')">
        <div class="mb-3">
          <label for="date" class="form-label">Date</label>
          <input type="date" class="form-control" id="date" />
        </div>
        <div class="mb-3">
          <label for="weight_kg" class="form-label">Weight(kg)</label>
          <input type="number" step=".10" class="form-control" id="weight_kg" />
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
