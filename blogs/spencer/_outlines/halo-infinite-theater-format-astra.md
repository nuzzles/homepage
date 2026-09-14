# Reverse-engineering Halo Infinite's Theater format with Astra

Status: planning archive. The final post is prepared for publication on September 14, 2026.

Post: [2026-09-14-halo-infinite-theater-format-astra.md](../_posts/2026-09-14-halo-infinite-theater-format-astra.md).

The notes below preserve the original brief and research. The final post uses an interactive Octagon replay with a data download instead of the planned recording; the older TODOs and proposed outline do not describe its publication status.

## Premise, reader, and payoff

Astra helped Spencer decode enough of Halo Infinite's Theater replication data to reconstruct matches after repeated failed attempts with earlier models, including Opus 4.8. Controlled recordings made hypotheses testable. A digital twin let Spencer inspect the reconstruction as the person who played the game and pass observations back to AI.

Write for a technical audience interested in reverse engineering, binary formats, game tooling, and AI-assisted research. Explain the experiment and show inspectable evidence. Keep the model comparison grounded in Spencer's experience, rather than treating it as a controlled benchmark or a claim that no other model could solve the task.

The replay was a verification tool. The underlying motivation was four potential applications:

1. Training AI to play Halo Infinite.
2. Training a machine-learning classifier to detect cheating.
3. Reconstructing matches for broadcasts, including esports events.
4. Producing heatmaps from death data.

These applications remain opportunities, not completed products or demonstrated model capabilities.

## Opening and structure

1. **Author-written opening.** Preserve Spencer's prose through the early digital twin video. It introduces Den, the four motivations, zlib decompression, the human/AI discovery loop, and the first replay.
2. **Octagon demonstration.** Keep the TODO after that video, including manually added bounds and the requirement to match the selected recording.
3. **Giving AI fewer ways to be wrong.** Explain the human contribution: consistent starting conditions, a do-nothing baseline, isolated actions, the automatic 60-second match limit, and a reusable corpus. Distinguish the match-end event from the end of the file and connect clock decoding to a narrower search interval.
4. **From film files to player inputs.** Place the Mermaid hierarchy here, after explaining the experimental controls. Walk from chunk roles through the 16-byte packet header to variable, bit-packed state updates. Use the short movement-input table to show how a control disproved the padding interpretation. The detailed walking-frame example below is retained for a future deeper walkthrough.
5. **What's Next.** Combine spatial tracks with Den's events, finish recorded armor customization and connect it to models, and integrate real 3D assets and placements through Ekur. A faithful 1:1 reconstruction is Spencer's proposed destination, not a claim that the current twin or importer already achieves it.

## Required visuals and remaining work

### Octagon replay: highest-priority TODO

- [ ] Record a short digital twin sequence from **Octagon gameplay → Octagon · First to 50**, with both players present. The research notes place the second player's first spawn at film time 146.19 seconds; select the actual sequence after checking the current replay.
- [ ] Show movement, aim, supported combat activity, and a death or respawn that Spencer can verify.
- [ ] Add the Octagon bounds manually in post-production. Identify and align the correct Octagon: the early controls and first-to-50 game used different maps.
- [ ] State visibly that the bounds were added manually and that map geometry and obstacles have not been reconstructed. This editing supplies spatial context, not evidence that geometry was decoded.
- [ ] If original gameplay footage is available, synchronize a comparison. Its availability is not yet established.
- [ ] Add the final video or embed, accessible description, and caption to the draft.

Suggested caption: "Player movement and supported actions reconstructed from Theater data. Octagon bounds added manually in post-production; map geometry and obstacles have not been reconstructed."

### Film breakdown

The draft now includes a read-only hex/ASCII viewer beside the decompression explanation. The generic `_includes/hex-viewer.html` takes only `text` (hex bytes), `title`, and `description`; the post supplies its zlib example from `_data/halo_theater_hex.json`. There is no hardcoded Halo sample or status subheader in the component. The supplied description identifies the real 4,096-byte registry excerpt as recompressed for the demo. It has no file import, download, or standalone-viewer links. This is separate from the frame-field breakdown below.

