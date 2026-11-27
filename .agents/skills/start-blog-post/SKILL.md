---
name: start-blog-post
description: Interview Spencer, critique and iterate on an outline until he approves it, then create a writing brief and a Hugo draft with human-writing placeholders. Use when starting or scoping a new post; use blog-writing for drafting, revising, or reviewing established prose.
---

# Start Blog Post

Help Spencer articulate the post he wants to write. Extract the experiences, judgments, and technical details only he can supply; do the editorial and SEO synthesis yourself. The default result is a writing brief and a Hugo draft outline for Spencer to fill in, with `TODO - Human writing` in every section. Scrutinize and revise the proposed outline with him until he explicitly approves it before creating the post scaffold. Write prose only when he requests it.

## Start with what is already known

Read [the blog writing standard](../blog-writing/references/writing-standard.md) before proposing titles, hooks, or metadata. Use the current conversation, supplied notes, and relevant repository artifacts to prefill the brief. Inspect `blog/hugo.json` and related posts when choosing categories, links, and image defaults. The repository supplies the author, English language, site URL, and publishing conventions; do not ask Spencer to repeat them.

Use the interview to establish the outline Spencer wants to write: the point of the post, the sections he wants, and their order. If the conversation already supplies these, use those answers and ask only about consequential gaps. Complete notes can shorten the interview, but do not replace approval of the proposed outline.

## Interview in short rounds

Ask one to three related questions at a time, starting with the largest uncertainty. Use the available conversational question tool when appropriate, or ordinary questions when it is unavailable. Let the user answer before asking the next dependent round. Continue independent reading or research while awaiting an answer.

Prefer plain questions about the work over marketing terminology. Accept rough notes and stream-of-consciousness answers. Reflect back the emerging point and proposed section order briefly so the user can correct them. Ask which ideas or sections must be included or excluded before settling an outline when his preferences are still unknown. Skip questions already answered; follow up when an answer is too broad to guide the post. Do not present this whole coverage list as a questionnaire.

Establish the following, adapting the order and depth to the post:

| Area                    | What to learn from the author                                                                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Point and motivation    | What happened, what did you build or learn, and why write about it now? What is the one thing you want to say?                                                                                                 |
| Reader and payoff       | Who is this for, what do they already know, and what problem or question brings them here? What should they understand, do, or reconsider afterward?                                                           |
| Distinctive angle       | What did you observe or try firsthand? What does your experience add to existing explanations? What common advice, expectation, or alternative does it complicate?                                             |
| Hook material           | What concrete scene, failure, result, surprising detail, or unresolved question best captures the point? What was at stake, and what actually happened?                                                        |
| Argument and limits     | Which claims matter most? What examples support them? Where does the argument stop applying, and what would a knowledgeable reader reasonably challenge?                                                       |
| Evidence and visuals    | Which sources, code, measurements, screenshots, diagrams, or demos exist, and where can they be found? What still needs collecting or checking?                                                                |
| Scope and voice         | Is this a tutorial, build report, argument, announcement, or something else? What must be included or left out? Are there phrases, jokes, or strong opinions to preserve, or details that should stay private? |
| Discovery and next step | What might the intended reader type into search? Are there related posts or explanations they already encounter? Is there a useful next action, project link, or resource to leave them with?                  |

These are coverage prompts, not mandatory questions. Do not demand a contrarian angle, commercial call to action, deadline, benchmark, or target word count when the post does not need one. Infer a suitable length from the promised payoff; ask about format or timing when it changes the work.

For a vague idea, a useful first round is: “What do you want to say, who do you want to reach, and what happened that made you want to write it?” With detailed notes, start at the missing claim, evidence, or reader decision instead.

## Turn answers into editorial decisions

Separate author-supplied facts from your proposals and unresolved questions. Never turn a suggested hook into an invented memory, dialogue, number, quotation, or result.

