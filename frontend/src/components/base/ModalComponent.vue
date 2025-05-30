<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface Props {
  isOpen: boolean
  backgroundColour?: string
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  backgroundColour: '#fff'
})

const emit = defineEmits(['modalClose'])
const target = ref(null)

onClickOutside(target, () => emit('modalClose'))
</script>

<template>
  <div v-if="props.isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div
        class="modal-container"
        :style="{ 'background-color': props.backgroundColour }"
        ref="target"
      >
        <div class="modal-header">
          <div class="header">
            <strong><slot name="header"></slot></strong>
            <button
              type="button"
              class="btn-close close-button"
              aria-label="Close"
              @click="emit('modalClose')"
            />
          </div>
        </div>
        <div class="modal-body">
          <slot name="content"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <div>
              <button @click.stop="emit('modalClose')">Submit</button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-header {
  font-weight: bold;
  font-size: larger;
}
.modal-body {
  padding-top: 20px;
}
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
.modal-container {
  width: 500px;
  margin: 150px auto;
  padding: 20px 30px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
</style>
