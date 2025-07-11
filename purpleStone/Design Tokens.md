# 🎨 ServerHeaven Design Tokens

This document outlines the design tokens and visual standards for the ServerHeaven application, ensuring a consistent and high-quality user experience across all screens. The design is based on a futuristic, clean, and minimalist "Gaming HUD" aesthetic.

---

## 1. Color Palette

Our color palette is built around a dark theme with vibrant emerald green highlights to create a modern and engaging interface.

### 1.1. Primary & Accent Colors

| Token Name    | Hex Value                                       | Tailwind Class     | Usage                                        |
| :------------ | :---------------------------------------------- | :----------------- | :------------------------------------------- |
| **Primary**   | `emerald-500` (#10B981)                         | `bg-emerald-500`   | Main call-to-action buttons, key highlights. |
| **Primary Gradient** | `emerald-500` to `emerald-600`           | `bg-gradient-to-r` | Primary buttons for a richer look.           |
| **Highlight** | `emerald-400` (#34D399)                         | `text-emerald-400` | Highlighted text, icons, borders.            |
| **Secondary Accent** | `cyan-400` (#22D3EE)                        | `text-cyan-400`    | Secondary effects, like the glitch effect.   |

### 1.2. Neutral & Background Colors

| Token Name         | HSL Value          | Tailwind Class        | Usage                                               |
| :----------------- | :----------------- | :-------------------- | :-------------------------------------------------- |
| **Background**     | `hsl(0 0% 3.9%)`   | `bg-background`       | Main application background.                        |
| **Foreground**     | `hsl(0 0% 98%)`    | `text-foreground`     | Primary text color (white).                         |
| **Muted Foreground** | `hsl(0 0% 63.9%)`  | `text-muted-foreground` | Secondary or descriptive text (gray).             |
| **Border**         | `hsl(0 0% 14.9%)`  | `border-border`       | Standard borders for layout elements.               |

### 1.3. Full Emerald Scale

A full range of emerald shades is available for depth and variation.

| Name          | Hex       |
| :------------ | :-------- |
| `emerald-300` | `#6EE7B7` |
| `emerald-400` | `#34D399` |
| `emerald-500` | `#10B981` |
| `emerald-600` | `#059669` |
| `emerald-700` | `#047857` |
| `emerald-800` | `#065F46` |
| `emerald-900` | `#064E3B` |
| `emerald-950` | `#022C22` |

---

## 2. Typography

We use two primary font families to distinguish between standard UI text and the HUD-style elements.

| Font Family | Tailwind Class | Usage                                                |
| :---------- | :------------- | :--------------------------------------------------- |
| **Sans Serif**  | `font-sans`    | Body text, paragraphs, and standard interface copy.  |
| **Monospace**   | `font-mono`    | Headers, buttons, labels, and all HUD-like elements. |

---

## 3. Effects & Styles

These custom classes and tokens define the unique HUD and glassmorphism aesthetic.

### 3.1. Glassmorphism

Apply these classes to create frosted glass effects.

| Class Name      | Effect                               | Border Color                 |
| :-------------- | :----------------------------------- | :--------------------------- |
| `.glass`        | `10px` backdrop blur, subtle background. | `rgba(52, 211, 153, 0.2)`    |
| `.glass-strong` | `20px` backdrop blur, stronger background. | `rgba(52, 211, 153, 0.3)`    |

### 3.2. HUD Panels

The `.hud-panel` class is the standard for all container elements, cards, and modal dialogs.

- **Background**: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))`
- **Filter**: `backdrop-filter: blur(15px)`
- **Border**: `1px solid rgba(52, 211, 153, 0.3)`
- **Box Shadow**: Combines a dark outer shadow with a subtle inner glow.
- **Hover State**: Border color and shadows become more prominent.

### 3.3. Shadows & Glows

Use these `box-shadow` utilities to add glowing effects, primarily to buttons and interactive elements.

| Tailwind Class   | Value                                                              | Usage                                 |
| :--------------- | :----------------------------------------------------------------- | :------------------------------------ |
| `shadow-glow-sm` | `0 0 10px rgba(52, 211, 153, 0.3)`                                 | Subtle glow for small elements.       |
| `shadow-glow`    | `0 0 20px rgba(52, 211, 153, 0.4)`                                 | Standard glow effect.                 |
| `shadow-glow-lg` | `0 0 30px rgba(52, 211, 153, 0.5)`                                 | Prominent glow for primary CTAs.      |
| `shadow-hud-active` | `0 0 25px rgba(52, 211, 153, 0.6), inset 0 0 15px rgba(52, 211, 153, 0.2)` | Hover/active state for HUD panels. |

### 3.4. Text & Special Effects

| Class Name        | Effect                                  | Usage                                     |
| :---------------- | :-------------------------------------- | :---------------------------------------- |
| `.hud-text-glow`  | `text-shadow: 0 0 10px rgba(52, 211, 153, 0.6)` | Apply to headings for a glowing effect.     |
| `.glitch`         | An animated, multi-colored text effect.   | Use sparingly on key hero words (e.g., "FIND"). |

---

## 4. Animation

Subtle animations bring the interface to life.

| Animation Class      | Keyframes                  | Speed / Easing                          | Usage                                            |
| :------------------- | :------------------------- | :-------------------------------------- | :----------------------------------------------- |
| `animate-fade-in`    | `fadeIn`                   | `1s ease-in`                            | For elements appearing on screen.                |
| `animate-pulse-slow` | `pulse`                    | `3s cubic-bezier(0.4, 0, 0.6, 1) infinite` | Fading effects for background particles.         |
| `animate-scanner`    | `scanner`                  | `4s linear infinite`                    | The vertical scanning line in the background.    |
| `animate-hud-blink`  | `hud-blink`                | `2s ease-in-out infinite`               | Blinking effects for status indicators.          |

---

## 5. Components & Borders

### 5.1. Border Radius

| Tailwind Class | Value                  | Usage                        |
| :------------- | :--------------------- | :--------------------------- |
| `rounded-sm`   | `calc(0.5rem - 4px)`   | Small interactive elements.  |
| `rounded-md`   | `calc(0.5rem - 2px)`   | Medium-sized components.     |
| `rounded-lg`   | `0.5rem`               | Cards and larger containers. |

### 5.2. Scrollbar

A custom, themed scrollbar is applied globally for a cohesive look.

- **Track**: `rgba(0, 0, 0, 0.3)`
- **Thumb**: `linear-gradient(180deg, rgba(52, 211, 153, 0.6), rgba(16, 185, 129, 0.6))`

---
This living document should serve as the single source of truth for the ServerHeaven UI. It will be updated as the design system evolves.
[[Sistema de Autenticação e Perfis]]
[[Sistema de Servidores]] 