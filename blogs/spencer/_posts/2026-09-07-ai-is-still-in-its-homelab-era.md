---
layout: post
title: "AI is in its homelab era"
description: "AI is popular, but not saturated. My predictions for how cost, adoption, and public backlash shape the next five years."
date: 2026-09-07
categories: ai
---

Gone are the days my mom would ask me for technical help with her printer; she has ChatGPT. So too are the days my brother would ask me if I could make a website for his brick-and-mortar business; he knows it's possible to vibe code one.

I don't think I need to tell you that AI is popular—it is. We are in an AI popularity bubble. But I do not think people are prepared for where it is going. AI is nowhere near saturated.

My brother's requests changed from _"Could you build this website?"_ to _"Can you vibe this website in a few minutes?"_ Nature is healing, or nothing really changed. People still expect software to cost, be secure and hygienic, and come with support. AI has not yet markedly convinced non-technical people that they can make it themselves.

We have popularity without saturation.

## The expensive hobby phase

My AI usage can punch upwards of $3,000 in a month. Most of it is coding, since my craft is software engineering, while a very small amount is personal AI use. Most of my AI coding use will stay the same or increase—I believe coding everything by hand will not be generally competitive for long. However, even on my software engineering team, there are varying levels of saturation. In the graph below, my usage is roughly four times higher than the next-highest coworker. I do not attribute this to working four times as hard; I see it as evidence that even software engineers have not reached high usage.

<figure class="evidence-figure">
  <a href="{{ '/assets/ai-team-usage-recent.svg' | relative_url }}" target="_blank" rel="noopener noreferrer">
    <img src="{{ '/assets/ai-team-usage-recent.svg' | relative_url }}" alt="Two horizontal bar charts comparing recent AI traces and AI cost for seven anonymized software engineers. Spencer leads in cost and traces." />
  </a>
  <figcaption>AI traces and attributed AI cost across my anonymized software engineering team.</figcaption>
</figure>

This makes me a terrible example of normal AI use, but a useful example of its upper end.

I am not using personal AI tools much. I have tried OpenClaw, but I found its usefulness shallower than the public perception. Instead, I find it's easier than ever to create exactly what I want - zero to one. I have my own daily agenda app with some modest AI capability. I have made my own messaging bots I can interact with to perform certain tasks.

But no tool in existence yet integrates my development workflow on a scalable platform and manages my day. Most tools I use are tools I visit, or maintain, and occasionally forget about.

_And this feels familiar_. Five years ago, my personal infrastructure was a homelab built from five Raspberry Pis running k3s with RAID storage, redundant networking, independent power switches, and a cooling solution. It was fun. But it also cost hundreds to thousands of dollars and required enough maintenance to qualify as a small, unpaid operations team.

Now my homelab collects dust in my garage, and my personal projects live in my AWS account. That includes this website, my daily agenda app with a database, some business projects, a few Discord bots, and more. My monthly AWS bill is on average $0.09.

Innovation made that possible. Services like Amazon DSQL—a distributed, serverless relational database with zero idle cost—became generally available and gave me a reasonable home for my daily TODOs, health data, and more.

The homelab was useful, but maintenance-heavy and expensive. The cloud turned this into a cheap commodity. I expect AI to follow the same curve.

## Cheap enough to forget

AI is prohibitively expensive when used as aggressively as I use it now. That will not last. Models will get smaller, hardware will improve, inference will become more competitive, and providers will keep finding cheaper ways to serve the same useful unit of intelligence. [Capability has been getting cheaper](https://epoch.ai/data-insights/llm-inference-price-trends){:target="_blank" rel="noopener noreferrer"}, and that is likely to continue. [Anthropic raising free usage limits](https://www.anthropic.com/news/higher-limits-spacex){:target="_blank" rel="noopener noreferrer"} may be another sign of that pressure reaching users.

My prediction is not merely that AI gets cheaper. It becomes cheap enough that ordinary people stop thinking about the meter.

That affects how I think about the broad AI trade in public markets. This is not investment advice. I am personally wary of betting on scarcity when the product looks destined for commoditization. Subsidized competition from China and other countries could force prices down further, although some protected markets—government and defense come to mind—may behave differently.

## Saturation looks like a personal manager

AI reaches saturation when most people use it to manage their lives, not infrequent use of a chatbot like Gemini.

Everyone will need something like an OpenClaw in roughly the same way everyone now needs a phone or access to the internet. It will be competitive, and it will understand the annoying surface area of a day: messages, appointments, tasks, files, forms, reminders, purchases, and the small promises we make before immediately forgetting them.

It has not yet arrived for me, even though the AI usage attributable to me could finance a bad habit.

I am, however, coding personal tools more frequently. I see this trend growing independently; "AgenticOS" tutorial series are becoming quite popular on YouTube.

<figure class="evidence-figure">
  <img src="{{ '/assets/agentic-os-youtube-collage.jpg' | relative_url }}" alt="Collage of YouTube thumbnails advertising Claude AgenticOS tutorials" />
  <figcaption>AgenticOS tutorials on YouTube.</figcaption>
</figure>

These "OS" tutorials are really just slop dashboards, but I get the allure. Who wouldn't want JARVIS from Iron Man? Here is the gap - doing this right requires scaling, maintenance, and hard integration work. These are fun experiments for AI enthusiasts. A useful personal manager would need a phone companion, sensible alerts, durable memory, authorization, and recovery when an agent does something stupid. Most people watching these tutorials should not need to learn how containers work before asking software to remember a dentist appointment.

And even worse, OpenClaw. There was a magic spark when I tried it, but that faded quickly. The interface was slop, and its security model did not earn my personal data.

Someone will eventually make the Apple-like quality version of OpenClaw: narrow enough to understand, polished enough to trust, and useful before the user has configured forty integrations. When that happens, the world will come to it. Until then,

## A hostile launch environment

A loud part of the public is vehemently against AI.

People see companies exploiting the political system, building data centers that may raise local water and electricity costs, expecting a government bailout, and burning cash without a believable return. Some of those concerns are measurable. Others are projections. A credible personal AI platform will have to survive all of them.

Saturation will only make this launch environment more hostile. Adoption and acceptance are pulling in opposite directions: more aggregate compute means more electricity, cooling, and water demand. [Global nervousness about AI](https://hai.stanford.edu/ai-index/2026-ai-index-report){:target="_blank" rel="noopener noreferrer"} is rising while excitement drops. Models and data centers will get more efficient, but cheaper intelligence will also invite us to use much more of it.

I think we will literally need an act of Congress: national rules deciding when data centers pay for the infrastructure they require, how scarce resources are allocated, and what costs can be passed to everyone else. AI companies want government assistance, but it needs to be politically favorable, or public opposition to AI will continue to harden.

The winning product cannot merely be capable. It must be cheap, boring, secure, and visibly worth the infrastructure behind it.

## Five years, probably

My guess is that we are at least five years away from saturation, unless another ChatGPT-sized viral moment pulls the schedule forward.

By around 2031, I expect a credible personal agent to be common on phones and personal devices. It should:

- behave like a normal app;
- have understandable permissions and mistakes;
- cost little enough that use is not a financial decision; and
- become a meaningful part of the day.

The final signal will not be another benchmark. It will be my brother building the software for his shop without asking me anything.

And if he leaks the customer database, we are only halfway there.
