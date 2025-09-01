<script lang="ts" setup>
import { computed, ref, onMounted, watch } from 'vue';

const props = defineProps<{
  code: string;
}>();

const iframeRef = ref<HTMLIFrameElement | null>(null);

const html = computed(() => decodeURIComponent(props.code));

const updateIframe = () => {
  if (iframeRef.value) {
    const doc = iframeRef.value.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html.value);
      doc.close();
    }
  }
};

onMounted(updateIframe);

// 监听 code 变化
watch(html, () => {
  updateIframe();
});
</script>

<template>
  <div class="frame-box">
    <iframe ref="iframeRef" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<style scoped lang="less">
.frame-box {
  width: 100%;
  height: 500px; // 可以根据需求调整高度
  position: relative;
  background-color: white;
}
iframe {
  width: 100%;
  height: 100%;
}
</style>
