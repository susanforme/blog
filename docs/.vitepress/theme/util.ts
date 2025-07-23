export function runInSandbox(jsCode) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  const html = `
    <script type="module">
      // 劫持 console
      const methods = ['log', 'error', 'warn', 'info', 'debug'];
      methods.forEach(method => {
        const original = console[method];
        console[method] = (...args) => {
          window.parent.postMessage({ type: 'console', method, args }, '*');
          original.apply(console, args);
        };
      });

      // 加载 reflect-metadata
      import('https://unpkg.com/reflect-metadata@0.1.13/Reflect.js').then(() => {
        try {
          ${jsCode}
        } catch (e) {
          console.error(e);
        }
      });
    <\/script>
  `;

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // 父页面监听 iframe 发来的日志
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'console') {
      const { method, args } = event.data;
      console[method](...args);
    }
  });
}
