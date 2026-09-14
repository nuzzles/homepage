---
layout: post
title: "Reverse-engineering Halo: Infinite's Theater films"
description: "How I used controlled recordings, Astra, and a reconstructed replay to decode Halo Infinite's Theater format and check the results against gameplay."
date: 2026-09-14
categories: ai rust
stylesheets:
    - /assets/css/halo-theater.css
image:
    path: /assets/halo-infinite-theater.png
    width: 1080
    height: 573
    alt: Halo Infinite Theater replay with a match timeline, event markers, and playback controls
---

With frontier AI companies [announcing solutions to problems such as Navier–Stokes](https://openai.com/index/navier-stokes-solution/), I still hadn't successfully solved a problem with AI I had been attempting for the past year. My problem, with much lower stakes, was to decode the opaque binary mess that is Halo Infinite's Theater clips.

If you are unaware of what Halo: Infinite is, it's a multiplayer video game in the [Halo](<https://en.wikipedia.org/wiki/Halo_(franchise)>) franchise. If you are unaware of what _Theater_ is, it's a feature of Halo that allows you to replay and scrub the timeline of a game you played.

![Halo Infinite Theater replay with a match timeline, event markers, and playback controls]({{ '/assets/halo-infinite-theater.png' | relative_url }})

Many smart people have tried decoding Halo Infinite's film files, including [Den](https://den.dev/about/), a lead maintainer of [Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) who now works at [Anthropic](https://den.dev/blog/anthropic/).

The data is high value; I can name at least four possibilities with plain-text Theater data:

1. Train a machine-learning classifier to detect cheating.
2. Reconstruct a post-match 3D digital twin of esports gameplay for live events and analysis (Halo Studios, reach out).
3. Build heatmaps from death data.
4. Train an AI to play Halo Infinite.

## Prior Art

I was inspired by [Den's September 2024 investigation into Halo Infinite film files](https://den.dev/blog/extracting-stats-film-files-halo-infinite/). He gave us a head start with several findings on film data, such as how to find and download it and extract information from the file (gamertags, kills, and deaths).

However, he ended his investigation with several important unknowns:

- Time-series player positions
- Time-series player camera pitch and yaw
- Projectiles (e.g. grenades)
- Player shields and health
- Player inputs (e.g. melee, jump)
- Player armor/customization
- Player respawns

Etcetera.

I decoded enough of these to reconstruct player movement, aim, and combat activity, with partial armor customization data too. Astra was the first model to get me this far after repeated attempts with earlier models. I will explain how I got the data behind the embed below.

{% include motion-replay.html file="/assets/motion-replay/octagon.html" download="/assets/motion-replay/octagon.json.gz" start=146.2 title="Halo: Infinite Theater Toy - Octagon" description="Recorded movement and combat activity from an Octagon match. Models and animations are illustrative; the Octagon walls are placeholders." %}

## The Start

[Den's writeup](https://den.dev/blog/extracting-stats-film-files-halo-infinite/) is great, but his reverse engineering methodology was evidently painful, manual, and required special intuition. For example, Den made a connection when looking at a heap of binary containing the bytes `78 5E` and recognized them as an indicator of `zlib` Fast Compression. I would have _never_ recognized that. Den clearly has some tribal knowledge; only on a good day could I recognize a hint of `==` Base64 padding. This was the moment that made me believe if I was to decode a Theater film file, I would need LLM assistance.

Decompression alone doesn't turn the film into plain text, but it makes structures such as component names visible. Compare the compressed bytes below with the **Decompressed** view.

{% assign zlib_example = site.data.halo_theater_hex %}
{% include hex-viewer.html text=zlib_example.text title=zlib_example.title description=zlib_example.description %}

## Methodology

My approach was to give GPT-6 Astra a controlled comparison. Each experiment started with two clips:

1. **Record a control.** Start a custom game on an empty Forge plane and do nothing: no movement, aiming, or button presses.
2. **Record one changed input.** Repeat the setup as closely as possible, but perform one action, such as pressing melee once.

Repeating this process gave me a corpus of films, each made to isolate a particular input. I gave Astra the clips and the prior research, then had it probe the binary for patterns, write code to extract them, and test each interpretation against the other recordings.

From the start, I asked Astra to build both a 3D digital twin and packet inspector so I could verify its findings. I had played the clips. I could scrub the replay, check whether the movement and actions matched what I did, and feed specific corrections back to Astra.

{% include mermaid.html file="/assets/diagrams/halo-feature-discovery-loop.mermaid" title="AI + Human discovery loop" description="Blue: Human. Green: AI. Each experiment compares a do-nothing control with a clip containing one changed input." %}

The first major breakthrough was the game clock. That let us narrow the search to when I performed an action. Jumping, melee, shooting, grenade throws, and more followed quickly after.

<figure class="evidence-figure video-figure">
    <video
        controls
        playsinline
        preload="none"
        poster="{{ '/assets/early-twin-poster.jpg' | relative_url }}"
        width="1920"
        height="1106"
        aria-label="Early digital twin replay"
        aria-describedby="early-twin-caption"
    >
        <source src="{{ '/assets/early-twin.webm' | relative_url }}" type="video/webm" />
        <source src="{{ '/assets/early-twin.mp4' | relative_url }}" type="video/mp4" />
        Your browser does not support embedded video. <a href="{{ '/assets/early-twin.mp4' | relative_url }}">Watch the early digital twin replay.</a>
    </video>
    <figcaption id="early-twin-caption">An early digital twin showing reconstructed player movement, aim, and match events while I scrub the timeline. Map geometry is absent.</figcaption>
</figure>

This loop generalized so well I was able to decode the movement and combat features I needed from `ChunkType` `2` (the replication stream). These chunks contain the small state updates that happen in a game. We will talk more about structure below, but when things got complicated, I had AI generate a second experimental tool: a recording inspector.

<figure class="evidence-figure packet-inspector-figure">
    <img
        src="{{ '/assets/halo-packet-inspector.png' | relative_url }}"
        alt="Theater Lab packet inspector showing a packet list, color-coded hex bytes, decoded header fields, and unparsed regions."
        width="3526"
        height="2040"
        loading="lazy"
        decoding="async"
    />
    <figcaption>The early packet inspector linked raw bytes to decoded fields and kept unknown regions visible.</figcaption>
</figure>

One of the added benefits of a recording inspector was measurement: I showed both the packet structure and percentages for how much of a film or packet was known and unknown.

## Advice, if you dare

One of my biggest contributions was reducing the surface area of change in the films. If you follow up on this work, or want to do something similar, I want to provide some suggestions.

First, timing. Timing needed its own control. Theater starts recording before everybody finishes the loading screen, and that wait varies between games. Manually ending a match adds another variable. An instruction like "I pressed melee five seconds in" doesn't identify a consistent location in two different files. Hence, I made a custom game mode that ended automatically after 60 seconds. That gave me a consistent match-end event to work backward from. My button presses still had human timing error, but it made the surface area of bytes to parse through smaller. This is also why I went after the clock first. This made searching relevant intervals easier in the data.

The next part was understanding where to look. A film manifest lists separately compressed chunks. After zlib decompression, those chunks have three different roles: a component registry, a replication stream, and summary events. Movement and input research centered on the replication stream. I never spent time trying to decode the component registry, but it likely tells the replay system which components belong to each entity type and in what order, helping it interpret the updates in the replication stream.

Below is a look at the high-level structure of films. I am working on upstreaming a parser into my Halo: Infinite Rust API crate, [`halo_api`](https://github.com/nuzzles/halo_api), and you can follow the progress on [my PR](https://github.com/nuzzles/halo_api/pull/5).

{% include mermaid.html file="/assets/diagrams/halo-theater-structure.mermaid" title="From film to frame" description="Observed structure in film version 41. Blue follows the replication data; dashed boxes mark partly decoded sections. The frame layout shows checked cases, not a complete grammar." %}

What I do know is each replication packet starts with a 16-byte header containing its type, payload length, timestamp, and two bytes whose meaning is still unknown. The length tells the parser where the next packet begins. Chunk types and packet types are separate: a type-2 chunk contains packets with their own type numbers. Inside a type-0 packet, the frame data is bit-packed. Updates arrived at roughly 60 Hz in the controlled recordings, but each frame could update a different selection of entity components. Record lengths vary, and a field could start halfway through a byte. A "delta" here means an update to selected state; a position field can still contain coordinate values rather than a numerical difference from the previous position.

## What's Next

I will finish upstreaming a working Halo: Infinite film parser. Once my data parser is complete, I will likely go after map geometry and attempt to make a polished digital twin far better than the vibe-coded toy in this blog's demos. At the time of writing, there appears to be prior art done in _[Ekur](https://github.com/TheHaloArchive/ekur)_, an open-source Blender importer for Spartans and Forge objects, with experimental support for Forge maps and built-in multiplayer levels. That gives us a route to the actual assets. The integration work is to use the correct map revision, object placements, scale, and coordinate system, then apply the recorded movement and aim.
