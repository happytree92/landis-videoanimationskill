/**
 * Brand tokens: the only place colors, type and contact details live.
 *
 * Every value marked PLACEHOLDER is a stand-in until the Landis IT design guide
 * is ingested (see the skill's references/brand.md). `render.mjs --quality final`
 * refuses to render while any PLACEHOLDER marker remains in this file.
 */

export const brand = {
  company: 'Landis IT', // PLACEHOLDER: confirm legal/display name from design guide

  colors: {
    // Core palette, from the Landis brand notes (video 1 production run).
    // Landis Blue is dominant (~80% of any frame); orange and bright blue are accents.
    primary: '#273786', // Landis Blue
    primaryDeep: '#121A45', // darkest end of the backdrop gradient
    accent: '#F7931E', // Landis Orange: step eyebrows, rules, spotlights
    accentBlue: '#3366FF', // secondary accent
    captionHighlight: '#FFC27A', // light orange for button names inside captions

    // Neutrals for stages, cards and text.
    ink: '#0E1116',
    inkSoft: '#3A4250',
    paper: '#F6F7F9',
    white: '#FFFFFF',
    // Backdrop: radial gradient #3a4fa8 -> #2a3b8c -> #1b2766 -> #121a45 (see Stage).
    stageTop: '#2A3B8C',
    stageBottom: '#121A45',
    stageGlow: '#3A4FA8',

    // Semantic.
    success: '#1DB954',
    warning: '#F5A524',
    danger: '#E5484D',
  },

  type: {
    // Brand fonts are Segoe UI Semibold (headings) and Segoe UI Regular (text).
    // PLACEHOLDER: Segoe UI is not bundled (licensing, and absent on Mac/Linux render
    // machines). Inter stands in until licensed font files are placed in public/brand/fonts.
    display: 'Inter',
    body: 'Inter',
    mono: 'JetBrains Mono',
    // Type scale in px at 1920x1080 authoring size.
    scale: {
      eyebrow: 22,
      caption: 30,
      body: 34,
      title: 64,
      hero: 104,
    },
    tracking: {
      eyebrow: '0.14em',
      title: '-0.02em',
    },
  },

  radius: {
    card: 20,
    pill: 999,
  },

  support: {
    // Shown on the end card.
    phone: '717-733-0793',
    email: 'support@landisit.com',
    url: '', // optional; the end card omits it when empty
  },

  logo: {
    // Put SVGs in studio/public/brand/. Null means "render the wordmark in text".
    // The Landis logo (black + blue lettering) does not read on navy: always place it on a
    // white panel (see the slant motif in references/brand.md). PLACEHOLDER: file not yet in repo.
    light: null as string | null, // PLACEHOLDER: e.g. 'brand/logo.png' (use on white panels)
    dark: null as string | null, // PLACEHOLDER: same file
  },
} as const;

/** Safe-area insets (px at 1920x1080). Nothing important sits outside these. */
export const safeArea = {x: 96, y: 72};