- Distill a one-sentence premise, a specific reader problem, and the promised payoff. If the material supports several posts, suggest a focused first post and explain what belongs elsewhere.
- Propose a small set of distinct titles and opening hooks when the angle is still unsettled. Recommend one and explain how the post will deliver on its promise. A hook should reach the subject immediately and use the author's actual material; avoid generic scene-setting and exaggerated novelty.
- Build a compact claim-to-evidence map. For each major claim, record its scope, source or artifact, reader-visible evidence where relevant, and any gap. For measurements, ask for the environment, workload, baseline, method, and limitations that affect interpretation. For demos, establish the behavior to demonstrate and available source or reproduction details.
- Narrow unsupported claims, identify them as opinion or hypothesis when appropriate, or record the specific evidence still needed. The intake can finish with an evidence plan; do not describe an unsupported claim as verified or the post as ready to publish.
- Outline only the sections needed to deliver the payoff, based on the interview. Give each section its job and supporting example or artifact in the brief. Distinguish proposed headings from sections the author requested, and resolve consequential outline choices with him. Preserve the author's voice using a few of their own useful phrases.

## Scrutinize the outline and iterate until approval

Treat the first outline as a proposal. Review it as an editor, rather than simply arranging every idea the author mentions:

- Does the sequence deliver the title's promise and a clear payoff for the intended reader?
- Does each section advance the story or argument? Identify repetition, tangents, missing transitions, and conclusions that do not follow from the preceding material.
- Are central claims grounded in the author's experience or an explicit evidence plan? Challenge unsupported leaps and distinguish observations from predictions or opinions.
- Is the scope practical for one post, and does the opening reach the subject quickly enough?

Present the complete proposed outline with each section's purpose and supporting material or evidence gap, followed by a concise critique of the most consequential weaknesses. Recommend concrete changes such as cutting, merging, reordering, or reframing sections. Ask focused questions about unresolved choices, use the answers to revise, and show the updated outline with a short explanation of what changed. Repeat this review-and-revision loop until Spencer explicitly approves the current outline; do not rubber-stamp it or prolong it for optional polish after approval.

Ask for approval of the concrete outline when it is ready for a decision. Answers to interview questions, individual edits, silence, or a general request to start a post are not outline approval. Do not create the post scaffold or begin prose drafting before that approval. Once approved, use that outline without asking again. Apply later changes explicitly requested by Spencer; bring agent-proposed material changes to its premise, scope, or section order back for approval. Outline approval does not mean the unfinished post is ready to publish.

## Derive SEO from the reader's intent

Do not require the user to know keyword research, write a meta description, or choose a slug. Translate the reader's question and the author's angle into a concrete recommendation:

- Identify the primary search intent and a natural primary query, plus a few related questions or terms only where useful. For a personal update, announcement, or opinion post, prioritize an accurate title and useful description without forcing a high-volume keyword strategy.
- When current search results or competing coverage would materially change the angle, research them with available tools. Cite the sources and distinguish observed coverage from inference. Without research, label query choices as editorial hypotheses; never invent search volume, difficulty, rankings, or traffic forecasts.
- Recommend a specific, honest title, a short descriptive slug, and a unique standalone description, usually about 120–160 characters. Use the important topic terms naturally. Avoid rigid title character limits, keyword stuffing, or promises the evidence cannot support.
- Choose a few accurate categories using existing repository conventions. Suggest relevant internal links and primary external sources with a purpose for each; do not invent URLs or add links mechanically.
- Include an Open Graph image plan using the guidance below: choose the generated post template or a relevant custom image, with the source and alt text when known.

Follow the linked writing standard for front matter. Keep proposed search queries in the brief rather than introducing unsupported metadata fields. Record the publication date as undecided unless supplied or already implied by the task. Let the existing Hugo templates generate canonical URLs, social tags, and structured data.

## Plan the blog Open Graph image

