# Dark Mode Implementation Plan

## Goal

Add dark mode support to the personal website that activates automatically based on the user's system/browser setting, without changing the layout, spacing, typography, navigation, or overall design structure.

## Current State

The site is an Astro + Tailwind project.

Relevant files:

- `astro.config.mjs`
- `tailwind.config.cjs`
- `src/layouts/Layout.astro`
- `src/components/Profile.astro`
- `src/pages/[...page].astro`
- `src/pages/about.astro`
- `src/pages/posts/[year]/[slug].astro`
- `src/pages/404.astro`
- `src/styles/global.css`
- `src/styles/markdown.css`

The current Tailwind config contains the deprecated setting:

```js
darkMode: false,
```

With the installed Tailwind version (`3.4.14`), `false` behaves the same as media-query mode and produces a build warning. Replace it with the explicit `"media"` setting to document the intended behavior and remove the warning.

Astro's Shiki configuration currently uses the light-only `solarized-light` syntax theme. Shiki emits inline background and token colors, so ordinary Tailwind background/text utilities cannot make highlighted code blocks dark.

Most other colors are currently hard-coded using light-mode Tailwind utility classes such as:

- `bg-gray-50`
- `text-gray-700`
- `text-gray-600`
- `text-gray-500`
- `text-green-500`

Markdown content colors are centralized in `src/styles/markdown.css`.

## Implementation Strategy

Use Tailwind's media-query-based dark mode.

This means dark mode will be controlled by the user's operating system or browser preference via `prefers-color-scheme: dark`.

No theme toggle, client-side JavaScript, local storage, or layout changes are required.

Declare support for both color schemes so browser-managed UI follows the selected theme. Configure Shiki with matching light and dark themes so code blocks do not remain bright in dark mode.

## Steps

### 1. Enable Tailwind dark mode

Update `tailwind.config.cjs`:

```js
darkMode: "media",
```

instead of:

```js
darkMode: false,
```

This explicitly enables Tailwind `dark:*` variants based on system settings and removes the warning caused by the deprecated `false` value.

### 2. Add root-level color scheme, background, and default foreground

Update `src/styles/global.css` so the full browser canvas follows the selected color scheme and unclassified text never falls back to black in dark mode.

Suggested change:

```css
@layer base {
  html {
    @apply bg-gray-50 dark:bg-gray-950;
    color-scheme: light dark;
  }

  body {
    @apply bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300;
  }

  a {
    background-image: none;
  }
}
```

Applying the background to both `html` and `body` avoids white gutters and overscroll/root-canvas flashes. The inherited body foreground is a safe fallback; component-specific classes can still override it.

### 3. Update the main layout shell

Update `src/layouts/Layout.astro`.

Current main wrapper:

```astro
<div class="max-w-3xl mx-auto bg-gray-50 min-h-screen px-8">
```

Suggested:

```astro
<div class="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-950 min-h-screen px-8">
```

Also update header text colors:

```astro
<div class="text-gray-700 dark:text-gray-100 font-extrabold text-3xl">
```

```astro
<div class="text-gray-500 dark:text-gray-400 font-semibold text-lg">
```

### 4. Update profile component colors

Update `src/components/Profile.astro`.

Suggested changes:

```astro
<p class="font-medium text-gray-700 dark:text-gray-100 text-md">{name}</p>
```

```astro
<strong class="text-gray-600 dark:text-gray-300 italic text-sm">{shortIntro}</strong>
```

The social icons use monochrome external Simple Icons SVGs. Make them visible on dark backgrounds by adding `dark:invert`:

```astro
class="mr-2 mb-0 w-5 dark:invert"
```

```astro
class="ml-2 mb-0 w-5 dark:invert"
```

Verify both remote assets load and remain legible after inversion. Replacing them with local SVGs would improve reliability but is outside this task's scope.

### 5. Update home page colors

Update `src/pages/[...page].astro`.

Suggested mappings:

```astro
class="text-gray-700 dark:text-gray-100 font-semibold text-2xl"
```

```astro
class="text-gray-500 dark:text-gray-400 text-sm"
```

Use a darker green in light mode and a brighter green in dark mode so the small tag text can meet contrast requirements:

```astro
class="flex text-green-700 dark:text-green-400 text-sm"
```

Pagination links:

```astro
class="text-gray-600 dark:text-gray-300 font-semibold text-sm"
```

### 6. Update about page colors

Update `src/pages/about.astro`.

Suggested wrapper:

```astro
<div class="flex flex-col w-full pt-8 px-4 space-y-4 text-gray-600 dark:text-gray-300 font-semibold">
```

Suggested heading:

```astro
<h1 class="font-bold text-gray-600 dark:text-gray-100 text-3xl">Hi,</h1>
```

No copy, spacing, or layout changes should be made as part of this task.

### 7. Update blog post page colors

Update `src/pages/posts/[year]/[slug].astro`.

Suggested title:

```astro
<h1 class="text-2xl font-medium text-gray-600 dark:text-gray-100">{post.data.title}</h1>
```

Suggested date:

```astro
<p class="font-medium text-gray-500 dark:text-gray-400 text-sm mr-4">{formattedDate}</p>
```

Suggested divider:

