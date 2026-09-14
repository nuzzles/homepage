---
name: start-blog-post
description: Interview Spencer to turn a new blog idea into a writing brief with a reader, angle, hook, evidence plan, outline, and SEO metadata. Use when starting or scoping a new post; use blog-writing for drafting, revising, or reviewing established prose.
---

# Start Blog Post

Help Spencer articulate the post he wants to write. Extract the experiences, judgments, and technical details only he can supply; do the editorial and SEO synthesis yourself. The result is a brief that the `blog-writing` skill can draft from without guessing the central argument or inventing personal experience.

## Start with what is already known

Read [the blog writing standard](../blog-writing/references/writing-standard.md) before proposing titles, hooks, or metadata. Use the current conversation, supplied notes, and relevant repository artifacts to prefill the brief. Inspect `blogs/spencer/_config.yml` and related posts when choosing categories, links, and image defaults. The repository supplies the author, English language, site URL, and publishing conventions; do not ask Spencer to repeat them.

If the user has already supplied enough material, synthesize it and ask only about consequential gaps. A request to draft from complete notes does not need an interview merely because the post is new.

## Interview in short rounds

Ask one to three related questions at a time, starting with the largest uncertainty. Use the available conversational question tool when appropriate, or ordinary questions when it is unavailable. Let the user answer before asking the next dependent round. Continue independent reading or research while awaiting an answer.

Prefer plain questions about the work over marketing terminology. Accept rough notes and stream-of-consciousness answers. Reflect back the emerging point briefly so the user can correct it. Skip questions already answered; follow up when an answer is too broad to guide the post. Do not present this whole coverage list as a questionnaire.

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
- Outline only the sections needed to deliver the payoff. Give each section its job and supporting example or artifact. Preserve the author's voice using a few of their own useful phrases.

## Derive SEO from the reader's intent

Do not require the user to know keyword research, write a meta description, or choose a slug. Translate the reader's question and the author's angle into a concrete recommendation:

- Identify the primary search intent and a natural primary query, plus a few related questions or terms only where useful. For a personal update, announcement, or opinion post, prioritize an accurate title and useful description without forcing a high-volume keyword strategy.
- When current search results or competing coverage would materially change the angle, research them with available tools. Cite the sources and distinguish observed coverage from inference. Without research, label query choices as editorial hypotheses; never invent search volume, difficulty, rankings, or traffic forecasts.
- Recommend a specific, honest title, a short descriptive slug, and a unique standalone description, usually about 120–160 characters. Use the important topic terms naturally. Avoid rigid title character limits, keyword stuffing, or promises the evidence cannot support.
- Choose a few accurate categories using existing repository conventions. Suggest relevant internal links and primary external sources with a purpose for each; do not invent URLs or add links mechanically.
- Select a representative existing preview image when useful, or describe an image to create with its intended subject and alt text. Record missing assets as proposed. Use the configured site image if a dedicated image adds little value; image production is not required to complete intake.

Follow the linked writing standard for front matter. Keep proposed search queries in the brief rather than introducing unsupported metadata fields. Record the publication date as undecided unless supplied or already implied by the task. Let the existing Jekyll templates generate canonical URLs, social tags, and structured data.

## Deliver a usable brief

Finish when the reader, premise, payoff, and grounded opening direction are clear and the major claims have evidence or an explicit plan. Do not prolong the interview for optional polish. If the user asks to proceed with incomplete answers, produce a provisional brief with visible assumptions and precise gaps; avoid filling missing facts with plausible prose.

Provide a concise brief in the conversation, or save it at the requested location when the user wants a file. Include:

- **Premise and reader:** the main point, intended reader, starting knowledge, payoff, and scope.
- **Title and hook:** the recommended title and opening direction, with alternatives only if still useful.
- **Outline:** the necessary sections and the evidence or example each will use.
- **Claim and evidence map:** supported claims, sources and artifact paths, visuals or demos, limitations, and missing evidence.
- **SEO proposal:** search intent, primary query and any research basis, slug, description, categories, useful links, preview image plan, and publication timing if known.
- **Author notes and open decisions:** phrases to preserve, constraints, next action for the reader if relevant, and unresolved questions that materially affect drafting or publication.

Clearly distinguish confirmed facts, editorial recommendations, and unknowns. If drafting is already requested, continue using [blog-writing](../blog-writing/SKILL.md) with this brief; do not ask for permission again. Otherwise, completing the brief fulfills the intake task.
