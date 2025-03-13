<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { criticalErrors, hasCriticalErrors } = storeToRefs(store)

const modalClose = (): void => {
  hasCriticalErrors.value = false
}

const emit = defineEmits(['modalClose'])
const target = ref(null)

onClickOutside(target, () => emit('modalClose'))
</script>

<template>
  <ModalComponent name="error_modal" @modalClose="modalClose" :isOpen="hasCriticalErrors">
    <template #header>
      Error 500
      <button type="button" class="btn-close close-button" aria-label="Close" @click="modalClose" />
    </template>
    <template #content>
      <h4>{{ criticalErrors }} {{ hasCriticalErrors }}</h4>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>

<style scoped>
.close-button {
  position: relative;
  top: -20px;
  left: 357px;
}
</style>
