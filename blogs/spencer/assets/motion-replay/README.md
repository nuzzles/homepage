# Motion replay export

`octagon.html` is a generated, self-contained export from `halo_api`'s motion replay.
It contains one decoded first-to-50 match, the existing renderer, and local Three.js.
The exporter also writes `octagon.json.gz`, a compressed, byte-for-byte copy of the
decoded source JSON. Both files are refreshed by the same command.
The Jekyll include takes `file`, `title`, and `description`, with optional `download`
and initial `start` and `end` in seconds:

```liquid
{% include motion-replay.html file="/assets/motion-replay/octagon.html"
   download="/assets/motion-replay/octagon.json.gz"
   start=146.2
   title="Octagon motion replay · preview"
   description="Schematic players with placeholder Octagon walls." %}
```

The include supplies the blog base path, lazy loading, a sandboxed iframe, and an 11px
caption. When `download` is provided, a download link appears below the toy in the
caption; the JSON is fetched only when requested. Only the viewport and playback timeline are visible. Readers cannot import another
file or navigate to the lab. Each iframe is independent. Playback needs no parent script,
data fetch, or lab server. The post's `motion-replay/embed.js` adds an expand/collapse
button without reloading the iframe or resetting playback. It uses native fullscreen
where available and a fixed viewport on mobile browsers without that API.
JavaScript and WebGL are required; the early video in the
post remains available as a fallback. The asset is marked `noindex`.

## Rebuild from the homepage repository

```sh
node ../halo_api/experiments/examples/build_decoded_replay.cjs --embed \
  --octagon-walls --fixed-loadout 'Bandit EVO,S7 Sniper' --blog-fonts public/fonts \
  ../halo_api/experiments/films/octagon/03-first-to-50/decoded-film.json \
  --output blogs/spencer/assets/motion-replay/octagon.html
pnpm exec prettier --write blogs/spencer/assets/motion-replay/octagon.html
```

Edit the renderer in `halo_api/experiments/examples/theater_viewer/`, then re-export.
Make behavior changes in the exporter source, then format the generated HTML with
the repository's Prettier command above. The export includes the renderer's MIT notice and
the Three.js MIT license. Its data uses the same presentation adapter as the full
viewer; no position samples are synthesized for the blog. Solid trails show the past
10 seconds and dashed trails the next 10, each 5 CSS pixels wide, clipped to the playback window and current
life, with gaps preserved. Recorded velocity arrows are visible. Health occupies
the left 25% of one bar in red, with shields in the right 75%. Values are numeric:
unknown health displays as 126 and unknown shields as 64, with full bars; decoded
values remain unknown underneath. Death displays zero and empty bars
and struck-through names on player cards. The bottom-left feed says who killed whom;
the followed player's card stays at the top center. The bottom-right score counts recorded kills through the
playhead, including before the configured start. Raw diagnostic panels are hidden.

Articulated Spartan models have distinct Bandit EVO and S7 Sniper shapes. The export
uses an explicitly fixed loadout: each life starts with Bandit, weapon-set changes
toggle the displayed weapon, and confirmed shots reconcile its identity. These swaps
are inferred from change timestamps; the export does not decode their selected slot.
Missing changes can leave a wrong inferred weapon until a shot corrects it. Cards
and models share the same timeline; tooltips and `presentation.heldWeapon` identify
the source, while raw decoded observations remain unchanged. Recoil, melee,
grenade, reload, crouch, and walking poses are illustrative and deterministic at
each timestamp. They are not imported game models or decoded joint animations.
The Octagon recording has no grenade or reload events.

The embed's optional start/end bounds are set only in code. The blog starts at
146.2 seconds and continues to the film's end, so both players are present initially.
Visible controls are play/pause, a touch-draggable scrubber, and a camera selector
labeled Nuzzles, timesknightt, and Map. The player names select an over-shoulder view;
Map selects the overview. Nuzzles is the default. There are no
range, playback-speed, loop, or origin-axis controls. Playback runs at 1× and stops
at the end. The floor and grid render separately to avoid depth flicker.
The blog's Barlow font files and OFL license are bundled; the viewer makes no font requests.

## Sample provenance

- Recording: `octagon/03-first-to-50` in the local `halo_api` corpus.
- Match ID: `9a875c4e-03bc-4fff-a688-e21216d1618b`.
- Source: `experiments/films/octagon/03-first-to-50/decoded-film.json`.
- Source SHA-256: `33bf62c4359397b5d45ef2e3edbc335f1570d6c542395a0d10d415ce1074a813`.
- Schema 1, film major version 41; duration 435.745 seconds, two players, 50 lives each.
- Refreshed after the motion/input boundary fixes: 24,283 position samples and
  21,310 aim samples. Includes 5,098 recovered positions; the 100 ms freshness
  threshold remains unchanged.
- `halo_api` base revision: `1401af602b6999fca49a5daba0cb6b03aa439fd3`, plus the local
  parser fixes and single-file embed changes. These changes have not been committed or published.

This is a working preview with eight illustrative Octagon walls fitted around recorded
player positions. Those walls are not imported map or collision geometry, and do not
affect replay positions. The post identifies these presentation limits alongside the embed.
