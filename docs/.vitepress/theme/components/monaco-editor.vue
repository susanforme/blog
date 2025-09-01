<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import '../init-worker';
import { editor } from 'monaco-editor';
import * as prettier from 'prettier/standalone';
import * as parserTypescript from 'prettier/parser-typescript';
import * as prettierPluginEstree from 'prettier/plugins/estree';

const props = withDefaults(
  defineProps<{
    code: string;
    onEditorInit?: (editor: editor.IStandaloneCodeEditor) => void;
    extraOptions?: editor.IStandaloneEditorConstructionOptions;
    language?: 'html' | 'typescript';
  }>(),
  {
    language: 'typescript',
  },
);

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
  let formatted = props.code;
  const extraOptions = {
    language: props.language,
    ...props.extraOptions,
  };
  if (props.language === 'typescript') {
    formatted = await prettier.format(props.code, {
      parser: 'typescript',
      plugins: [parserTypescript, prettierPluginEstree as any],
      printWidth: 60,
      semi: true,
      tabWidth: 2,
      singleQuote: true,
      proseWrap: 'always',
      trailingComma: 'all',
    });
  }

  const editor = monaco.editor.create(editorContainer.value!, {
    value: formatted,
    theme: 'vs',
    automaticLayout: true,
    fontSize: 18,
    ...extraOptions,
  });
  props.onEditorInit?.(editor);
});
</script>

<template>
  <div class="wrapper" ref="wrapper">
    <div class="editor" ref="editorContainer"></div>
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
