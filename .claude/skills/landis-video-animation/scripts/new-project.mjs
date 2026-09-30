#!/usr/bin/env node
// Scaffold a new video project:
//   studio/src/projects/<slug>/storyboard.json + scenes.tsx (registered in registry.ts)
//   projects/<slug>/{reference,analysis,output}/ + brief.md
//
//   node new-project.mjs --slug ms-authenticator --title "Set up Microsoft Authenticator"
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {args, projectDir, studioDir} from './lib.mjs';

const a = args();
if (!a.slug || !a.title || !/^[a-z0-9][a-z0-9-]*$/.test(a.slug)) {
  console.error('Usage: new-project.mjs --slug <kebab-case> --title "<Video title>"');
  process.exit(1);
}
const slug = a.slug;
const code = path.join(studioDir, 'src', 'projects', slug);
if (existsSync(code)) {
  console.error(`Project ${slug} already exists at ${code}`);
  process.exit(1);
}
const camel = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

mkdirSync(path.join(code, 'screens'), {recursive: true});
writeFileSync(
  path.join(code, 'storyboard.json'),
  JSON.stringify(
    {
      slug,
      title: a.title,
      subtitle: '',
      fps: 30,
      transitionSec: 0.5,
      burnCaptions: false,
      chapters: [],
      scenes: [
        {id: 's01-title', component: 'Title', durationSec: 4, narration: '', props: {eyebrow: 'How-to', title: a.title, subtitle: ''}},
        {id: 's99-end', component: 'End', durationSec: 5, narration: ''},
      ],
    },
    null,
    2,
  ) + '\n',
);
writeFileSync(
  path.join(code, 'scenes.tsx'),
  `import React from 'react';
import {ChapterCard, EndCard, TitleCard} from '../../overlays/Cards';
import type {SceneMap, SceneProps} from '../../timeline/types';

// Scene components for "${a.title}". One component per storyboard "component" key.
// Recreated app/OS screens live in ./screens/, one file per screen.

const Title: React.FC<SceneProps> = (p) => (
  <TitleCard eyebrow={p.eyebrow as string} title={p.title as string} subtitle={p.subtitle as string} />
);
const Chapter: React.FC<SceneProps> = (p) => (
  <ChapterCard number={p.number as number} title={p.title as string} subtitle={p.subtitle as string} />
);
const End: React.FC<SceneProps> = () => <EndCard />;

export const ${camel}Scenes: SceneMap = {Title, Chapter, End};
`,
);

const reg = path.join(studioDir, 'src', 'projects', 'registry.ts');
let r = readFileSync(reg, 'utf8');
r = r.replace(
  '// @new-project-imports',
  `import ${camel}Storyboard from './${slug}/storyboard.json';\nimport {${camel}Scenes} from './${slug}/scenes';\n// @new-project-imports`,
);
r = r.replace(
  '  // @new-project-entries',
  `  {storyboard: ${camel}Storyboard as Storyboard, scenes: ${camel}Scenes},\n  // @new-project-entries`,
);
writeFileSync(reg, r);

const pd = projectDir(slug);
for (const d of ['reference', 'analysis', 'output']) mkdirSync(path.join(pd, d), {recursive: true});
const brief = path.join(pd, 'brief.md');
if (!existsSync(brief)) {
  writeFileSync(
    brief,
    `# ${a.title}

Fill this in (or have Claude draft it from the conversation) before storyboarding.

## Audience
Who is watching, what device they most likely have, how technical they are.

## Scope
- In: 
- Out: 

## Environment assumptions
Account type (work/school vs personal), tenant policies (number matching, passkeys enabled...), OS versions shown.

## Reference clips
| File | What it shows | Notes |
|---|---|---|

## Demo identities (fictional; never real customer data)
- User: 
- Tenant/org name: 
- Domain: 

## Must include / must avoid

## Open questions
`,
  );
}
console.log(`Created project "${slug}".
  code:       ${code}
  inputs:     ${path.join(pd, 'reference')}  (drop reference recordings here)
  brief:      ${brief}
  composition id: ${slug}`);
