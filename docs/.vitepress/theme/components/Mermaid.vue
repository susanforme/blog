<script setup lang="ts">
import { onMounted, ref } from 'vue';
import mermaid from 'mermaid';

const props = defineProps({
  code: String,
});

const el = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false });
  const result = await mermaid.render(
    'mermaid-svg',
    decodeURIComponent(props.code!),
  );
  el.value!.innerHTML = result.svg;
});
</script>

<template>
  <div ref="el" class="mermaid" />
</template>
