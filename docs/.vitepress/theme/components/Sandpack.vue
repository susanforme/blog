<template>
  <full-screen :top="10" :right="10">
    <div class="playground">
      <div class="editor" ref="editorContainer" />
      <pre class="output">
      <sun-tab :tabs="tabList">
        <template #logs>
        <div class="item-wrapper">
          <div v-for="(output, index) in outputList" :key="index" 
      class="item"
      >
        <span>[</span><span
         :class="output.type"
        >{{
          output.type }}</span> <span>] :</span>
          <span>"{{ output.message }}"</span>
      </div>
        </div>
        </template>
        <template
        #js
        >
        <div
        class="code-wrapper"
        >
          <pre
          v-html="renderedJsCode"
          ></pre>
        </div>
      </template>
</sun-tab>

</pre>
    </div>
  </full-screen>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import tsLib from 'typescript';
import '../init-worker';
import FullScreen from './full-screen.vue';
import { SandBox } from '../util';
import { CompilerOptions } from 'typescript';
import { codeToHtml } from 'shiki';
import SunTab from './sun-tab.vue';
const tabList = [
  { name: 'logs', title: 'logs' },
  {
    name: 'js',
    title: 'js',
  },
];
const editorContainer = ref(null);
const compileJs = ref('');
const renderedJsCode = ref('');
const outputList = ref<
  {
    message: string;
    type: 'log' | 'error' | 'warn';
  }[]
>([]);
const props = defineProps<{ code: string }>();
watch(compileJs, async (newVal) => {
  renderedJsCode.value = await codeToHtml(newVal, {
    theme: 'vitesse-light',
    lang: 'ts',
  });
});

const sandBox = new SandBox({
  callback(output) {
    outputList.value.push(output);
  },
});

onMounted(async () => {
  let monaco = await import('monaco-editor');
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    allowNonTsExtensions: true,
  });
  const ts = String.raw;
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    ts`declare namespace Reflect {
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
    outputList.value = [];
    setOutput();
  });
  function setOutput() {
    const code = editor.getValue();
    try {
      const js = tsLib.transpile(code, {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        module: tsLib.ModuleKind.ESNext,
      });
      compileJs.value = js;
      outputList.value = [];

      sandBox.run(js);
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
onBeforeUnmount(() => {
  sandBox.destory();
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
