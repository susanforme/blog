import BlogTheme from '@sugarat/theme';
import Mermaid from './components/Mermaid.vue';
import { Theme } from 'vitepress';
import Viewer from 'v-viewer';
import FrameBox from './components/frame-box.vue';
import Sandpack from './components/Sandpack.vue';
//@ts-ignore
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
self.MonacoEnvironment = {
  getWorker(_, label) {
    switch (label) {
      case 'typescript':
      default:
        return new EditorWorker();
    }
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
