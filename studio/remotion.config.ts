import {Config} from '@remotion/cli/config';

// Compositions are authored at 1920x1080. Drafts render at --scale=1 (1080p),
// finals at --scale=2 (3840x2160). Chrome re-rasterizes at the higher device
// scale factor, so text, SVG and CSS stay sharp at 4K.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setPixelFormat('yuv420p');

// Optional: point Remotion at an existing Chrome/Chromium headless shell
// instead of letting it download one (useful in locked-down environments).
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
