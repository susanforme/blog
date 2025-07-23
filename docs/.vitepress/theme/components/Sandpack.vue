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
import { runInSandbox } from '../util';

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
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    allowNonTsExtensions: true,
  });
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `
declare namespace Reflect {
  function decorate(decorators: ClassDecorator[], target: Function): Function;
  function metadata(metadataKey: any, metadataValue: any): any;
  function defineMetadata(metadataKey: any, metadataValue: any, target: Object, propertyKey?: string | symbol): void;
  function getMetadata(metadataKey: any, target: Object, propertyKey?: string | symbol): any;
}
declare var Reflect: typeof Reflect;
`,
    'ts:reflect-metadata.d.ts',
  );
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

      runInSandbox(js, (output) => {
        outputList.value.push(output);
      });
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
