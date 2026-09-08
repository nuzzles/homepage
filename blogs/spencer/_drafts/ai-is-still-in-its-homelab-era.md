---
layout: post
title: "AI is in its homelab era"
description: "AI is popular, but saturation is relatively low: personal AI is not cheap, safe, or ordinary enough to manage daily life."
date: 2026-09-07
categories: ai
---

<!--
Publication blockers:

1. Add a sourced adoption chart covering consumer awareness, regular use, and paid use over time.
2. Add a redacted chart of monthly AI spending, split between coding and personal use.
3. Back the manual-coding competitiveness claim with representative assisted versus unassisted tasks, including time, defects, and review burden.
4. Add a homelab-to-AWS architecture/cost graphic backed by redacted bills and current service pricing.
5. Add primary sources and a cost curve for inference pricing, subsidies, and the market argument.
6. Add sourced polling on public sentiment plus utility/capex data for the opposition section.
7. Substantiate the infrastructure-policy prediction with geographically specific utility data and primary sources on who can regulate rates, permitting, and cost allocation.
8. Add specific, dated OpenClaw security findings and a short recording or screenshots of the tested UX.
9. Add a prediction graphic with measurable checkpoints through 2031.
-->

Gone are the days my mom would ask me for technical help with her printer, she has ChatGPT. So too are the days my brother would ask me if I could make a website for his brick-and-mortar business; he knows it's possible to vibe code one.

I don't think I need to tell you that AI is popular - it is; we are in an AI popularity bubble. But I do not think people are prepared for where it is going. AI is nowhere near saturated.

My brother's requests changed from _"Could you build this website?"_ to _"Can you vibe this website in a few minutes?"_. Nature is healing, or nothing really changed. To me, nothing really changed; the request persists. AI has not markedly changed the intuition for the general population of non-technical people.

People still expect software to cost, be secure and hygenic, and to come with support. AI has not yet markedly convinced non-technical people that they can safely make it themselves.

<!-- Graphic: consumer AI adoption over time, separating awareness, occasional use, regular use, and paid use. Cite the primary datasets and explain what “adoption” means. -->

That is popularity without saturation.

## The expensive hobby phase

My current AI spend is above $3,000 per month. Most of that is coding, since my job is software engineering. Work I do for Blue Origin is demanding, and from where I sit, coding everything by hand will not be generally competitive. There is a gap clearly visible across my software engineering team. I can see that my recorded usage is four times as many AI traces as the next-highest. I do not attribute this to me working four times as hard, I see it as evidence that even software engineers have not saturated into harness coding, one of the most useful applications of AI.

<figure class="evidence-figure">
  <a href="{{ '/assets/ai-team-usage-recent.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/ai-team-usage-recent.svg' | relative_url }}" alt="Two horizontal bar charts comparing recent AI traces and AI cost for seven anonymized software engineers. Spencer leads in cost and traces." />
  </a>
  <figcaption>Recent AI traces and attributed AI cost across my anonymized software engineering team.</figcaption>
</figure>

This makes me a terrible example of normal AI use, but a useful example of its upper end. I do productive work for a silly amount of inference. My personal use, meanwhile, is thin.

<!-- Graphic: redacted monthly AI cost and usage by category. Show coding, image editing, personal agents, and everything else. Include the period, vendors or anonymized classes, and whether credits or employer costs are included. -->

I have tried personal AI tools such as OpenClaw, but I find their usefulness shallower than the public perception.
Instead, I find it's easier than ever to create exactly what I want - zero to one. I have my own daily agenda app with some modest AI capability. I have made my own messaging bots I can interact with to perform certain tasks.

But no tool in existence yet integrates my development workflow on a scalable platform and manages my day. Most tools I use are tools I visit, or maintain, and occasionally forget about.

And this feels familiar. Five years ago, my personal infrastructure was a homelab built from five Raspberry Pis running k3s with RAID storage, redundant networking, independent power switches, and a cooling solution. It was fun. But it also cost hundreds to thousands of dollars and required enough maintenance to qualify as a small, unpaid operations team.

Now my homelab collects dust in my garage, and my personal projects live on in my AWS account. That includes this website, my daily agenda app with a database, some business projects, a few Discord bots, and more. The relevant workloads cost me a sum total of single-digit cents per month, and I am not in a free tier. Innovation made that possible. I saw services like Amazon DSQL (a distributed, serverless relational database with zero idle cost) become generally available, which instantly became a reasonable host for my daily TODOs, health data, and more.

<!-- Graphic: before/after architecture diagram and cost breakdown. Back the AWS total with a redacted bill, state the month and region, separate one-time/domain costs, and link current DSQL pricing. -->

The homelab was useful, but large maintennce and expensive. The cloud turned this into a cheap commodity. I expect AI to follow the same curve.

## Cheap enough to forget

