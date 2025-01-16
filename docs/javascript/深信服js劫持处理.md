被深信服劫持的web worker
      GlobalWorkerOptions.workerPort = new Worker(
        // fk 深信服 强制兼容
        new URL(
          // 不加后缀处理了webpack
          'pdfjs-dist/build/pdf.worker.min',
          import.meta.url,
        ).href,
        // fix new URL() 在new URL 添加为href webpack会将模块识别为静态资产, 为new url 则为模块web worker
        // 添加 type module解决
        {
          type: 'module',
        },
      );

      webpack5 中自带无法处理,忠孝难两全
      用loader