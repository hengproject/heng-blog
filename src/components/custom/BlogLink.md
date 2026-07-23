# BlogLink 使用说明

`BlogLink.astro` 用于从一篇博客文章跳转到站内另一篇文章。与普通 Markdown 链接相比，它会在构建时自动读取目标文章的标题、摘要、分类和日期。

## 基础用法

```mdx
import { BlogLink } from '@/components/custom'

<BlogLink slug='transformer-encoder' />
```

`slug` 是目标文章的 URL slug，也就是 `/blog/transformer-encoder` 中的 `transformer-encoder`。也可以传入完整站内路径：

```mdx
<BlogLink slug='/blog/transformer-encoder' />
```

## 自定义引导文案

```mdx
<BlogLink slug='transformer-decoder' label='下一篇：Decoder' />
```

## 只显示标题

需要更紧凑的跳转时，可以隐藏摘要：

```mdx
<BlogLink slug='transformer-input-embedding' showDescription={false} />
```

## Props

| Prop              | 类型      | 默认值     | 说明                         |
| ----------------- | --------- | ---------- | ---------------------------- |
| `slug`            | `string`  | 必填       | 目标文章 slug 或站内博客路径 |
| `label`           | `string`  | `继续阅读` | 卡片顶部的引导文案           |
| `showDescription` | `boolean` | `true`     | 是否显示文章摘要             |
| `class`           | `string`  | -          | 附加样式类                   |

## 中英文文章

组件会根据当前页面语言读取对应的内容集：

- 中文页面读取 `index.mdx`。
- 英文页面读取 `index-en.mdx`。

如果目标语言的文章不存在，构建会失败，而不是悄悄跳转到另一种语言。

## Draft 与构建检查

开发环境允许链接到 draft 文章，卡片会显示 `Draft`。生产构建中，如果已发布页面使用 `BlogLink` 指向 draft 或不存在的文章，构建会直接失败，防止发布无效链接。

`BlogLink` 不请求网络，不抓取 Open Graph；它只读取项目内的 Astro 内容集。外部网址预览仍应使用 `LinkPreview`。
