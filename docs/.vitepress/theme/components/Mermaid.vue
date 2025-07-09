<script setup lang="ts">
import { onMounted, ref } from 'vue';
import mermaid from 'mermaid';
import { api as viewerApi } from 'v-viewer';
// props
const props = defineProps<{ code: string }>();

// 状态
const rawSvg = ref(''); // 原始 svg 字符串
const svgDataUrl = ref('');
const loading = ref(true);
const viewerRef = ref();

// 初始化
onMounted(async () => {
  mermaid.initialize({ startOnLoad: false });
  try {
    const result = await mermaid.render(
      'mermaid-svg-' + Math.random().toString(36).slice(2),
      decodeURIComponent(props.code),
    );
    rawSvg.value = result.svg;
    svgDataUrl.value = svgToDataUrl(result.svg);
  } finally {
    loading.value = false;
  }
});

// 工具方法
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(
    new TextEncoder()
      .encode(svg)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''),
  )}`;
}

function openViewer() {
  viewerRef.value?.click();
}
</script>

<template>
  <div class="mermaid-container">
    <div class="svg-wrapper">
      <div
        v-if="loading"
        class="loading-container"
        aria-label="loading"
        role="img"
      >
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

      <div v-else class="svg-content" v-html="rawSvg"></div>

      <button
        v-if="!loading"
        class="zoom-btn"
        @click="openViewer"
        title="放大查看"
      >
        🔍
      </button>
    </div>

    <!-- 隐藏 img 用于 v-viewer 放大 -->
    <div v-viewer class="hidden">
      <img :src="svgDataUrl" alt="preview" ref="viewerRef" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.hidden {
  display: none;
}
.mermaid-container {
  position: relative;
  min-height: 300px;
}
.svg-wrapper {
  position: relative;
}
.svg-content :deep(svg) {
  width: 100%;
  height: auto;
}
.zoom-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--el-color-primary);
  flex-direction: column;
  gap: 10px;
  min-height: 300px;
  svg {
    width: 48px;
    height: 48px;
  }
}
</style>