Use the existing Hugo image pipeline described in [Blog sharing images](../../../docs/blog-development.md#blog-sharing-images). Include an image decision in every brief:

- **Choose useful artwork.** Prefer actual screenshots, metrics, gameplay, or other visuals from the post when they make its subject recognizable in a small sharing card. Preserve source images and factual content. When custom artwork adds little, use the generated title-and-portrait card. Record missing assets as proposed; producing an image is not required to finish an intake brief.
- **Keep the shared styling.** Blog images are 1200×630 PNGs. Use the warm-neutral colors from `src/design-tokens.css`, Source Serif 4 for titles and the author name, and DM Sans for metadata and the original black IM monogram. Keep titles free of underlines and omit a bottom-right domain label.
- **Reuse the author footer.** Every card, including photos and screenshots, has the shared black IM and Spencer Imbleau name over a warm gradient fading upward from the bottom. Use `blog/assets/opengraph/footer.png` through `blog/layouts/partials/opengraph/image.html`; avoid a solid footer band or baking a second footer into custom artwork.
- **Configure the source correctly.** Store custom artwork in `blog/assets/` and set the post's `image` front matter with its `/assets/...` path, source `width` and `height`, and descriptive `alt`. Hugo crops it to 1200×630 and adds the footer. A custom image replaces the template's title and portrait; compose a readable serif title into it unless the author chooses image-only artwork, and keep that text in sync with the post. For generated title cards, `opengraph: { title: "Shorter image title" }` changes only the artwork title.
- **Review the actual output.** When creating artwork, build or serve Spencer's blog and inspect the generated PNG at full size and at a small sharing-preview size, starting at 320px wide. Preserve the useful subject and readable title without cropping key details or adding thick side borders. Display the image at its native aspect ratio without letterboxing. Confirm Open Graph, X, and article structured data use the same image URL and correct dimensions. When the user requests approval, show rendered proposals before applying them; retain any selection already made.

Record the template/custom choice, source or proposed subject, crop, alt text, and any unresolved author selection in the brief. The implementation notes own build commands and resource details; use the existing templates rather than adding a separate sharing-image system.

## Deliver the brief and human-writing outline

Complete the intake once Spencer has explicitly approved the outline, the reader, premise, payoff, and grounded opening direction are clear, and the major claims have evidence or an explicit plan. Do not prolong the interview for optional polish. If the user asks to proceed with incomplete answers, produce a provisional brief and outline with visible assumptions and precise gaps for his approval; avoid filling missing facts with plausible prose.

Provide a concise brief in the conversation, or save it at the requested location when the user wants a file. Include:

- **Premise and reader:** the main point, intended reader, starting knowledge, payoff, and scope.
- **Title and hook:** the recommended title and opening direction, with alternatives only if still useful.
- **Outline:** the necessary sections and the evidence or example each will use.
- **Claim and evidence map:** supported claims, sources and artifact paths, visuals or demos, limitations, and missing evidence.
- **SEO proposal:** search intent, primary query and any research basis, slug, description, categories, useful links, preview image plan, and publication timing if known.
- **Author notes and open decisions:** phrases to preserve, constraints, next action for the reader if relevant, and unresolved questions that materially affect drafting or publication.

Clearly distinguish confirmed facts, editorial recommendations, and unknowns. After outline approval, unless the user asks for a brief only, create the approved outline in `blog/content/posts/` using the repository's Hugo conventions:

- Set `draft: true`, retain the chosen title, and include a stable `url`, description, and appropriate categories and tags. For an undecided publication date, use today's date as a working date in both the filename and front matter, and note in the brief that it is provisional.
- Turn the interview's outline into descriptive `##` headings, using `###` only where needed. Put the exact standalone text `TODO - Human writing` in every section and planned subsection, including the opening. The page title comes from front matter; do not duplicate it as a Markdown heading.
- Leave the body for Spencer to write. Keep section purposes, author notes, evidence gaps, and suggested examples in the brief or short HTML comments alongside the relevant placeholder. Do not turn interview notes into finished paragraphs or invent experiences to fill a section.
- Use the generated Open Graph template unless a custom image is chosen, and record that decision in the brief. Follow the image guidance above when producing artwork.
- Check formatting and build the draft in a local preview. Confirm the outline renders and a normal production build excludes it from public pages, feeds, stats, and the sitemap. Follow repository validation requirements before opening a PR.

Deliver the draft path with the concise brief and any unresolved decisions. Keep unfinished posts as drafts. If the user explicitly requests prose and has approved the outline, continue using [blog-writing](../blog-writing/SKILL.md) with this brief and the requested scope; an ordinary request to start a post means the human-writing outline above.
