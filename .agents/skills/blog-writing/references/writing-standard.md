# Spencer's Blog Writing Standard

## Voice observed in the existing posts

Spencer writes as a builder reporting from inside the work. The strongest recurring pattern is:

1. state the concrete problem or experience;
2. explain only the technical context needed to follow it;
3. show the artifact, data, code, or demo;
4. say what happened and what remains unresolved.

Keep these traits:

- first person when the work or judgment is Spencer's;
- direct openings such as a problem, result, invitation, or short question;
- active voice, contractions, and ordinary English around precise technical nouns;
- short paragraphs and descriptive headings that let readers scan;
- concrete code, screenshots, plots, diagrams, recordings, citations, and runnable demos;
- honest qualifiers when a conclusion is bounded by a benchmark, platform, sample, or personal experience;
- occasional dry or sideways humor, used once and then left alone;
- short conclusions that state what is next rather than re-summarizing the post.

The voice can be raw without being careless. Older spelling or grammar errors are not style. Correct mistakes while retaining cadence and deliberate informality.

## What to avoid

- essay-style throat clearing, formal thesis announcements, and broad scene-setting;
- generic transitions such as “Moreover,” “In conclusion,” or “It is important to note”;
- inflated novelty, performance, or universality claims;
- corporate polish, promotional superlatives, and calls to “unlock” or “leverage” ideas;
- explaining familiar concepts longer than the post needs;
- three restatements of a point that landed the first time;
- forced jokes, recurring bits, or whimsy in every heading;
- invented quotations, measurements, citations, personal memories, or certainty;
- turning a short useful post into a comprehensive guide without being asked.

## Proofreading policy

Use American English and the author's existing technical terminology. Fix:

- grammar, spelling, punctuation, agreement, tense, and malformed comparisons;
- accidental sentence fragments, duplicated words, and unclear pronouns;
- incorrect capitalization of names, platforms, APIs, and technologies;
- ambiguous claims whose intended correction is evident from context;
- broken Markdown, Liquid, footnotes, links, and code-fence language tags.

Do not silently change technical meaning. Flag uncertain factual corrections, substantial restructuring, softened claims, or deleted humor. Do not “smooth” every sentence into uniform editorial prose.

## Claims, evidence, and reader-visible artifacts

Create a claim inventory for any substantive post. For each major claim, identify:

- the exact claim and its scope;
- the primary source, measurement, implementation, or observation supporting it;
- the graphic or demo through which a reader can inspect the evidence;
- the relevant environment, version, date, sample, units, axes, baseline, and limitations.

Graphical evidence must communicate rather than decorate. Give plots labeled axes and units, screenshots enough context to orient the reader, and diagrams legends when symbols are not obvious. Explain in nearby prose what the reader should notice without overstating what the artifact proves.

For benchmarks, retain the raw results or reproducible procedure when practical. State hardware, software versions, workload, sample size, aggregation, and comparison baseline when those details affect the conclusion.

For interactive demos, provide controls, compatibility requirements, an accessible fallback or recording when practical, and a source link. Test the claimed behavior rather than assuming an embed works.

Use primary documentation, papers, source repositories, and first-party data ahead of summaries. Link a source at the claim it supports. Add attribution and license information for third-party visuals and modified assets.

## Jekyll and SEO conventions

Every post needs front matter shaped like this, with optional fields included only when used:

```yaml
---
layout: post
title: "A specific, human title"
description: "A concise standalone description of the post and its value."
date: YYYY-MM-DD
modified: YYYY-MM-DD
categories: rust graphics
image:
    path: /assets/representative-image.png
    width: 1280
    height: 640
    alt: A specific description of the preview image
---
```

Apply these rules:

- Make the filename date and `date` agree. Use `modified` only for a meaningful later revision.
- Write a unique description that reads naturally in search results, usually about 120–160 characters. Do not reuse another post's description.
- Use a small number of stable, accurate categories; they also contribute post keywords.
- Use a representative page image when one exists. Otherwise rely on the configured site-wide social image.
- Keep exactly one clear page title and a logical heading hierarchy beneath it.
- Use descriptive link text and image alt text; do not stuff keywords into either.
- Link to relevant earlier posts or the canonical homepage when useful, not mechanically.
- Let `jekyll-seo-tag`, the shared head include, and `jekyll-sitemap` generate canonical URLs, social metadata, author data, and sitemap entries.

For a production check from the repository root, use the pinned bundle and build the Spencer source to a temporary destination, then inspect the generated `<head>` and sitemap. A full profile build is appropriate when post assets or shared site integration changed.

## Ready-to-publish checklist

- The opening reaches the subject immediately.
- The post earns its length; no section exists merely to sound complete.
- Grammar and spelling are clean without erasing Spencer's cadence.
- Every major claim has a credible source and reader-visible evidence or is explicitly bounded.
- Plots, diagrams, screenshots, and demos are interpretable, tested, accessible, and attributed.
- Code and commands are correct for the stated versions and environment.
- Title, description, dates, categories, optional image metadata, heading structure, and links are correct.
- The English-only post builds successfully and appears in the generated sitemap.
