<template>
  <full-screen :top="10" :right="10">
    <div class="playground">
      <div class="editor-wrapper">
        <monaco-editor
          :code="decodeURIComponent(code)"
          :extraOptions="{
            language: 'typescript',
            theme: 'vs',
            automaticLayout: true,
            fontSize: 18,
          }"
          :on-editor-init="onShowEditorInit"
        ></monaco-editor>
      </div>
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
        <template #js>
        <div class="code-wrapper">
        <monaco-editor
        :code="compileJs"
        :extraOptions="{
          language: 'javascript',
          theme: 'vs',
          automaticLayout: true,
          fontSize: 18,
          readOnly: true
        }"
        :on-editor-init="onShowEditorInit"
      ></monaco-editor>
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
import MonacoEditor from './monaco-editor.vue';
import { editor } from 'monaco-editor';
const tabList = [
  { name: 'logs', title: 'logs' },
  {
    name: 'js',
    title: 'js',
  },
];

const outputList = ref<
  {
    message: string;
    type: 'log' | 'error' | 'warn';
  }[]
>([]);
const props = defineProps<{ code: string }>();
const compileJs = ref<string>('');

const sandBox = new SandBox({
  callback(output) {
    outputList.value.push(output);
  },
});

onBeforeUnmount(() => {
  sandBox.destory();
});
async function onShowEditorInit(editor: editor.IStandaloneCodeEditor) {
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
}
</script>

<style scoped lang="less">
.playground {
  display: flex;
  height: 90vh;
  padding-top: 20px;
}

.editor-wrapper {
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
