<script setup lang="ts">
import { onMounted, ref } from 'vue';
import mermaid from 'mermaid';

const props = defineProps({
  code: String,
});

const svg = ref<string>('');

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false });
  const result = await mermaid.render(
    'mermaid-svg',
    decodeURIComponent(props.code!),
  );
  svg.value = svgToDataUrl(result.svg);
});
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(
    new TextEncoder()
      .encode(svg)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''),
  )}`;
}
</script>

<template>
  <div class="mermaid">
    <div v-viewer>
      <img :src="svg" alt="diagram" style="cursor: zoom-in" />
    </div>
  </div>
</template>
