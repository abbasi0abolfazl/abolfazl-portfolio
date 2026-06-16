---
title: "Building a Resilient X (Twitter) Crawler Bot"
date: "2026-06-16"
excerpt: "How I built a long-running system that quietly collects public data from X (Twitter) — and the engineering decisions that keep it running unattended when the platform actively works against it."
tags: ["Python", "Selenium", "Web Scraping", "System Design", "Data Engineering"]
---

# Building a Resilient X (Twitter) Crawler Bot

## Introduction

Most data-collection projects look simple from the outside: "just download the posts." The reality is the opposite. Collecting public data from a platform like X (Twitter) — which has no convenient open door, changes its layout constantly, and actively discourages automation — is far less about *reading a page* and far more about **building something that can survive in a hostile, ever-changing environment for hours at a time.**

This is the story of the X crawler bot I built as the working core of a broader [Social Media Data Aggregator](https://github.com/abbasi0abolfazl/social_media_data_aggregator). I'll focus on the *decisions* and the *reasoning* rather than the code — because the value of the project isn't any single clever line, it's the engineering judgment that makes the whole thing reliable.

---

## The Real Challenge

Imagine being asked to collect public information from a website, with three catches:

1. The website **rearranges its furniture** every few weeks, so anything you memorized about where things are eventually becomes wrong.
2. If you move **too fast or too predictably**, you get locked out.
3. You need it to run **on its own, overnight, for hours** — without a human babysitting it.

Solve only the "read the page" part and you have a demo that breaks by next week. Solve all three and you have a *system*. That distinction — between a script and a system — is what this project is really about.

---

## What I Built

At a high level, the bot is a single coordinator that drives a real web browser and leans on a few specialized helpers:

```
                ┌────────────────────────┐
                │   Crawler Orchestrator  │
                │  login · search ·       │
                │  profiles · extraction  │
                └───────────┬────────────┘
                            │
   ┌──────────────┬─────────┴────────┬─────────────────┐
   ▼              ▼                  ▼                 ▼
 Browser        Database          Telegram          Logging
 automation     (storage +        (live alerts &    (full audit
 (self-healing) selectors)        monitoring)        trail)
```

Configuration and tasks (what to log in as, what to search for) live **outside** the code, so the same system can be pointed at completely different work without touching a single line. That separation is the first sign of something built to last rather than thrown together once.

---

## The Engineering Decisions That Mattered

Here's where the real thinking went. Each decision started with a practical problem and ended with a design choice that paid off repeatedly.

#### 1. Treating the "where things are" as settings, not code

**The problem:** the platform constantly changes its page structure, and the instructions for *where to find each piece of information* are the most fragile part of any scraper.

**The approach:** instead of baking those instructions into the program, I store them in the database. The bot reads them fresh every time it starts.

**Why it matters:** when the platform changes its layout, fixing the bot becomes a quick database update instead of a code change, a review, and a redeployment. I turned the single most common cause of breakage into the cheapest possible thing to fix — the kind of decision that saves days over a project's life.

### 2. Building automation that heals itself

**The problem:** a browser driven for hours will inevitably freeze, leak memory, or crash. A human would just restart it — but there's no human at 3 a.m.

**The approach:** the browser is wrapped in its own controlled layer that can detect a bad session and cleanly shut it down and restart it, picking up where it left off.

**Why it matters:** the system recovers from the failures it's *guaranteed* to hit, instead of dying on the first one. This is the difference between "ran once in a demo" and "ran all weekend."

### 3. Staying under the radar

**The problem:** behave too aggressively and the account gets rate-limited or banned — losing not just time, but the account itself.

**The approach:** the bot continuously watches for the warning signs of being throttled or blocked, and **stops itself before crossing the line.** It paces its activity to look reasonable rather than maximizing raw speed.

**Why it matters:** sustainable collection always beats fast-but-banned. Knowing when *not* to act is as important as the action itself — a principle that applies far beyond scraping.

### 4. Remembering who it is

**The problem:** logging in repeatedly is slow and is itself a high-risk, suspicious action.

**The approach:** the bot saves its authenticated session and restores it on the next run, only re-authenticating when it genuinely has to — and verifying it's still logged in before doing real work.

**Why it matters:** fewer logins means lower risk and faster startup. Small, thoughtful optimizations like this compound into a system that's both safer and more efficient.

### 5. Watching itself, and telling me about it

**The problem:** an unattended job that fails silently is worse than no job at all — you find out days later that you collected nothing.

**The approach:** the bot monitors its own resource usage (so a leaking browser triggers a restart rather than a crash) and sends **live updates to a Telegram channel** as it runs.

**Why it matters:** I can check the health of an overnight run from my phone, in seconds. You can't fix what you can't see — observability turns a black box into something trustworthy.

### 6. Turning messy pages into clean, structured data

**The problem:** raw social media content is inconsistent — different post types, human-friendly numbers like "1.2K", timestamps in the wrong timezone, and profiles scattered across a page.

**The approach:** the bot recognizes different content types (original posts vs. quotes vs. reposts), pulls full profile details, downloads media, and normalizes everything — converting "1.2K" back into a real number and timestamps into local time.

**Why it matters:** the output is clean, consistent, and immediately useful for analysis — the actual point of collecting the data in the first place.

---

## Built to Run Unattended

The crawler is designed to run continuously, so it's deployed as a managed background service on Linux. That means it restarts automatically if something goes wrong, keeps a full log trail, and survives reboots — no manual intervention required. Reliability isn't just in the code; it's in how the system is operated.

---

## What This Project Demonstrates

For anyone evaluating the work, this project is a compact showcase of skills that transfer to almost any serious software effort:

- **Systems thinking** — designing for the long run, not just the happy path.
- **Resilience engineering** — assuming failure and making recovery automatic and cheap.
- **Pragmatism** — solving the *right* problem (selector drift, account safety) instead of over-engineering.
- **Observability** — building systems you can actually monitor and trust.
- **Data engineering** — turning messy, real-world input into clean, structured output.

---

## Where It's Going

The system works today, and there's a clear path to make it bigger:

- Moving to a **faster, queue-based job system** for higher throughput.
- **Containerizing** it so many copies can run in parallel, coordinated automatically.
- Adding **automated testing and continuous deployment** for safer changes.
- Extending the same foundation to **other platforms** (Facebook, Instagram) under one unified pipeline.

---

## Lessons Learned

1. **Anything that changes more often than your release cycle belongs in settings, not code.** This one idea removed most of the project's maintenance pain.
2. **Design for failure from day one.** In long-running automation, failure is the normal state — so recovery has to be a feature, not an afterthought.
3. **A system you can't see is a system you can't trust.** A few well-placed status messages were worth more than any amount of clever logic.
4. **Restraint is a feature.** The patient, respectful design consistently outperformed the aggressive one.

---

## Closing Thoughts

The hard part of this project was never reading a web page — it was keeping a browser, a login, and an account healthy for hours while the platform did its best to stop me. By treating the fragile parts as configuration, building in self-recovery, and making the whole system observable, the result is something that runs quietly in the background and handles the failures it's certain to encounter.

That shift in mindset — from *writing a script* to *engineering a system* — is the real takeaway, and it's exactly the kind of thinking I bring to harder problems.

You can explore the sanitized architecture in the [demonstration repository on GitHub](https://github.com/abbasi0abolfazl/social_media_data_aggregator).
