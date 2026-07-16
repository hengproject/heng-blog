# Custom components

Put personal components for Heng's Blog in this directory. Import them directly, for example:

```astro
import ResearchProfile from '@/components/custom/ResearchProfile.astro'
```

Keep reusable upstream theme primitives in the existing component directories. This boundary
reduces merge conflicts when changes are brought in from the original theme.

## Info drawer

`InfoDrawer.astro` adds a small information button that opens an overlay drawer from the right.
The drawer accepts normal MDX children, including Markdown, code blocks, formulas, images, and
other components. On desktop its left edge can be dragged or resized with the arrow keys; on
mobile it uses the full viewport width. Swipe the mobile drawer header to the right to close it;
short swipes return the drawer to its open position.

```mdx
import InfoDrawer from '@/components/custom/InfoDrawer.astro'

<InfoDrawer title='补充说明'>这里可以写 **Markdown** 或嵌套其他 MDX 组件。</InfoDrawer>
```

| Prop           | Default       | Purpose                                     |
| -------------- | ------------- | ------------------------------------------- |
| `title`        | `补充说明`    | Drawer heading                              |
| `label`        | Derived title | Accessible label and tooltip for the button |
| `defaultWidth` | `448`         | Initial desktop width in pixels             |

The desktop width is clamped between `320px` and `60vw`. The component overlays the article, so
opening it does not reflow the reading column.

Run `corepack pnpm run test:e2e` to check the mobile touch target, narrow layout, scrolling, focus,
and swipe behavior. The local Playwright configuration uses the installed Chrome browser.
