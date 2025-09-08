<template>
  <full-screen :top="10" :right="10">
    <div class="playground">
      <div class="editor-wrapper">
        <diff-editor
          :prev-code="computedCodes[0]"
          :next-code="computedCodes[1]"
        ></diff-editor>
      </div>
    </div>
  </full-screen>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import FullScreen from './full-screen.vue';
import DiffEditor from './diff-editor.vue';

const props = defineProps<{ code: string }>();

const computedCodes = computed(() => {
  // oxlint-disable-next-line no-eval
  return eval(decodeURIComponent(props.code));
});
</script>

<style scoped lang="less">
.playground {
  display: flex;
  height: 90vh;
  padding-top: 20px;
}

.editor-wrapper {
  width: 100%;
}

.output {
  width: 50%;
  margin: 0;
  padding: 1rem;
  padding-top: 0;
  background-color: white;
  overflow: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .item-wrapper {
    display: flex;
    flex-direction: column;
  }

  .code-wrapper {
    display: flex;
    flex-direction: column;
  }

  .output-title {
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 10px;
  }

  .item {
    display: flex;
    border-bottom: 1px dashed #ccc;
    padding: 10px 0;

    > * {
      display: inline;
      white-space: pre-wrap;
    }

    .log {
      color: silver;
    }

    .error {
      color: red;
    }

    .warn {
      color: orange;
    }
  }
}
</style>
