<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'

const emit = defineEmits(['deleteWeight'])
const props = defineProps({
  errors: Object,
  weight: Object
})
</script>

<template>
  <ModalComponent name="delete_weight" @modalClose="emit('deleteWeight')">
    <template #header> Delete Weight </template>
    <template #content>
      <form class="clearfix" @submit.prevent="emit('deleteWeight', 'delete', props.weight, $event)">
        <div class="mb-3">This will permanently delete the selected weight</div>
        <div v-if="props.errors?.error">
          <p class="alert alert-danger" style="margin-top: 10px">
            {{ props.errors.error }}
          </p>
        </div>
        <div class="float-end">
          <button
            type="submit"
            class="btn btn-secondary"
            style="margin-right: 10px"
            @click="emit('deleteWeight')"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" value="delete">Delete</button>
        </div>
      </form>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
