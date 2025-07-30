import BlogTheme from '@sugarat/theme';
import { inject } from '@vercel/analytics';
import Viewer from 'v-viewer';
import { Theme } from 'vitepress';
import FrameBox from './components/frame-box.vue';
import Mermaid from './components/Mermaid.vue';
import Sandpack from './components/Sandpack.vue';
// 自定义样式重载
// import './style.scss'

// 自定义主题色
// import './user-theme.css'

export default {
  ...BlogTheme,
  enhanceApp({ app }) {
    if (typeof window !== 'undefined') {
      inject();
      console.log('inject analytics');
    }
    app
      .component('Mermaid', Mermaid)
      .use(Viewer)
      .component('Sandpack', Sandpack)
      .component('frame-box', FrameBox);
  },
} as Theme;
