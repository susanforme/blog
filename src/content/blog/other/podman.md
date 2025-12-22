---
title: 干掉Docker - Podman入门
description: Podman是Docker的轻量级替代品,无守护进程的容器引擎,内存占用更低,支持无根模式
pubDate: 2025-12-22
---

# 干掉docker

Podman 是一个无守护进程的容器引擎，可以用来开发、管理和运行 OCI 容器和容器化应用程序。它是 Docker 的一个替代品，具有许多相似的功能，但也有一些独特的优势。

podman和docker的主要区别在于，podman 不需要一个持续运行的守护进程来管理容器。相反，podman 直接与容器运行时（如 runc 或 crun）交互，这使得它更轻量级且更易于集成到现有的系统中。此外，podman 支持无根模式，这意味着用户可以在不需要超级用户权限的情况下运行容器，从而提高了安全性。Podman 还提供了与**Docker
CLI 兼容的命令行界面**
，这使得从 Docker 迁移到 Podman 变得相对简单。许多常用的 Docker 命令在 Podman 中都有对应的命令，例如
`podman run`、`podman build` 和 `podman push`。Podman 还支持 Kubernetes
YAML 文件，可以直接将这些文件转换为 Podman 容器，这使得在本地开发和测试 Kubernetes 应用程序变得更加容易。

**对我来说最重要的是podman内存占用远远低于docker**

如下为都启动如下compose的内存占用,可以看到podman内存占用远低于docker

```yml
name: minio-docker

services:
  minio:
    image: minio/minio:RELEASE.2025-04-22T22-12-26Z
    container_name: minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - '9000:9000' # S3 API
      - '9001:9001' # Web Console
```

> docker

![image-20251222091128212](https://raw.githubusercontent.com/susanforme/img/main/img/image-20251222091128212.png)

> podman

![image-20251222091336436](https://raw.githubusercontent.com/susanforme/img/main/img/image-20251222091336436.png)
