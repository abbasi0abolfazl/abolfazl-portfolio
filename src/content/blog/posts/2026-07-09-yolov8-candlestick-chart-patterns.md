---
title: "YOLOv8 for Candlestick Patterns: A FintechPlus Case Study"
date: "2026-07-09"
excerpt: "A transparent note on an internal FintechPlus result and how it differs from my public pretrained-model experiment."
tags: ["Computer Vision", "YOLOv8", "Trading", "Python", "Case Study"]
---

# YOLOv8 for Candlestick Patterns: A FintechPlus Case Study

At **FintechPlus**, I worked on a private YOLOv8-based candlestick chart-pattern detection project. The recorded internal test result was **97% mAP@0.5**.

This is an internal project result. The client dataset, model weights, experiment logs, and implementation remain private, so the metric is not presented as an independently reproducible public benchmark.

## Public experiment

My public [`stock-market-pattern-detection`](https://github.com/abbasi0abolfazl/stock-market-pattern-detection) repository is a separate proof of concept. It generates chart images from OHLC data and runs inference with the public pretrained `foduucom/stockmarket-pattern-detection-yolov8` model.

The public repository does **not** contain the private FintechPlus training artifacts and does **not** reproduce the internal 97% result.

## Why this distinction matters

Private case-study results and reproducible public evidence serve different purposes. Publishing them separately makes the scope of each claim clear:

- **Private FintechPlus case study:** internal result of 97% mAP@0.5
- **Public GitHub experiment:** reproducible preprocessing and inference using a public pretrained model

This separation keeps the project history visible without implying that the public repository contains evidence it does not provide.
