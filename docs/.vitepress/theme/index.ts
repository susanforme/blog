import BlogTheme from '@sugarat/theme';
import Mermaid from './components/Mermaid.vue';
import { Theme } from 'vitepress';
import Viewer from 'v-viewer';
import FrameBox from './components/frame-box.vue';
import Sandpack from './components/Sandpack.vue';

//@ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
//@ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
//@ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
//@ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
//@ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};
// 自定义样式重载
// import './style.scss'

// 自定义主题色
// import './user-theme.css'

export default {
  ...BlogTheme,
  enhanceApp({ app }) {
    app
      .component('Mermaid', Mermaid)
      .use(Viewer)
      .component('Sandpack', Sandpack)
      .component('frame-box', FrameBox);
  },
} as Theme;
