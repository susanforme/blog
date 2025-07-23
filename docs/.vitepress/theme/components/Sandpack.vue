<template>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ts from 'typescript';
import '../init-worker';

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
    theme: 'vs-dark',
    automaticLayout: true,
  });

  editor.onDidChangeModelContent(() => {
    const code = editor.getValue();
    try {
      const js = ts.transpile(code);
      outputList.value = [];
      const originalLog = console.log;
      console.log = (...args) =>
        outputList.value.push({
          message: args.join(' '),
          type: 'log',
        });
      new Function(js)();
      console.log = originalLog;
    } catch (err) {
      outputList.value = [
        {
          message: err.message,
          type: 'error',
        },
      ];
    }
  });
});
</script>

<style scoped lang="less">
.playground {
  display: flex;
  height: 90vh;
  background-color: #1e1e1e;
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
