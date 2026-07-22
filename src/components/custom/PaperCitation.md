# PaperCitation 使用说明

`PaperCitation.astro` 用于在 MDX 文章中展示一篇论文的标准引用信息。它不请求 arXiv、Crossref 或其他外部 API，所有内容都来自文章中传入的 props。

## 基础用法

```mdx
import { PaperCitation } from '@/components/custom'

<PaperCitation
  title='Attention Is All You Need'
  authors={[
    'Ashish Vaswani',
    'Noam Shazeer',
    'Niki Parmar',
    'Jakob Uszkoreit',
    'Llion Jones',
    'Aidan N. Gomez',
    'Łukasz Kaiser',
    'Illia Polosukhin'
  ]}
  venue='NeurIPS'
  year={2017}
  arxiv='1706.03762'
  pdf='https://arxiv.org/pdf/1706.03762'
  code='https://github.com/tensorflow/tensor2tensor'
/>
```

`authors` 可以是作者数组，也可以是已经排版好的字符串。

## 添加论文说明

默认 slot 可以放 Markdown，适合写论文与当前文章的关系：

```mdx
<PaperCitation
  title='Deep Residual Learning for Image Recognition'
  authors={['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun']}
  venue='CVPR'
  year={2016}
  doi='10.1109/CVPR.2016.90'
>
  ResNet 通过残差连接缓解深层网络的优化问题。
</PaperCitation>
```

## Props

| Prop          | 类型                 | 必填 | 说明                             |
| ------------- | -------------------- | ---- | -------------------------------- |
| `title`       | `string`             | 是   | 论文标题                         |
| `authors`     | `string \| string[]` | 是   | 作者或作者列表                   |
| `year`        | `string \| number`   | 否   | 发表年份                         |
| `venue`       | `string`             | 否   | 会议、期刊或预印本平台           |
| `url`         | `string`             | 否   | 标题链接，未填时优先使用 DOI     |
| `doi`         | `string`             | 否   | DOI 或完整 DOI URL               |
| `arxiv`       | `string`             | 否   | arXiv ID 或完整 arXiv URL        |
| `pdf`         | `string`             | 否   | PDF 链接                         |
| `code`        | `string`             | 否   | 代码仓库链接                     |
| `citation`    | `string`             | 否   | 覆盖组件自动生成的可复制引用文本 |
| `links`       | `{ label, href }[]`  | 否   | 附加资源链接                     |
| `copyLabel`   | `string`             | 否   | 复制按钮文案，默认为 `复制引用`  |
| `copiedLabel` | `string`             | 否   | 复制成功文案，默认为 `已复制`    |

## 自定义引用格式

组件的自动引用是便于阅读的通用格式，不是严格的 APA、MLA 或 BibTeX。需要精确格式时，传入 `citation`：

```mdx
<PaperCitation
  title='Attention Is All You Need'
  authors='Vaswani et al.'
  year={2017}
  arxiv='1706.03762'
  citation='Vaswani, A., et al. (2017). Attention Is All You Need. arXiv:1706.03762.'
/>
```

## 中英文文案

英文文章可以覆盖按钮文案：

```mdx
<PaperCitation
  title='Attention Is All You Need'
  authors='Vaswani et al.'
  year={2017}
  arxiv='1706.03762'
  copyLabel='Copy citation'
  copiedLabel='Copied'
/>
```
