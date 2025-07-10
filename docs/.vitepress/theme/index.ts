import BlogTheme from '@sugarat/theme';
import Mermaid from './components/Mermaid.vue';
import { Theme } from 'vitepress';
import Viewer from 'v-viewer';
import FrameBox from './components/frame-box.vue';
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
      .component('frame-box', FrameBox);
  },
} as Theme;
