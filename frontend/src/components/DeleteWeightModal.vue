<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits(['deleteWeight'])
const props = defineProps({
  errors: Object,
  weightId: Number
})
</script>

<template>
  <ModalComponent name="delete_weight" @modalClose="emit('deleteWeight')">
    <template #header> Delete Weight </template>
    <template #content>
      <form
        class="clearfix"
        @submit.prevent="emit('deleteWeight', 'delete', props.weightId, $event)"
      >
        <div class="mb-3">This will permanently delete {{ props.weightId }}</div>
        <div class="float-end">
          <button
            type="submit"
            class="btn btn-secondary"
            style="margin-right: 10px"
            @click="emit('deleteWeight')"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" value="save">Delete</button>
        </div>
      </form>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
