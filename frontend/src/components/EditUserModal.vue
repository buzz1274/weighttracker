<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
//import { onClickOutside } from '@vueuse/core'
//import { computed, ref } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean
})
const isOpen = ref(props.isOpen)

const modalClose = (): void => {
  isOpen.value = false
}
</script>

<template>
  <ModalComponent name="edit_user" :isOpen="isOpen" @modalClose="modalClose">
    <template #header> Edit User </template>
    <template #content></template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
