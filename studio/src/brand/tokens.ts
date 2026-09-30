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
    // Core palette. PLACEHOLDER values: replace with exact hex from the design guide.
    primary: '#1F6FEB', // PLACEHOLDER
    primaryDeep: '#0B3D91', // PLACEHOLDER
    accent: '#2BD9A6', // PLACEHOLDER: used for success states and tap indicators

    // Neutrals for stages, cards and text.
    ink: '#0E1116',
    inkSoft: '#3A4250',
    paper: '#F6F7F9',
    white: '#FFFFFF',
    stageTop: '#1A1F29',
    stageBottom: '#0A0C10',

    // Semantic.
    success: '#1DB954',
    warning: '#F5A524',
    danger: '#E5484D',
  },

  type: {
    // PLACEHOLDER: swap for the licensed brand fonts once supplied (public/brand/fonts).
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
    // PLACEHOLDER: shown on the end card.
    phone: '(000) 000-0000', // PLACEHOLDER
    email: 'support@example.com', // PLACEHOLDER
    url: 'example.com/support', // PLACEHOLDER
  },

  logo: {
    // Put SVGs in studio/public/brand/. Null means "render the wordmark in text".
    light: null as string | null, // e.g. 'brand/logo-light.svg' for dark backgrounds
    dark: null as string | null, // e.g. 'brand/logo-dark.svg' for light backgrounds
  },
} as const;

/** Safe-area insets (px at 1920x1080). Nothing important sits outside these. */
export const safeArea = {x: 96, y: 72};
