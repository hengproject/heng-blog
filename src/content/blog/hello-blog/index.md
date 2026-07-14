---
title: "你好，Heng's Blog"
description: 第一篇示例文章，用于展示博客的常用排版和中英文内容组织方式。
publishDate: 2026-07-14
category: technical
tags:
  - astro
  - blog
draft: true
translationStatus: complete
---

这是我的第一篇博客文章，也是一篇可以直接修改的写作示例。

目录名 `hello-blog` 决定文章地址，顶部的 `title` 决定页面上显示的标题。因此，以后可以自由修改标题而不改变已经分享出去的链接。

## 为什么建立这个博客

这里将用于整理研究笔记、技术实践和长期项目记录。相比散落在不同平台上的内容，自己的博客更容易持续维护，也能完整保留文章的结构和修改历史。

目前计划记录两类内容：

- **Research**：论文阅读、实验过程和阶段性结论。
- **Technical**：工程实现、工具配置和问题排查。

## 常用 Markdown 排版

正文可以使用普通的 Markdown 语法。

### 引用

> 写作不仅是在记录结果，也是在整理思考过程。

### 代码

```ts
const site = {
  name: "Heng's Blog",
  author: 'Suheng'
}

console.log(`Welcome to ${site.name}`)
```

### 表格

| 内容类型  | 分类值      | 示例                 |
| --------- | ----------- | -------------------- |
| 研究笔记  | `research`  | 论文阅读、实验记录   |
| 技术文章  | `technical` | 开发实践、部署和排错 |

### 图片

![Heng's Blog 示例社交卡片](/images/social-card.svg)

如果图片只属于一篇文章，可以放进该文章目录下的 `images/` 文件夹；多个页面共用的图片则放在 `public/images/`。

## 下一步

编辑这个文件并保存，浏览器中的开发页面会自动更新。准备正式发布时，将 frontmatter 中的 `draft` 改为 `false`。

