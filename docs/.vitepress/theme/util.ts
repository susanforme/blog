export class SandBox {
  private iframe: HTMLIFrameElement | null = null;
  private fn: (event: MessageEvent) => void;
  constructor(options: SandBoxOptions) {
    const { id = 'sandbox-iframe', callback } = options;
    this.iframe = document.querySelector(id);
    if (!this.iframe) {
      this.iframe = document.createElement('iframe');
      this.iframe.id = id;
      this.iframe.style.display = 'none';
      document.body.appendChild(this.iframe);
    }
    const fn = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        const { method, args } = event.data;
        callback({
          message: args.join('\n'),
          type: method as 'log' | 'error' | 'warn',
        });
      }
    };
    this.fn = fn;
    window.addEventListener('message', fn);
  }
  destory() {
    window.removeEventListener('message', this.fn);
  }
  run(jsCode: string) {
    const html = String.raw;
    const htmlStr = html`
      <script type="module">
        // 劫持 console
        const methods = ['log', 'error', 'warn', 'info', 'debug'];
        methods.forEach((method) => {
          const original = console[method];
          console[method] = (...args) => {
            window.parent.postMessage(
              {
                type: 'console',
                method,
                args: args.map((arg) => {
                  return arg.toString();
                }),
              },
              '*',
            );
            original.apply(console, args);
          };
        });

        // 加载 reflect-metadata
        import('https://unpkg.com/reflect-metadata@0.1.13/Reflect.js').then(
          () => {
            try {
              ${jsCode};
            } catch (e) {
              console.error(e);
            }
          },
        );
      </script>
    `;
    this.iframe!.srcdoc = htmlStr;
  }
}
export interface SandBoxOptions {
  id?: string;
  callback: (option: {
    message: string;
    type: 'log' | 'error' | 'warn';
  }) => void;
}
