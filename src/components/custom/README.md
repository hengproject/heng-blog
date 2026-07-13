# Custom components

Put personal components for Heng's Blog in this directory. Import them directly, for example:

```astro
import ResearchProfile from '@/components/custom/ResearchProfile.astro'
```

Keep reusable upstream theme primitives in the existing component directories. This boundary
reduces merge conflicts when changes are brought in from the original theme.
