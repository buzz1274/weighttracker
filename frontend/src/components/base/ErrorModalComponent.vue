<script setup lang="ts">
import ModalComponent from '@/components/base/ModalComponent.vue'
</script>

<template>
  <ModalComponent name="error_modal">
    <template #header> Error </template>
    <template #content>
      <h1>Error</h1>
    </template>
    <template #footer>&nbsp;</template>
  </ModalComponent>
</template>
