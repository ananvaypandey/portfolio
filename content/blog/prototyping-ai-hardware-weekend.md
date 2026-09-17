---
title: "How I prototype AI × hardware ideas in a weekend"
date: "2026-05-09"
excerpt: "A concrete recipe for going from idea to working hardware prototype fast: pick a sensing problem, stack familiar tools, and resist building the full product."
tags: ["Prototyping", "Robotics", "AI"]
---

Not every idea deserves a roadmap. Some just deserve a weekend where you find out if the core of the idea works at all. Most of my AI × hardware projects started this way, including some that later became real products.

Here's the recipe I keep coming back to.

## 1. Shrink the idea to one risky assumption

The version that is worth testing is usually small. Instead of "an AI health companion for everyone," test "can I read a sensor reliably and run a model on it on a Raspberry Pi?" Whatever the scariest unknown is — that's the thing you build first.

## 2. Use tools you already know

New hardware AND new software AND a new model is three unknown variables. Only introduce one at a time. For me the default stack is:

- **Raspberry Pi** for the brain — it runs Linux, Python, and small models without drama.
- **Arduino / ESP8266** for the joints — sensors, servos, and simple I/O that just works.
- **FastAPI** when I need a quick local API.
- **Firebase** when a prototype needs sync anyways and I don't want to be a backend yet.
- A tiny **edge model** or an existing API for the AI part, whichever fits the speed target.

## 3. Build sideways, not in order

Don't go sense → think → act strictly top to bottom. Build the riskiest module first. If the model can't run fast enough, nothing else matters. If the sensor signal is garbage, the model is pointless. Sideways delivery — demo the riskiest spike end to end — kills projects fast when they should die, which is the point.

## 4. Union the pieces as soon as they exist

Prototypes fail when the parts are finished but never meet. On my first hardware build I spent two days polishing pieces that only connected for the first time on demo day. Now I stitch modules together the moment they're individually healthy, from the first weekend.

## 5. Write the demo script before it's done

A working prototype you can't demo convincingly earns you nothing. Define the one 60-second story before the prototype is complete, then let the build fill in the gaps. For VIONEX the demo was a simple one: sensors active, edge model responding, robot reacting. Everything else was bonus.

## The output mindset

A weekend prototype isn't the product. It's a one-line answer to a question like: *"Can we detect this, decide something about it, and act on it — in real time, off-device, affordably?"*

When the answer is yes, you have a green light for a real build. When it's no, you've just saved yourself months. Either way, the weekend paid for itself.

I don't just learn. I build — and a weekend is a very long time.