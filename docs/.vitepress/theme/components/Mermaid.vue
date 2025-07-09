<script setup lang="ts">
import { onMounted, ref } from 'vue';
import mermaid from 'mermaid';

const props = defineProps({
  code: String,
});

const svg = ref<string>('');
const loading = ref(true);

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false });
  try {
    const result = await mermaid.render(
      'mermaid-svg-' + Math.random().toString(36).slice(2),
      decodeURIComponent(props.code!),
    );
    svg.value = svgToDataUrl(result.svg);
  } finally {
    loading.value = false;
  }
});

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(
    new TextEncoder()
      .encode(svg)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''),
  )}`;
}
</script>

<style lang="less" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--el-color-primary);
  flex-direction: column;
  gap: 10px;
  svg {
    width: 48px;
    height: 48px;
  }
}
</style>

<template>
  <div class="mermaid">
    <div v-viewer>
      <template v-if="loading">
        <div class="loading-container" aria-label="loading" role="img">
          <svg viewBox="0 0 50 50" width="48" height="48" fill="none">
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              stroke-width="5"
              fill="none"
              stroke-linecap="round"
              stroke-dasharray="150.6 100.4"
              stroke-dashoffset="0"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;502"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dasharray"
                values="150.6 100.4;1 250;150.6 100.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <div>mermaid loading...</div>
        </div>
      </template>
      <template v-else>
        <img :src="svg" alt="diagram" style="cursor: zoom-in" />
      </template>
    </div>
  </div>
</template>
