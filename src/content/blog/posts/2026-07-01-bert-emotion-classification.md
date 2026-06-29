---
title: "Fine-tuning BERT for Multi-label Emotion Classification: 8 Emotions, 3 Polarities, Persian Text"
date: "2026-07-01"
excerpt: "How I fine-tuned ParsBERT to classify Persian text across 8 emotion categories and 3 polarities, built a 15K-sentence dataset, and introduced human-in-the-loop retraining to keep accuracy climbing in production."
tags: ["NLP", "BERT", "HuggingFace", "Python", "Machine Learning"]
---

# Fine-tuning BERT for Multi-label Emotion Classification: 8 Emotions, 3 Polarities, Persian Text

## The Problem

Most sentiment analysis systems give you a single number: positive, negative, neutral. That's useful for review scores. It's useless when your client needs to understand whether public social media posts about their brand are expressing *anger*, *disgust*, *sadness*, or *fear* — because those four negative emotions call for completely different responses.

At Mahroyan Software Industry, I was building the NLP layer of a social media intelligence platform that ingested Persian-language content from X (Twitter), Instagram, and Telegram. The requirement: classify each post into one of 8 emotion categories, and tag each with one of 3 polarities. Not just sentiment — emotion.

The catch: Persian is a low-resource language in NLP terms. Multilingual BERT models exist, but they perform poorly on Persian compared to high-resource languages like English or Chinese. And the training data I needed — Persian text labeled with fine-grained emotions — barely existed.

---

## What I Built

The final system classifies Persian text across:

- **8 emotion classes**: joy, sadness, anger, fear, surprise, disgust, trust, anticipation
- **3 polarities**: positive, negative, neutral
- **Base model**: ParsBERT (`HooshvareLab/bert-fa-base-uncased`) — a BERT model pre-trained on a large Persian corpus

The output is two parallel classification heads on top of the same encoder, trained jointly.

---

## The Dataset Problem

Before any model work, I needed labeled data. There was no off-the-shelf Persian emotion dataset at the right granularity, so I built one.

**Sources:**
- Social media posts scraped from X and Telegram (already inside our platform)
- Persian news comments
- Product reviews

**Labeling strategy:**

Manual labeling at this scale is expensive and slow. I used a hybrid approach:

1. **GPT-4 pseudo-labeling**: Prompted GPT-4 with a detailed taxonomy and examples to generate initial labels for batches of 500 sentences at a time. This is fast and cheap but noisy — GPT-4 confuses trust/anticipation regularly, and it misses cultural nuance in Persian expressions.

2. **Senior analyst review**: A domain expert reviewed all GPT-4 labels, correcting the ones that were wrong and flagging ambiguous cases for exclusion.

3. **Active learning prioritization**: I trained a preliminary model after the first 3,000 labeled examples, then used its uncertainty scores (entropy of the softmax output) to prioritize which unlabeled examples to send for human review next. The most uncertain predictions first — this got maximum label value per human hour.

The final dataset: **15,000 labeled Persian sentences**, with an inter-annotator agreement check on 1,000 samples showing 84% agreement (Cohen's kappa = 0.79 for emotion class, 0.91 for polarity).

---

## Training Setup

```python
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)
import torch
import torch.nn as nn

model_name = "HooshvareLab/bert-fa-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)

class DualHeadBERT(nn.Module):
    def __init__(self, num_emotions=8, num_polarities=3):
        super().__init__()
        self.bert = AutoModel.from_pretrained(model_name)
        hidden = self.bert.config.hidden_size
        self.emotion_head = nn.Linear(hidden, num_emotions)
        self.polarity_head = nn.Linear(hidden, num_polarities)

    def forward(self, input_ids, attention_mask):
        cls = self.bert(input_ids, attention_mask).last_hidden_state[:, 0]
        return self.emotion_head(cls), self.polarity_head(cls)
```

**Key training decisions:**

- **Joint loss**: `total_loss = 0.7 * emotion_loss + 0.3 * polarity_loss`. Polarity is easier so I weighted it lower to prevent the emotion head from being dominated.
- **Class weights**: Emotion distribution is heavily skewed (joy and anger appear 3x more than disgust or anticipation). Computed per-class weights inversely proportional to frequency.
- **Learning rate**: 2e-5 with linear warmup over 10% of training steps. Lower than the default 5e-5 — ParsBERT was already well-adapted to Persian, and aggressive fine-tuning caused catastrophic forgetting of the linguistic features that make it useful.
- **Max sequence length**: 128 tokens. Persian social media posts are short. Using 512 doubled training time with no accuracy gain.

---

## Human-in-the-Loop Retraining

The model deployed at v1 hit **87% macro-F1 on the test set** — solid. But real-world data drifts. New slang, political events, memes that change the emotional context of words.

I built a retraining pipeline around two signals:

1. **Low-confidence predictions**: Any inference with softmax entropy above a threshold gets flagged and queued for human review.
2. **Analyst corrections**: When analysts used the platform, they could mark a prediction as wrong. Those corrections were collected and added to the retraining queue.

Every two weeks, the queue was reviewed, cleaned, added to the training set, and the model was retrained from the last checkpoint. This is not expensive — a single epoch on new data with frozen lower layers only takes a few minutes on a GPU.

The result: model accuracy improved from 87% to **91% macro-F1** over three retraining cycles, without collecting new data from scratch.

---

## What Didn't Work

**Data augmentation via back-translation**: I tried translating Persian sentences to English and back to generate synthetic training examples. The quality was too low — back-translation through a general-purpose model loses the emotional nuance that makes the original sentence informative. Dropped after the first experiment.

**mBERT (multilingual BERT)**: Tested as a baseline. It underperformed ParsBERT by 12 percentage points on macro-F1. The Persian-specific pre-training in ParsBERT matters — don't skip domain-specific pre-training for low-resource languages.

**Single-head multi-label approach**: My first design used a single classification head with 24 labels (8 emotions × 3 polarities). Training was unstable because many combinations are impossible (you can't be joyfully disgusted). Splitting into two heads with a joint loss was simpler, more stable, and easier to evaluate.

---

## Results

| Metric | Multilingual BERT | ParsBERT (v1) | ParsBERT (v3, with retraining) |
|---|---|---|---|
| Macro-F1 (emotion) | 75% | 87% | 91% |
| Polarity accuracy | 88% | 95% | 96% |

The biggest gap between the baseline and the fine-tuned model was on low-frequency classes: disgust, anticipation, and trust all improved by 18–25 percentage points. High-frequency classes (joy, anger) were already reasonable in the baseline.

---

## Lessons

**Data quality beats model size.** I spent the first month experimenting with model architectures. The second month I spent on the dataset. The dataset work improved results far more. Consistency in labeling matters more than volume.

**GPT-4 is a useful but imperfect labeler.** It's fast and cheap enough to bootstrap a dataset that would be impossible to build manually. But it has systematic biases — cultural nuance in Persian is one of them. Always budget for human review on top of pseudo-labels.

**Active learning pays off.** Prioritizing uncertain examples for human review is not complicated to implement, and it reduces the labeling cost to get to a given accuracy level by roughly 30-40% in my experience. If you're building a labeled dataset and not doing this, you're leaving efficiency on the table.

**Retraining cadence matters as much as initial accuracy.** A model that degrades silently is worse than one that starts lower but stays current. Build the retraining loop before you need it.
