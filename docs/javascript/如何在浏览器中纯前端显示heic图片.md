
# HEIC是什么?

**高效率图像文件格式**（英语：**H**igh **E**fficiency **I**mage **F**ile Format， **HEIF**，也称**高效图像文件格式**[[1\]](https://zh.wikipedia.org/wiki/HEIF#cite_note-1)），是一个用于单张图像或图像序列的[文件格式](https://zh.wikipedia.org/wiki/檔案格式) ,HEIC是HEIF格式文件的扩展名.

# 如何在前端显示?

找到一个c++库libheif https://github.com/strukturag/libheif 将其编译为wasm.

## 编译libheif

强烈建议在类unix环境下编译

### 修改编译脚本

仓库自带脚本位于 libheif/build-emscripten.sh.

字太多不看,直接看最后

```bash
#!/bin/bash
emcc -Wl,--whole-archive "$LIBHEIFA" -Wl,--no-whole-archive \
    -sEXPORTED_FUNCTIONS="$EXPORTED_FUNCTIONS,_free,_malloc,_memcpy" \
    -sMODULARIZE \
    -sEXPORT_NAME="libheif" \
    -sWASM_ASYNC_COMPILATION=0 \
    -sALLOW_MEMORY_GROWTH \
    -std=c++11 \
    $LIBRARY_INCLUDE_FLAGS \
    $LIBRARY_LINKER_FLAGS \
    $BUILD_FLAGS \
    $RELEASE_BUILD_FLAGS
```



### 拉取依赖,开始编译

```bash
# 使用wsl ubuntu编译
#!/bin/bash
# Get the emsdk repo
git clone https://github.com/emscripten-core/emsdk.git

# Enter that directory
cd emsdk
# Fetch the latest version of the emsdk (not needed the first time you clone)
git pull

# Download and install the latest SDK tools.
./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh

# 安装工具链
sudo apt install build-essential cmake

# 编译libheif
git clone https://github.com/strukturag/libheif
cd libheif
mkdir buildjs
cd buildjs
# 使用目录下的脚本支持es6导出
USE_WASM=1 ../build-emscripten.sh ..
```