- [x] Show film chunks: registry (type 1), replication (type 2), and summary events (type 3). The reusable `mermaid.html` include renders `assets/diagrams/halo-theater-structure.mermaid` in the draft.
- [x] Diagram a replication packet's 16-byte header and variable payload. The unknown header word stays labeled unknown; the diagram distinguishes chunk types from packet types and qualifies the frame layout.
- [ ] Use the checked 21-byte walking frame: clock 37 bits, player record 97 bits, entity-chain end 3 bits, input prefix and axes 25 bits, unparsed tail 6 bits. This is one observed layout, not a universal frame grammar.
- [ ] Let the reader inspect actual fields across byte boundaries and switch to the consecutive captured frame. The clock advances and Y changes while X, Z, and forward input remain unchanged.
- [ ] Preserve a static fallback and link the source evidence. Checked boundaries and guards must not be colored as fully understood semantics.

The conversation prototype uses the two captured examples from `FILM_MOTION.md`. It is available locally at [halo-film-breakdown.html](/Users/simbleau/.codex/visualizations/2026/09/13/01a098e7-4c6a-7542-8f5e-cc97ea3e1473/halo-film-breakdown.html). It has not been integrated into the blog. Recheck it against the chosen source revision before integration.

### Retained walking-frame example

The revised post uses the input-control table to keep the main argument moving. Preserve these details for the planned frame inspector or a deeper follow-up, rather than reinserting the full byte walkthrough by default.

```text
First: a0 7b 42 07 ec 40 08 80 64 0f fa 5f fb eb 49 8f e8 40 37 e7 c0
Next:  a0 7b 42 07 f4 40 08 80 64 0f fa 5f fa 6b 49 8f f0 40 37 e7 c0
```

| Region                         | Bit offset |  Length |
| ------------------------------ | ---------: | ------: |
| Clock record                   |          0 | 37 bits |
| Player record                  |         37 | 97 bits |
| Entity-chain end               |        134 |  3 bits |
| Input prefix and movement axes |        137 | 25 bits |
| Unparsed tail                  |        162 |  6 bits |

MSB-first, zero-based offsets; this is one observed layout. Between these frames the counter advances 253 → 254 and raw Y changes 16375 → 16372. X stays 16361, Z stays 109862, and input stays `(62, 31)`. These are encoded values, not meters. Source: `halo_api/experiments/FILM_MOTION.md`.

### Evidence for the revised tail

