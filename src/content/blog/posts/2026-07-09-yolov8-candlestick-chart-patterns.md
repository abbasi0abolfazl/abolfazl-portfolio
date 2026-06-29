---
title: "YOLOv8 on Candlestick Charts: 97% Pattern Detection Accuracy and What It Actually Took"
date: "2026-07-09"
excerpt: "I trained YOLOv8 to detect technical analysis patterns in financial charts, hit 97% mAP, and integrated it into a live trading pipeline. Here's the dataset problem, the ambiguity problem, and what transfer learning from ImageNet actually buys you on financial data."
tags: ["Computer Vision", "YOLOv8", "Trading", "Python", "Machine Learning"]
---

# YOLOv8 on Candlestick Charts: 97% Pattern Detection Accuracy and What It Actually Took

## Why Computer Vision for Chart Patterns

Technical analysts look at candlestick charts and see patterns — head and shoulders, double tops, bull flags, wedges. These patterns are used to predict price direction. The problem: a human analyst can monitor maybe 10–20 charts at a time. An automated system can monitor thousands.

The catch is that "automated pattern detection" usually means rule-based code that scans price series for specific conditions (e.g., "two local maxima at approximately the same price level"). These rules are brittle — they work in textbook examples and break in real markets where patterns are noisy, overlapping, and appear at different scales.

The insight behind this project: chart patterns are *visual* objects. Traders learn to recognize them by looking at charts, not by computing ratios. A computer vision model trained on charts should be able to learn the same visual features.

At FintechPlus, I tested that hypothesis. The result was a YOLOv8 model that detects 12 chart pattern types at 97% mAP@0.5, integrated into a live Forex trading pipeline.

---

## The Dataset

This was the hardest part. There is no public dataset of labeled candlestick chart images with bounding boxes. I built one from scratch.

**Data collection:**
- Generated chart images from historical OHLCV data across 6 Forex pairs (EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, XAUUSD)
- Used Python with `mplfinance` to render candlestick charts at multiple timeframes (1H, 4H, Daily)
- Covered 5 years of historical data — 2019 to 2024

**Labeling:**
- Manually labeled 4,200 chart images using LabelImg
- 12 pattern classes: head and shoulders, inverse head and shoulders, double top, double bottom, triple top, triple bottom, ascending triangle, descending triangle, symmetrical triangle, bull flag, bear flag, wedge
- Bounding boxes drawn around the entire pattern, from the start of the left shoulder (or first peak) to the breakout point

**The labeling was slow and subjective.** A double top at one scale can look like a consolidation at another. I established labeling rules for each pattern (minimum height requirements, maximum allowed asymmetry between peaks, etc.) and reviewed every label twice. Total labeling time: about 40 hours.

**Dataset split:** 3,360 train / 420 validation / 420 test, stratified by pattern class.

---

## Training

I used `ultralytics` YOLOv8, starting from `yolov8n.pt` (nano, pretrained on COCO).

```python
from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model.train(
    data="chart_patterns.yaml",
    epochs=100,
    imgsz=640,
    batch=16,
    patience=20,
    lr0=0.01,
    lrf=0.01,
    augment=True,
    degrees=0.0,      # no rotation — chart orientation matters
    fliplr=0.0,       # no horizontal flip — breaks pattern direction
    flipud=0.0,       # no vertical flip — inverts the chart
    mosaic=0.5,       # combine 4 charts — careful with this
    mixup=0.0,        # disabled — too disruptive for chart patterns
)
```

**Augmentation decisions matter a lot here.** YOLOv8's default augmentation is designed for natural images. Most of those defaults are wrong for charts:

- **No horizontal/vertical flips**: A bull flag flipped horizontally becomes a bear flag. Flipped vertically means price went the wrong direction. These augmentations would teach the model the wrong thing.
- **No rotation**: Chart patterns have specific orientation relative to price axis. Rotation destroys that.
- **Mosaic at 0.5 (not 1.0)**: Mosaic combines 4 images into one, which helps with small patterns. At 1.0 it was too disruptive and hurt val mAP. At 0.5 it was a net positive.
- **Color jitter enabled**: Charts look different across platforms (dark/light theme, grid lines, color schemes). Color jitter makes the model robust to this.

---

## The Ambiguity Problem

The hardest technical challenge wasn't training — it was that visually similar patterns have completely opposite trading implications.

A double top (bearish reversal) and a rounding top (also bearish, different structure) can look nearly identical in a 640px image. An ascending triangle (bullish continuation) and a rising wedge (bearish reversal) differ mainly in the slope of the lower trendline.

