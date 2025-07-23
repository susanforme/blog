<script lang="ts" setup>
import { ref, watch } from 'vue';

const box = ref<HTMLDivElement | null>(null);
const isFullscreen = ref(false);
withDefaults(
  defineProps<{
    top?: number;
    right?: number;
  }>(),
  {
    top: 40,
    right: 40,
  },
);
async function handleClick() {
  isFullscreen.value = !isFullscreen.value;
}
</script>

<template>
  <div
    class="full-box"
    ref="box"
    :class="{
      activeBox: isFullscreen,
    }"
  >
    <slot></slot>
    <div
      class="btn"
      @click="handleClick"
      :style="{
        top: `${top}px`,
        right: `${right}px`,
      }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        v-if="!isFullscreen"
      >
        <polyline points="9 3 5 3 5 7" />
        <line x1="5" y1="3" x2="9" y2="7" />
        <polyline points="15 3 19 3 19 7" />
        <line x1="19" y1="3" x2="15" y2="7" />
        <polyline points="9 21 5 21 5 17" />
        <line x1="5" y1="21" x2="9" y2="17" />
        <polyline points="15 21 19 21 19 17" />
        <line x1="19" y1="21" x2="15" y2="17" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="less">
.full-box {
  width: 100%;
  position: relative;
  background-color: white;
  iframe {
    width: 100%;
    height: 100%;
  }
  .btn {
    position: absolute;

    cursor: pointer;
    z-index: 99;
  }
  &.activeBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    z-index: 99;
  }
}
</style>
