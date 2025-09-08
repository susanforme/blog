<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import '../init-worker';
import { editor } from 'monaco-editor';
import * as prettier from 'prettier/standalone';
import * as parserTypescript from 'prettier/parser-typescript';
import * as prettierPluginEstree from 'prettier/plugins/estree';

const props = defineProps<{
  extraOptions?: editor.IStandaloneEditorConstructionOptions;
  language?: 'typescript';
  prevCode: string;
  nextCode: string;
}>();
const { language = 'typescript' } = props;

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
  const [prev, next] = await Promise.all(
    [props.prevCode, props.nextCode].map((code) => {
      return prettier.format(code, {
        parser: 'typescript',
        plugins: [parserTypescript, prettierPluginEstree as any],
        printWidth: 60,
        semi: true,
        tabWidth: 2,
        singleQuote: true,
        proseWrap: 'always',
        trailingComma: 'all',
      });
    }),
  );
  const original = monaco.editor.createModel(prev, language);
  const modified = monaco.editor.createModel(next, language);

  const editor = monaco.editor.createDiffEditor(editorContainer.value!, {
    theme: 'vs',
    automaticLayout: true,
    fontSize: 18,
    renderSideBySide: true,
    readOnly: true,
  });
  editor.setModel({
    original,
    modified,
  });
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
  height: 100%;
  min-height: 400px;
}
.wrapper {
  position: relative;
  height: 100%;
}
.icon {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 999;
  cursor: pointer;
}
</style>
