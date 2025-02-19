<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
import { defineProps } from 'vue'
const props = defineProps({
  errors: String
})
</script>

<template>
  <ModalComponent name="error_modal">
    <template #header> Error 500 </template>
    <template #content>
      <h1>'{{ props.errors }}'</h1>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
