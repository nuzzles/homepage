---
title: "Three years of trying to deliver the world a better language-learning app"
description: "Three years of trying to build a language-learning app, from a RuneScape translator and a multiplayer world to serverless chat and a personal Lingodex."
date: 2026-11-26
categories: ["ai"]
url: ai-language-learning/
draft: true
---

## 1. What AI makes possible for language learning

TODO - Human writing; Explain how streaming speech recognition, translation that understands context and slang, and natural text-to-speech could support conversations informed by a learner's history. Ground the capabilities in examples and identify the learning benefits you still need to evaluate.

## 2. Learning Danish in RuneScape

TODO - Human writing; Describe why you built Chat Translator to learn Danish, the response to the [original Reddit announcement](https://www.reddit.com/r/2007scape/comments/l9935w/i_released_the_chat_translator_plugin_on_the_rl/), and what encouraged you to pursue a dedicated product. Establish when the three-year product effort began and how the plugin benefited from an existing community.

## 3. The world I wanted to build

TODO - Human writing; Introduce the Club Penguin and Duolingo-inspired world, its approachable vector style, and the translation-and-retyping interaction through the Hello, Hola, and Bonjour example. Explain what each participant would type and see, and why you thought that interaction could help them learn.

## 4. Building the game's foundations

TODO - Human writing; Show the consequential graphics and networking decisions behind bevy_vello, Matchbox, bevy_rtc, and Lightyear, using specific code or demos to explain the work each choice created. Include the depth of SVG, Lottie, text, and scene rendering, the other game systems you had to learn, and why WebTransport and maintaining less networking code appealed to you.

## 5. Why I couldn't launch it

TODO - Human writing; Explain the empty-world problem, your attempts to find co-founders among friends, family, and through Y Combinator, and how distribution, costs, and limited time prevented a launch. Describe which assumptions you failed to validate and why continuous spending during breaks made the project difficult to sustain.

## 6. Starting again with serverless chat

TODO - Human writing; Describe leaving Bevy, bevy_vello, and Lightyear, preserving the conversation mechanic, and designing around your requirement for zero idle infrastructure cost. Show how the architecture changed, account for any remaining costs, and distinguish what works today from what you are still building.

## 7. What I want to improve

TODO - Human writing; Describe the learning experience you still want to create and the choices that matter to you as its designer. Establish chat, Lingodex, and learning-history data collection as the first release, with small games and partner matching planned afterward.

### 7.1. A Lingodex built from your conversations

TODO - Human writing; Explain how the first release will collect encountered words and sentences in a personal Lingodex, and describe how that history could support new sentence exercises, flashcards, and trivia. Track exposure, copying, unaided recall, and successful use in a new sentence separately so the record can distinguish practice from demonstrated learning.

### 7.2. Finding people to learn with

TODO - Human writing; Describe the later addition of "perfect pairs" who want to learn each other's languages, with asynchronous games such as turn-based chess or Connect Four giving them a reason to meet and continue talking without being online together. Explain how you would evaluate partner availability, time to a first reply, and stalled games, including what a new or returning user can do while waiting.

### 7.3. Bringing back the visual style

TODO - Human writing; Explain why approachable vector graphics still matter to the experience after leaving the original game stack. Describe how that style could carry into the chat interface and later small games, without making a return to Bevy or the live world a requirement.

## 8. What I need to prove

TODO - Human writing; Explain how you will evaluate the first release's chat, Lingodex, and data collection, including whether retyping leads to independent recall and whether the learning history helps people practice. Describe the later evaluation of small games and partner matching, including whether asynchronous partners keep conversations going.
