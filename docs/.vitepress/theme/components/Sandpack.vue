<template>
  <full-screen :top="10" :right="10">
    <div class="playground">
      <div class="editor" ref="editorContainer" />
      <pre class="output">
      <div class="output-title">logs</div>
      <div v-for="(output, index) in outputList" :key="index" 
      class="item"
      >
        <span>[</span><span
         :class="output.type"
        >{{ 
          output.type }}</span> <span>] :</span>
          <span>"{{ output.message }}"</span>
      </div>
    </pre>
    </div>
  </full-screen>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ts from 'typescript';
import '../init-worker';
import FullScreen from './full-screen.vue';

const editorContainer = ref(null);
const outputList = ref<
  {
    message: string;
    type: 'log' | 'error' | 'warn';
  }[]
>([]);
const props = defineProps<{ code: string }>();

onMounted(async () => {
  let monaco = await import('monaco-editor');
  const editor = monaco.editor.create(editorContainer.value!, {
    value: decodeURIComponent(props.code),
    language: 'typescript',
    theme: 'vs',
    automaticLayout: true,
    fontSize: 18,
  });
  setOutput();

  // 加载完毕调用
  editor.onDidChangeModelContent(() => {
    setOutput();
  });
  function setOutput() {
    const code = editor.getValue();
    try {
      const js = ts.transpile(code);
      outputList.value = [];
      const originalLog = console.log;
      const originWarn = console.warn;
      const originError = console.error;
      console.log = (...args) =>
        outputList.value.push({
          message: args.join(' '),
          type: 'log',
        });
      console.warn = (...args) => {
        outputList.value.push({
          message: args.join(' '),
          type: 'warn',
        });
      };
      console.error = (...args) => {
        outputList.value.push({
          message: args.join(' '),
          type: 'error',
        });
      };
      new Function(js)();
      console.log = originalLog;
      console.warn = originWarn;
      console.error = originError;
    } catch (err) {
      outputList.value = [
        {
          message: err.message,
          type: 'error',
        },
      ];
    }
  }
});
</script>

<style scoped lang="less">
.playground {
  display: flex;
  height: 90vh;
  padding-top: 20px;
}
.editor {
  width: 50%;
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
