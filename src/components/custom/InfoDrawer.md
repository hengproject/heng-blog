# InfoDrawer 使用说明

`InfoDrawer.astro` 在文章中显示一个小型 `i` 按钮。点击后会从右侧打开一个覆盖式抽屉，适合放补充解释、推导、代码、图片或不希望打断正文阅读的内容。

## 文件位置

```text
src/components/custom/
├── InfoDrawer.astro
└── InfoDrawer.md
```

文章必须使用 `.mdx` 扩展名才能导入 Astro 组件。普通 `.md` 文件不能直接使用 `InfoDrawer`。

## 基础用法

在文章 frontmatter 结束后导入组件：

```mdx
---
title: 示例文章
description: InfoDrawer 示例
publishDate: 2026-07-16
category: technical
draft: true
---

import InfoDrawer from '@/components/custom/InfoDrawer.astro'

正文内容。

<InfoDrawer title='补充说明'>这里可以写 **Markdown** 内容。</InfoDrawer>
```

组件可以单独占一行，也可以放在正文句子旁边。正文页面只显示 `i` 按钮，抽屉内容不会提前占用文章布局空间。

## Props

| Prop           | 类型     | 默认值                | 作用                            |
| -------------- | -------- | --------------------- | ------------------------------- |
| `title`        | `string` | `补充说明`            | 抽屉标题                        |
| `label`        | `string` | 根据 `title` 自动生成 | `i` 按钮的 tooltip 和无障碍名称 |
| `defaultWidth` | `number` | `448`                 | 桌面端初始宽度，单位为像素      |

桌面宽度始终限制在 `320px` 到当前视口宽度的 `60%` 之间。因此传入过小或过大的 `defaultWidth` 不会破坏布局。

```mdx
<InfoDrawer title='术语说明' label='打开 Transformer 术语说明' defaultWidth={560}>
  补充内容。
</InfoDrawer>
```

## 支持的内容

### 纯文本与 Markdown

```mdx
<InfoDrawer title='背景知识'>

这里支持 **粗体**、_斜体_、[链接](https://example.com) 和列表：

- 第一项
- 第二项
- 第三项

</InfoDrawer>
```

### 代码块

````mdx
<InfoDrawer title='实现细节'>

```python
def normalize(x, mean, variance, eps=1e-5):
    return (x - mean) / (variance + eps).sqrt()
```

</InfoDrawer>
````

长代码不会撑宽移动端抽屉，代码容器会按需横向滚动。已有的代码自动折叠行为同样适用于抽屉中的代码块。

### 数学公式

当前博客已经配置数学公式渲染，因此可以直接写行内或块级公式：

```mdx
<InfoDrawer title='公式推导'>

行内公式：$y = \gamma \hat{x} + \beta$。

$$
\hat{x} = \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}}
$$

</InfoDrawer>
```

### 图片

共享图片放在 `public/images/` 后，可以使用根路径引用：

```mdx
<InfoDrawer title='结构图'>

![模型结构](/images/model-architecture.png)

</InfoDrawer>
```

文章专属图片也可以和文章放在同一目录，并按照现有 MDX 图片导入方式使用。

### 嵌套其他组件

抽屉 slot 可以接收其他 Astro/MDX 组件。先在文章中导入所需组件：

```mdx
import InfoDrawer from '@/components/custom/InfoDrawer.astro'
import { Aside, Collapse } from '@/components/user'

<InfoDrawer title='扩展阅读'>
  <Aside type='tip' title='阅读提示'>先理解输入张量的维度。</Aside>

  <Collapse title='查看完整推导'>这里放较长的推导过程。</Collapse>
</InfoDrawer>
```

避免在 `InfoDrawer` 内再嵌套另一个 `InfoDrawer`，否则会产生多层 modal 和焦点管理冲突。

## 一篇文章使用多个抽屉

同一篇 MDX 文章可以创建多个实例，每个实例独立管理标题、内容和宽度：

```mdx
<InfoDrawer title='符号说明'>这里解释符号。</InfoDrawer>

正文继续。

<InfoDrawer title='代码实现' defaultWidth={600}>
  这里放实现细节。
</InfoDrawer>
```

## 中英文内容

组件不会自动翻译内容。中文和英文文章应分别传入对应语言的 `title`、`label` 和正文：

```mdx
<!-- 中文文章 -->

<InfoDrawer title='补充说明'>中文内容。</InfoDrawer>

<!-- 英文文章 -->

<InfoDrawer title='Additional notes'>English content.</InfoDrawer>
```

这与博客现有 i18n 规则一致：翻译由对应的 `index.mdx` 和 `index-en.mdx` 文件管理，而不是由组件判断语言。

## 交互方式

桌面端：

- 点击 `i` 按钮打开；
- 拖动抽屉左边缘调整宽度；
- 聚焦左边缘分隔条后，使用 `ArrowLeft`/`ArrowRight` 每次调整 `16px`；
- 按住 `Shift` 再按方向键，每次调整 `64px`；
- `Home` 调整到最小宽度，`End` 调整到最大宽度；
- 点击关闭按钮、背景遮罩或按 `Escape` 关闭。

移动端：

- `i` 按钮使用至少 `44x44px` 的触控区域；
- 抽屉占满视口宽度，不显示宽度分隔条；
- 在标题栏向右滑动可以关闭；
- 短距离滑动会回弹，不会意外关闭；
- 正文仍可竖向滚动，代码块仍可横向滚动。

关闭后焦点会回到原来的 `i` 按钮。抽屉打开期间页面背景滚动会锁定，关闭后恢复。

## 当前示例

仓库中的实际示例位于：

```text
src/content/blog/collections/ml-basics/batch-norm-vs-layer-norm/index.mdx
```

该文章目前使用 `draft: true`，因此开发服务器可以预览，但生产构建不会发布它：

```text
http://localhost:4321/blog/batch-norm-vs-layer-norm
```

## 测试

本地 Playwright 配置使用已安装的 Chrome 浏览器：

```bash
corepack pnpm run test:e2e
```

当前测试覆盖：

- `390x844` 触摸设备上的打开、关闭和滚动；
- `44x44px` 移动端触控区域；
- 背景不透明和焦点恢复；
- `320x568` 极窄响应式布局；
- 短滑回弹、长滑关闭；
- 滑动关闭后 URL 不发生浏览器后退。

组件改动后还应执行：

```bash
corepack pnpm run check
corepack pnpm run lint:check
corepack pnpm run test:e2e
NODE_ENV=production corepack pnpm run build
```

## 常见问题

### 页面没有显示组件

确认文章扩展名是 `.mdx`，并且导入路径为：

```mdx
import InfoDrawer from '@/components/custom/InfoDrawer.astro'
```

### 开发环境返回 404

如果文章是 draft，启动服务时必须使用 development 环境：

```bash
NODE_ENV=development corepack pnpm run dev -- --host 0.0.0.0
```

### Cloudflare 构建会不会工作

会。组件只使用 Astro、浏览器原生 `<dialog>`、Pointer Events 和 CSS，没有运行时服务端依赖。文章设置为 `draft: false` 后会进入静态构建并随 Cloudflare Pages 部署。
