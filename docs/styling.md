# Styling Material UI Components

Use these guidelines whenever you modify or create MUI-based styles so the codebase remains consistent and theme driven.

## Core Principles

- Prefer the `sx` prop or the `styled` utility over inline styles to keep style declarations colocated and typed.
- Always consume values from the design system theme (`theme.palette`, `theme.spacing`, `theme.typography`) before introducing literal numbers or colors.
- Scope overrides and custom classes with descriptive names; avoid global CSS selectors unless you are extending the theme.
- Keep styling logic declarative—avoid computing styles inside render bodies when the same result can be achieved with the theme or responsive helpers.
- Centralize reusable style snippets in shared modules so components import them instead of duplicating ad-hoc rules.

## Theme Alignment

- Extend the theme via `createTheme` when introducing new tokens (colors, spacing, typography) so they are available to both `sx` props and styled components.
- For component-wide overrides, use the theme `components` key rather than scattering overrides across individual usages.
- Use responsive helpers (`{ xs: ..., md: ... }`) within `sx` to handle breakpoints instead of media queries in plain CSS.

## Composition Practices

- When combining `sx` with class-based styling, ensure precedence is explicit (`sx` runs last) and document non-obvious ordering.
- Favor small, composable style objects; extract them when multiple components share the same layout or spacing pattern.
- Leverage `Box` or `Stack` components for layout primitives instead of custom divs with duplicated flexbox rules.

## Testing and Maintenance

- Add visual regression or unit coverage (e.g., `data-testid` checks) when a style change impacts behavior or accessibility.
- Document intent with concise comments near complex overrides so future changes honor the underlying constraint.
- Run Storybook or preview builds after significant styling updates to confirm theme adherence across light and dark modes.
