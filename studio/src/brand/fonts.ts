import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Fonts are local files in public/fonts/ so renders are deterministic and work
 * offline. Remotion waits for every loadFont() before rendering a frame.
 *
 * When the brand fonts arrive: copy the licensed files to public/brand/fonts/,
 * add loadFont() calls below, and update brand.type in tokens.ts.
 * Inter stays as the stand-in for phone/OS system UI (SF Pro and Segoe UI are
 * not licensed for this use). Inter and JetBrains Mono are SIL OFL 1.1.
 */
export const interFamily = 'Inter';
export const monoFamily = 'JetBrains Mono';

loadFont({family: interFamily, url: staticFile('fonts/Inter-Variable.woff2'), weight: '100 900', format: 'woff2'});
loadFont({family: monoFamily, url: staticFile('fonts/JetBrainsMono-400.woff2'), weight: '400', format: 'woff2'});
loadFont({family: monoFamily, url: staticFile('fonts/JetBrainsMono-600.woff2'), weight: '600', format: 'woff2'});

/** Font used inside recreated phone and OS interfaces. */
export const systemUiFamily = `${interFamily}, system-ui, sans-serif`;
