<script lang="ts" setup>
import { computed, defineProps, onMounted, ref, watch } from 'vue';
const props = defineProps({
  code: String,
});
const actualCode = computed(() => {
  return decodeURIComponent(props.code || '');
});
const container = ref<HTMLElement | null>(null);

onMounted(() => {
  attachCode(actualCode.value);
});
watch(actualCode, (newVal) => {
  attachCode(newVal);
});

function attachCode(code: string) {
  // 通过shadow-dom

  if (container.value) {
    const shadowRoot =
      container.value.shadowRoot ??
      container.value.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = code;
  }
}
</script>

<template>
  <div>
    <div ref="container"></div>
    <div class="hidden" v-html="actualCode"></div>
  </div>
</template>

<style scoped lang="less">
// 视觉上不可见
.hidden {
  visibility: hidden;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
</style>
