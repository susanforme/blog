<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import '../init-worker';
import { editor } from 'monaco-editor';
const props = defineProps<{
  code: string;
  onEditorInit?: (editor: editor.IStandaloneCodeEditor) => void;
  extraOptions?: editor.IStandaloneEditorConstructionOptions;
}>();

const editorContainer = ref<HTMLDivElement>();
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
  const extraLib = ts`
    declare namespace Reflect {
      function decorate(
        decorators: ClassDecorator[],
        target: Function,
      ): Function;
      function metadata(metadataKey: any, metadataValue: any): any;
      function defineMetadata(
        metadataKey: any,
        metadataValue: any,
        target: Object,
        propertyKey?: string | symbol,
      ): void;
      function getMetadata(
        metadataKey: any,
        target: Object,
        propertyKey?: string | symbol,
      ): any;
    }
    declare var Reflect: typeof Reflect;
  `;
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    extraLib,
    'ts:reflect-metadata.d.ts',
  );
  const editor = monaco.editor.create(editorContainer.value!, {
    value: props.code,
    language: 'typescript',
    theme: 'vs',
    automaticLayout: true,
    fontSize: 18,
    ...props.extraOptions,
  });
  props.onEditorInit?.(editor);
});
async function requestFull() {
  const dom = editorContainer.value;
  if (dom) {
    await dom.requestFullscreen();
  }
}
</script>

<template>
  <div class="wrapper">
    <div class="editor" ref="editorContainer"></div>
    <div class="icon" @click="requestFull">🔍</div>
  </div>
</template>

<style scoped lang="less">
.editor {
  width: 100%;
  height: 100vh;
  min-height: 400px;
}
.wrapper {
  position: relative;
}
.icon {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  cursor: pointer;
}
</style>
