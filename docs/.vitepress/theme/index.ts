import BlogTheme from '@sugarat/theme';
import Mermaid from './components/Mermaid.vue';
// 自定义样式重载
// import './style.scss'

// 自定义主题色
// import './user-theme.css'

export default {
  ...BlogTheme,
  enhanceApp({ app }) {
    app.component('Mermaid', Mermaid);
  },
};
