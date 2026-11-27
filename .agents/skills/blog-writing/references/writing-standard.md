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

## Avoid formulaic AI prose

Spencer wants writing that readers skeptical of AI prose will still want to read. Apply these rules to proposed titles, hooks, outlines, guidance, drafts, revisions, and editorial suggestions. Never introduce the stock patterns below to make his writing sound more polished, profound, or persuasive. Review your own proposed wording before presenting it.

| Pattern to avoid                                                                                                                                                 | Editing direction                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Stock contrasts: “It's not X, it's Y,” “not just X, but Y,” “less about X, more about Y,” or a clipped “X. Not Y.”                                               | State the intended point directly. Explain a real technical comparison through its actual differences and consequences.  |
| Repeated parallel clauses, three-part slogans, and adjective triplets such as “powerful, seamless, and intuitive”                                                | Keep only the independently useful details; let the material determine list length and sentence structure.               |
| Artificial punchlines and question-answer hooks: “The catch?”, “The result?”, “Here's the thing,” “Let that sink in,” “Read that again”                          | Give the finding or constraint immediately. Preserve real questions that the post investigates.                          |
| Chains of dramatic fragments or one-line paragraphs; identical sentence openings and paragraph rhythms                                                           | Follow the thought in connected prose. Keep Spencer's intentional fragments and emphasis without manufacturing a rhythm. |
| Generic openings: “In today's rapidly evolving landscape,” “In an era of,” “Let's dive in,” or announcing what the article will explore                          | Open with the actual problem, observation, or event. Supply only the background needed to understand it.                 |
| Canned transitions and emphasis: “Moreover,” “Furthermore,” “It's worth noting,” “Importantly,” “At its core”                                                    | Connect ideas through their specific relationship or remove the transition.                                              |
| Decorative vocabulary: “delve,” “tapestry,” “unlock,” “leverage,” “foster,” “seamless,” “robust,” “transformative,” or “game-changing” without a precise purpose | Use familiar words and concrete behavior. Retain a term when its established technical meaning is necessary.             |
| Inflated significance: “a testament to,” “a pivotal moment,” “underscores the importance,” or tagging a fact with a grand “-ing” clause                          | State the supported effect and its scope; omit a significance claim that adds no information.                            |
| Empty abstractions, stacked modifiers, invented compound labels, and metaphors about journeys, orchestras, ecosystems, or frontiers                              | Name the actor, action, and object. Keep literal domain terms and the author's own useful imagery.                       |
| Vague authority: “experts agree,” “many people believe,” “research shows,” or treating one source as a consensus                                                 | Attribute the particular claim to an identifiable source, or identify it as Spencer's observation or judgment.           |
| Empty balance and disclaimer padding: generic “both sides,” “challenges and opportunities,” “it depends,” or repeated caveats                                    | Explain the specific tradeoff or uncertainty once. Preserve qualifications that affect correctness.                      |
| Thesaurus variation: renaming the same system in each paragraph, or replacing plain “is” and “has” with ornate phrases                                           | Repeat the accurate name when helpful and use simple verbs. Consistent technical terminology matters.                    |
| Automatic bold lead-ins, emoji, title-case headings, decorative tables, and turning all prose into bullets                                                       | Use sentence-case headings and ordinary paragraphs; use lists and tables when their structure helps the reader.          |
| Em dashes and parenthetical asides used repeatedly to manufacture drama                                                                                          | Choose punctuation that fits the sentence. Do not remove the author's punctuation mechanically or impose a quota.        |
| Repeated mini-summaries, “In conclusion,” “Ultimately,” “the future is bright,” and a compulsory lesson or call to action                                        | End when the point has landed, with an actual result, unresolved question, or next step if useful.                       |
| Overfamiliar reassurance, flattery, invented confessions, and borrowed authenticity such as “if I'm being honest”                                                | Use only the author's supplied experience and attitude; do not add emotion or praise to simulate a personal voice.       |

Also avoid explaining familiar concepts beyond the reader's needs, forced jokes in every heading, and chatbot residue such as “Certainly,” “Here is the revised version,” or “I hope this helps” inside the article. Keep the intentional TODOs in an unfinished outline; resolve them through human writing or an explicit drafting request before publication.

These are editorial preferences and recurring complaints, not proof of authorship. Reader reactions vary, and no finite checklist can guarantee acceptance. Do not use detector scores, intentional mistakes, slang, or random sentence variation to make text appear human. Improve the actual writing and preserve Spencer's voice. Quoted material, code, and established technical names must remain accurate; do not rewrite them merely because they contain a listed word or pattern.

Before suggesting an edit, check its meaning, factual support, and cadence against the author's surrounding prose. Remove filler, repeated conclusions, and unsupported emphasis from your proposal. If a sentence already works, leave it alone. In proofreading, flag substantial voice or structure changes separately; do not replace the author's distinctive language wholesale.

Sources consulted for this editorial guidance:

- Colin Gorrie, [“Why ChatGPT writes like that”](https://www.deadlanguagesociety.com/p/rhetorical-analysis-ai), July 9, 2025: a linguistic analysis of repeated parallelism, antithesis, and three-part constructions.
- [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), consulted November 26, 2026: an evolving editor-maintained catalog of examples, including inflated significance, superficial analysis, vague attribution, and formulaic structure. Its Wikipedia-specific formatting rules do not apply to this Markdown blog, and its observations are not a universal detection test.

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

## Hugo and SEO conventions

Every post needs front matter shaped like this, with optional fields included only when used:

```yaml
---
title: "A specific, human title"
description: "A concise standalone description of the post and its value."
date: YYYY-MM-DD
lastmod: YYYY-MM-DD
categories: [rust, graphics]
image:
    path: /assets/representative-image.png
    width: 1280
    height: 640
    alt: A specific description of the preview image
---
```

Set a stable `url` for each post. Preserve migrated URLs, including their category/date paths and `.html` suffix. Use `draft: true` for unfinished work in `content/posts/`. See [blog development](../../../../docs/blog-development.md) for setup and shortcodes.

Apply these rules:

- Make the filename date and `date` agree. Use `lastmod` only for a meaningful later revision.
- Write a unique description that reads naturally in search results, usually about 120–160 characters. Do not reuse another post's description.
- Use a small number of stable, accurate categories; they also contribute post keywords.
- Use a representative page image when one exists. Otherwise rely on the configured site-wide social image.
- Keep exactly one clear page title and a logical heading hierarchy beneath it.
- Use descriptive link text and image alt text; do not stuff keywords into either.
- Link to relevant earlier posts or the canonical homepage when useful, not mechanically.
- Let the shared Hugo head template and sitemap renderer generate canonical URLs, social metadata, author data, and sitemap entries.

For a production check from the repository root, run `pnpm setup:hugo` and `HOMEPAGE_SITE=spencer pnpm build`, then inspect the generated `<head>` and sitemap. A full profile build is appropriate when post assets or shared site integration changed.

## Ready-to-publish checklist

- The opening reaches the subject immediately.
- The post earns its length; no section exists merely to sound complete.
- Grammar and spelling are clean without erasing Spencer's cadence; proposed edits have passed the formulaic-prose review above.
- Every major claim has a credible source and reader-visible evidence or is explicitly bounded.
- Plots, diagrams, screenshots, and demos are interpretable, tested, accessible, and attributed.
- Code and commands are correct for the stated versions and environment.
- Title, description, dates, categories, optional image metadata, heading structure, and links are correct.
- The English-only post builds successfully and appears in the generated sitemap.
