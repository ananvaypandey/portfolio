---
title: "What building an AI health companion taught me"
date: "2026-08-21"
excerpt: "VIONEX started with a problem statement and a deadline. It ended up being the project that taught me most about AI, hardware, and building under pressure."
tags: ["VIONEX", "AI", "Robotics", "Health-Tech"]
---

Some projects start as a neat idea you polish slowly. VIONEX was not one of them. It started as a Smart India Hackathon problem statement, a tight deadline, and the stubborn belief that we could actually build the thing we kept sketching on paper.

The brief was a **Personal Health Companion** — something that moves beyond a health app on a phone and becomes part of your daily life, especially for the elderly and for people managing chronic conditions at home.

We set a goal early: no mockups only, no slideware. We wanted a physical, working system.

## What we shipped

VIONEX combines a few layers into one care loop:

- A **wearable health band** that keeps track of vitals and sends data into the system.
- **Edge AI** doing monitoring with light models that run without depending on the cloud.
- A **robotic assistant** — Raspberry Pi at its core, a 3D-printed body, and 16 servo motors driven through a PCA9685 board — that can move and respond.
- Connections to **caregivers and doctors**, so the loop doesn't close with the patient alone.

It was ambitious. Some of it worked on the first try. Most of it did not.

## The honest lessons

**Edge AI changes the way you design.** When the model has to run on a Raspberry Pi instead of a datacenter, your "obvious" solution changes. You start thinking about latency, reliability, and what happens offline. That discipline is valuable everywhere in AI.

**Hardware punishes assumptions.** Software lets you refactor. Hardware makes you solder. A loose servo connection or a misread sensor teaches you more about patience than any coding tutorial.

**The fastest way to understand AI is to put it in a physical system.** A chatbot that contains itself is neat. A robot that reacts to a person is unforgettable — for the user and for you.

**Deadlines force simplicity.** With limited time, we learned to ship a smaller thing that works over a bigger thing that half-works. That instinct has carried into every project since.

I don't think we built the final version of the Personal Health Companion at that hackathon. But we proved the concept could move from screen to reality — which was the whole point. The problem statement asked for care support that exists before an emergency. That idea informed how we designed everything after.