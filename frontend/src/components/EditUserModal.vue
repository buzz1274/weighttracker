<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'

const emit = defineEmits(['addEditDeleteWeight', 'modalClose'])
/*
const props = defineProps({
  errors: Object,
  title: String,
  weight: Object,
  modalAction: String
})
*/
</script>

<template>
  <ModalComponent name="edit_user" @modalClose="emit('modalClose')">
    <template #header> Edit User </template>
    <template #content></template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