| Claim                                                        | Evidence                                                                                                                | Scope                                                                                                                                                                                                                            |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Human controls narrowed the plausible explanations           | Spencer's account; `FILM_FORMAT.md` timeline and corpus notes                                                           | Automatic match ending supplies an event anchor; button timing, loading, and the post-game tail still vary.                                                                                                                      |
| Chunk roles, 16-byte packet framing, and bit-packed updates  | `FILM_FORMAT.md`; `src/theater/packets.rs`                                                                              | Observed version-41 structure; frame grammar remains partial.                                                                                                                                                                    |
| The presumed padding contains movement input                 | `FILM_MOTION.md`, neutral and four directional controls                                                                 | Two six-bit fields; input offset 137 is specific to the illustrated walking layout.                                                                                                                                              |
| Appearance parsing already has partial results               | `FILM_APPEARANCE.md`; `THEATER_DECODER.md`                                                                              | Recorded appearance identifiers are available; the proposed work is completing coverage and using them to assemble models.                                                                                                       |
| Ekur imports Spartans, Forge objects, and some map data      | [Ekur README at 5d896f](https://github.com/TheHaloArchive/ekur/blob/5d896f3b7bfa47a76afe4342ffefb39f110cf920/README.md) | Read on 2026-09-13. Forge-map and level importers are experimental; built-in levels omit materials and props. Gamertag import uses the current Spartan, not a historical loadout. GPL-3.0 license also checked at this revision. |
| Real game assets could support a faithful 1:1 reconstruction | Spencer's stated objective, informed by the decoder and Ekur                                                            | Framed as the author's belief about future integration. Full visual/gameplay fidelity has not been demonstrated.                                                                                                                 |

## Claims and evidence

| Claim                                                            | Evidence                                                                                                                                                                    | Scope or remaining work                                                                                                                           |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Earlier models failed in Spencer's attempts; Astra made progress | Author's account, including Opus 4.8                                                                                                                                        | Keep personal; add an example from retained transcripts if available. Do not invent elapsed time, cost, or a benchmark.                           |
| Den inspired the experiments and supplied pre-work context       | Author's account and [Den's film article](https://den.dev/blog/extracting-stats-film-files-halo-infinite/)                                                                  | Published September 15, 2024. Credit its zlib, bit-alignment, event-extraction, and controlled-experiment groundwork.                             |
| Den joined Anthropic                                             | [His announcement](https://den.dev/blog/anthropic/)                                                                                                                         | January 11, 2026. Do not imply his employer was involved in the Halo investigation.                                                               |
| Controlled actions expose position and input fields              | [FILM_MOTION.md](/Users/simbleau/git/halo_api/experiments/FILM_MOTION.md), [films.csv](/Users/simbleau/git/halo_api/experiments/films.csv)                                  | Opposing directions, jumping, checked boundaries, repeated counters, and a separate recording group support the interpretation.                   |
| The natural match ending provides a timing anchor                | Author's account and [FILM_FORMAT.md](/Users/simbleau/git/halo_api/experiments/FILM_FORMAT.md)                                                                              | The film also includes startup and post-game time. An automatic match limit does not imply identical film durations or exact human action timing. |
| A useful reconstructed replay exists                             | [FILM_OCTAGON.md](/Users/simbleau/git/halo_api/experiments/FILM_OCTAGON.md), [FILM_BANDIT.md](/Users/simbleau/git/halo_api/experiments/FILM_BANDIT.md), author verification | Select and record the reader-visible example. Visual inspection supplements structural checks; it does not prove complete decoding.               |
| Supported projectiles use recorded paths                         | [FILM_PROJECTILE_MOTION.md](/Users/simbleau/git/halo_api/experiments/FILM_PROJECTILE_MOTION.md)                                                                             | Partial paths. No inferred explosion position, grenade type, or simulated trajectory.                                                             |
| Full map geometry and obstacles remain missing                   | Author's account and [FILM_MAP_ASSETS.md](/Users/simbleau/git/halo_api/experiments/FILM_MAP_ASSETS.md)                                                                      | External metadata and object placements exist, but they do not supply complete meshes or collision geometry.                                      |

Research measurements above were read from retained notes. The two example frame payloads were independently extracted during intake; the full decoder/corpus checks have not been rerun for this post.

## Attribution and factual boundaries

- Den's article credits Andy Curtis and SPNKr. Keep that attribution if expanding the history. The author also mentioned Grunt, but its relevant work and URL still need verification before inclusion.
- Prefer "the furthest public writeup I had found" to claims that Den was the last person to try or that nobody else progressed further.
- Later notes credit [LevelUp](https://github.com/JGtm/LevelUp/tree/cf333a3889771c6462dfce9e1bc287a897043a47/apps/go-api/internal/analysis/filmdec) and [Blam-Network/blf](https://github.com/Blam-Network/blf/tree/ea02ce095f17e9fe10b00695b4641f0209423ef0). Preserve these contributions for velocity, coordinates, and projectile details; establish their place in the chronology before making novelty claims.
- Outer zlib compression was already documented by Den. The breakthrough concerns interpretation of the decompressed replication stream. Preserve early uncertainty about encryption as uncertainty, not a finding that encryption was present or broken.
- "Delta" means updates to selected state/components here. Do not imply every coordinate is numerically encoded as a difference from its previous value.
- Prefer supported movement, aim, projectile, and combat observations to "all combat buttons": ping, grenade selection, complete input coverage, hit outcomes, damage, inventory, and other semantics are not all established.
- Historical corpus sizes differ: the notes describe an original 26-film investigation and a later active catalog of 32 films. The author initially recalled roughly 20 clips. Avoid a count unless tied to a specific phase.
- Use current topic-specific notes when older summaries retain superseded findings. Do not repeat retracted record lengths, padding assumptions, or unresolved calibration as facts.

## SEO and publication

- **Title:** Reverse-engineering Halo Infinite's Theater format with Astra
- **Primary query hypothesis:** Halo Infinite Theater file format
- **Related terms:** reverse engineering, replay parser, AI-assisted reverse engineering
- **Slug:** `halo-infinite-theater-format-astra`
- **Description:** How I used controlled recordings, Astra, and a reconstructed replay to decode Halo Infinite's Theater format and check the results against gameplay.
- **Categories:** `ai reverse-engineering`
- **Preview image:** Proposed frame breakdown or representative Octagon replay still. Use accurate alt text and identify manually added bounds if visible. Until an asset is ready, inherit the configured site image.
- **Links:** Den's two posts and the decoder repository; source specific technical sections where useful. No internal post is required just to add an internal link.
- **Timing:** Date undecided. The initial draft omits an explicit publication date; set it and the dated filename together when moving to `_posts`.

The draft belongs in `_drafts`; this outline lives in `_outlines` so Jekyll does not publish the planning material. Repository development/staging builds include drafts; production builds exclude them.