AI is prohibitively expensive when used as aggressively as I use it now. That will not last. Models will get smaller, hardware will improve, inference will become more competitive, and providers will keep finding cheaper ways to serve the same useful unit of intelligence.

<!-- Evidence: plot a defensible unit-cost series, such as price per fixed benchmark/task or equivalent tokens at a fixed quality threshold. Do not compare raw token prices across unlike models without a quality control. -->

<!-- TODO: Note how services like OpenAI and Anthropic have recently given "free" credit limit upgrades, lowered prices, etc., which read to me like a desperate reaction to open-source catching up. -->

My prediction is not merely that AI gets cheaper. It becomes cheap enough that ordinary people stop thinking about the meter.

That affects how I think about the broad AI trade in public markets. This is not investment advice. I am personally wary of betting on scarcity when the product looks destined for commoditization. Subsidized competition from China and other countries could force prices down further, although some protected markets—government and defense come to mind—may behave differently.

## Saturation looks like a personal manager

AI reaches saturation when most people use it to manage their lives, not just when most people regularly use ChatGPT or Gemini.

Everyone will need something like an OpenClaw in roughly the same way everyone now needs a phone or access to the internet. It will understand the annoying surface area of a day: messages, appointments, tasks, files, forms, reminders, purchases, and the small promises we make before immediately forgetting them.

It has not yet arrived for me, even though I spend enough on AI each month to finance a respectable bad habit.

After I coded my own personal manager, I found that people are doing the same independently; so-called "AgenticOS" tutorial series are cropping up on YouTube. These shiny AgenticOS projects imitate Iron Man's JARVIS companion, although when I look at them, all I see is garish vibe-slop. I would not expect similar YouTube series to focus on scaling, maintenance, or the hard integration work to make this useful. They seem more like fun hobbyist projects with limited usefulness. A useful personal manager would need a phone companion, sensible alerts, durable memory, authorization, and recovery when an agent does something stupid. Most people should not need to learn how containers work before asking software to remember a dentist appointment.

<!-- Graphic/demo: compare the setup and daily workflow of representative AgenticOS projects. Record install time, maintenance steps, supported surfaces, permission model, failure recovery, and cost. Link the tested versions. -->

And even worse, OpenClaw.

To be precise: there was a magic spark when I tried it, but that faded quickly. The interface was slop, and its security model did not earn access to your personal data. A system that reads your life cannot treat security as a later sprint.

<!-- Evidence: cite specific security advisories or independently reproducible findings for the tested OpenClaw version. Add screenshots or a short recording for the UX critique and label subjective judgments as such. -->

Someone will eventually make the Apple-like quality version of OpenClaw: narrow enough to understand, polished enough to trust, and useful before the user has configured forty integrations. When that happens, the world will come to it.

## A hostile launch environment

A loud part of the public is vehemently against AI.

People see companies exploiting the political system, building data centers that may raise local water and electricity costs, expecting a government bailout, and burning cash without a believable return. Some of those concerns are measurable. Others are projections. A credible personal AI platform will have to survive all of them.

Saturation will only make this launch environment more hostile. Adoption and acceptance are pulling in opposite directions: more aggregate compute means more electricity, cooling, and water demand. Models and data centers will get more efficient, but cheaper intelligence will also invite us to use much more of it.

I think it will literally require an act of Congress: national rules deciding when data centers pay for the infrastructure they require, how scarce resources are allocated, and what costs can be passed to everyone else. AI companies want government assistance, but it needs to be politically favorable, or AI will continue to divide the public until we hear [the next UnitedHealthcare CEO is Sam Altman](https://www.nytimes.com/2024/12/04/nyregion/unitedhealthcare-ceo-brian-thompson-shooting.html){:target="_blank" rel="noopener noreferrer"}.

<!-- Graphic: plot consumer AI adoption and compute demand alongside sourced data-center electricity/water demand, local retail utility rates, and ratepayer cost allocation. Keep impacts geographically specific, separate efficiency gains from aggregate-demand rebound, distinguish reported facts from forecasts, and identify which remedies fall under federal versus state or local authority. -->

The winning product cannot merely be capable. It must be cheap, boring, secure, and visibly worth the infrastructure behind it.

## Five years, probably

My guess is that we are at least five years away from saturation, unless another ChatGPT-sized viral moment pulls the schedule forward.

By around 2031, I expect a credible personal agent to have four properties:

- it installs like a normal app and works across phone and desktop;
- its permissions and mistakes are understandable to non-technical people;
- it costs little enough that normal use is not a financial decision; and
- it manages a meaningful part of the day without becoming another system to manage.

<!-- Graphic: prediction timeline from 2026 through 2031 with measurable checkpoints for cost, adoption, setup time, platform coverage, and non-technical retention. Preserve this snapshot so the prediction can be graded later. -->

The final signal will not be another benchmark. It will be my brother building the tool for his shop without asking me anything.

And if he leaks the customer database, we are only halfway there.