The YOLOv8 model alone handled this reasonably well (the confusion matrix showed most confusion between visually similar pairs, as expected). But for the trading application, confusing a bullish pattern with a bearish one is worse than no detection at all — it triggers a trade in the wrong direction.

**The fix: a secondary context classifier.**

After YOLOv8 identifies a potential pattern and draws a bounding box, a second model takes a wider window of price action (2x the bounding box width on each side) and classifies:

1. What pattern is actually present (refines the YOLOv8 label)
2. Whether the preceding trend is consistent with this pattern (a head-and-shoulders is only valid after an uptrend; inverse head-and-shoulders after a downtrend)

```python
class PatternContextClassifier(nn.Module):
    def __init__(self, num_classes=12):
        super().__init__()
        # EfficientNet-B0 pretrained, fine-tuned on wider context windows
        self.backbone = timm.create_model('efficientnet_b0', pretrained=True)
        in_features = self.backbone.classifier.in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)

def classify_with_context(detection, chart_image, classifier):
    x1, y1, x2, y2 = detection.xyxy
    width = x2 - x1
    # Expand bounding box 2x in each direction
    cx1 = max(0, x1 - width)
    cx2 = min(chart_image.width, x2 + width)
    context_crop = chart_image.crop((cx1, y1, cx2, y2))
    return classifier(transform(context_crop).unsqueeze(0))
```

The two-stage pipeline improved precision on the easily-confused pairs by 8 percentage points. The overall mAP improvement was modest (3 points), but the reduction in directionally-wrong detections was the metric that mattered for trading.

---

## Transfer Learning from Natural Images

One result that surprised me: starting from a model pretrained on COCO (natural images — people, cars, animals) worked significantly better than training from scratch, even though financial charts look nothing like natural images.

**Training from scratch**: reached ~79% mAP after 200 epochs.
**Starting from yolov8n.pt (COCO pretrained)**: reached 91% mAP after 50 epochs, 95%+ after 100.

Why? The low-level features that COCO pretraining teaches — edge detection, curve following, geometric shape recognition — transfer directly to charts. A "head" in a head-and-shoulders pattern is a local maximum with a specific curve shape. The backbone already knows how to detect curves. The fine-tuning teaches it to recognize which *arrangement* of curves constitutes each pattern.

This reduced training time by roughly 70% compared to training from scratch to the same accuracy.

---

## Integration into Live Trading

The detection pipeline runs as a background process that:

1. Fetches the latest OHLCV data from MetaTrader via the Python API
2. Renders chart images for each active pair and timeframe
3. Runs YOLOv8 + context classifier on each chart
4. Filters detections by confidence threshold (>0.75) and pattern validity (trend consistency check)
5. Pushes confirmed detections to the trading bot's signal queue

```python
async def pattern_monitor(pairs, timeframes, signal_queue):
    while True:
        for pair in pairs:
            for tf in timeframes:
                data = mt5_client.get_ohlcv(pair, tf, bars=200)
                chart_img = render_chart(data)
                detections = detector.predict(chart_img, conf=0.75)
                for det in detections:
                    pattern = classify_with_context(det, chart_img, context_model)
                    if validate_trend_context(data, pattern):
                        await signal_queue.put({
                            "pair": pair, "timeframe": tf,
                            "pattern": pattern, "confidence": det.conf
                        })
        await asyncio.sleep(300)  # re-check every 5 minutes
```

The 5-minute polling interval matched the trading strategy's minimum holding period. Checking more frequently would have produced duplicate signals for the same pattern.

---

## Results

- **mAP@0.5**: 97% on the test set
- **12 pattern classes** detected
- **Sub-2-second inference** on a CPU (yolov8n is fast)
- **Zero directionally-wrong trades** triggered by pattern detection during 3 months of live monitoring (though the overall trading results depend on far more than pattern detection)

The 97% is on the test set — real-world performance is lower because real markets produce messier patterns than historical examples. The more useful metric for the trading application was the false positive rate on clear non-patterns, which was under 3%.

---

## Lessons

**Dataset quality and labeling consistency matter more than model size.** I tested yolov8m (medium) and yolov8l (large) — both plateaued at similar accuracy to yolov8n with 5x–12x more compute. The limiting factor was label noise, not model capacity.

**Disable augmentations that violate domain semantics.** Every augmentation you enable teaches the model something. Make sure what it's teaching is true. Horizontal flipping is a free accuracy boost for most object detection tasks and a free accuracy *loss* for directional chart patterns.

**Two-stage pipelines beat single-stage on ambiguous classes.** The first stage (YOLOv8) is fast and handles localization. The second stage (context classifier) handles disambiguation with more context. The overhead is small and the precision gain on confused pairs is real.

**Transfer learning works across larger domain gaps than you'd expect.** Start pretrained. Always.