```astro
<hr class="border-gray-400 dark:border-gray-700 h-0.5" />
```

Suggested back link:

```astro
<a class="text-gray-600 dark:text-gray-300 font-semibold text-sm" href="/">&larr; Back</a>
```

### 8. Update 404 page colors

Update `src/pages/404.astro`.

Suggested changes:

```astro
<h1 class="text-4xl font-bold text-gray-700 dark:text-gray-100">404: Not Found</h1>
```

```astro
<p class="text-gray-600 dark:text-gray-300">You just hit a route that doesn't exist... the sadness.</p>
```

```astro
<a class="text-gray-600 dark:text-gray-300 font-semibold text-sm" href="/">&larr; Go back home</a>
```

### 9. Add dual-theme Shiki syntax highlighting

Update `astro.config.mjs`. A CSS class on `pre` is insufficient because Shiki emits inline background and token colors. Configure Shiki to emit both light and dark theme variables:

```js
markdown: {
  syntaxHighlight: "shiki",
  shikiConfig: {
    themes: {
      light: "solarized-light",
      dark: "solarized-dark",
    },
  },
},
```

Then switch the emitted Shiki variables in `src/styles/markdown.css`:

```css
@media (prefers-color-scheme: dark) {
  .markdown .shiki,
  .markdown .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
```

The `!important` declarations are intentional because they must override Shiki's generated inline light-theme styles. Confirm the generated HTML exposes these variables after the configuration change.

### 10. Update markdown content styles

Update `src/styles/markdown.css` so rendered blog content is readable in both modes. Let Shiki control syntax colors and code-block backgrounds; use Tailwind only for code-block layout and sizing.

Suggested changes:

```css
.markdown pre {
  @apply overflow-x-auto rounded p-4 my-4;
}

.markdown pre code {
  @apply text-xs;
}

.markdown blockquote {
  @apply border-solid border-l-4 border-gray-500 dark:border-gray-600 pl-4 italic;
}

.markdown p {
  @apply text-gray-600 dark:text-gray-300;
}

.markdown ul {
  padding-left: 1.5rem;
  list-style: inherit;
  @apply text-gray-600 dark:text-gray-300;
}

.markdown ol {
  padding-left: 1.5rem;
  list-style: decimal;
  @apply text-gray-600 dark:text-gray-300;
}

.markdown h1,
.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
  @apply text-gray-700 dark:text-gray-100 font-semibold mt-6 mb-2;
}
```

Markdown links currently use a low-contrast fixed color:

```css
.markdown a {
  color: #00b7ff;
}
```

Use separate light and dark values, and verify both against the final backgrounds:

```css
.markdown a {
  color: #0369a1;
}

@media (prefers-color-scheme: dark) {
  .markdown a {
    color: #38bdf8;
  }
}
```

## Color Mapping Guide

| Light mode | Dark mode |
| --- | --- |
| `bg-gray-50` | `dark:bg-gray-950` |
| `text-gray-700` | `dark:text-gray-100` |
| `text-gray-600` | `dark:text-gray-300` |
| `text-gray-500` | `dark:text-gray-400` |
| `border-gray-400` / `text-gray-400` | `dark:border-gray-700` |
| `text-green-700` | `dark:text-green-400` |

## Constraints

Do not change:

- Layout structure
- Spacing
- Font sizes
- Font weights, unless needed for readability
- Content copy
- Routing
- Analytics behavior
- Markdown rendering structure

Do not add:

- A manual theme toggle
- Client-side theme JavaScript
- Local storage
- New dependencies

## Validation

### Build and preview

Run:

```bash
npm run build
npm run preview
```

The build should complete without the Tailwind `darkMode: false` warning. Inspect generated post HTML to confirm Shiki emits both light and dark theme variables.

Use browser DevTools to emulate both `prefers-color-scheme: light` and `prefers-color-scheme: dark`. Verify at desktop and narrow mobile widths rather than relying only on a system-wide theme switch.

Verify the following pages:

- Home page
- About page
- A blog post containing several fenced code blocks
- 404 page, using a nonexistent URL through the preview server

Check specifically:

- Root canvas, main background, page gutters, and overscroll areas
- Header links and keyboard focus indicators
- Profile card text
- Both externally hosted social icons, including their inverted dark appearance
- Blog title/date
- Markdown paragraphs, headings, lists, blockquotes, and links
- Inline code
- Syntax-highlighted Java, Python, C, shell, and JSX blocks
- Code-block background, token contrast, keyboard focus, and horizontal overflow
- Pagination/back links

The site currently has fewer than the ten posts required to render pagination. Validate pagination classes by code inspection, or temporarily add uncommitted fixture posts for visual testing.

### Contrast acceptance criteria

- Normal text and links should meet WCAG AA contrast of at least **4.5:1**.
- Large text should meet at least **3:1**.
- Focus indicators must remain clearly visible in both modes.
- Pay particular attention to small gray metadata, green tags, markdown links, and syntax-highlighted tokens.

## Expected Outcome

The site should automatically render in dark mode when the user's system preference is dark, while preserving the existing layout and visual structure. The implementation should be limited to color-related Tailwind classes, CSS updates, and the Shiki theme configuration in `astro.config.mjs`.
