<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { criticalErrors, hasCriticalErrors } = storeToRefs(store)

const modalClose = (): void => {
  hasCriticalErrors.value = false
}

const isOpen = computed((): boolean => {
  return hasCriticalErrors.value
})

const emit = defineEmits(['modalClose'])
const target = ref(null)

onClickOutside(target, () => emit('modalClose'))
</script>

<template>
  <ModalComponent name="error_modal" @modalClose="modalClose" :isOpen="isOpen">
    <template #header>
      <div class="header">
        An error occurred:
        <button
          type="button"
          class="btn-close close-button"
          aria-label="Close"
          @click="modalClose"
        />
      </div>
    </template>
    <template #content>
      <h5>{{ criticalErrors }}</h5>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>

<style scoped>
.header {
  width: 100%;
}
.close-button {
  display: inline;
  position: relative;
  float: right;
  top: -15px;
  right: -25px;
}
</style>
