<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { notification, hasNotification } = storeToRefs(store)

const modalClose = (): void => {
  hasNotification.value = false
}

const isOpen = computed((): boolean => {
  return hasNotification.value
})

const isSuccessNotification = computed(() => notification.value?.type === 'success')
const backgroundColour = computed(() => (isSuccessNotification.value ? '#17b169' : 'red'))

const emit = defineEmits(['modalClose'])
const target = ref(null)

onClickOutside(target, () => emit('modalClose'))
</script>

<template>
  <ModalComponent
    name="notification_modal"
    @modalClose="modalClose"
    :isOpen="isOpen"
    :backgroundColour="backgroundColour"
  >
    <template #header>
      <div v-if="!isSuccessNotification">
        {{ notification.type }}
      </div>
    </template>
    <template #content>
      <div v-if="isSuccessNotification">
        <h5>Success: {{ notification.message }}</h5>
      </div>
      <div v-else>
        <h5>Error: {{ notification.message }}</h5>
      </div>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>

<style scoped>
.header {
  width: 100%;
}
.modal-background {
  background-color: green;
}
</style>
