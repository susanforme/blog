# vite与webpack对于web worker处理差异

## vite

## webpack

## 对比

## 建议
在使用web worker的公共包时候,建议将web worker的创建抽离出来,让用户在使用的时候再进行创建,可以避免不同的打包工具对于web worker的处理差异,最好单独构建worker