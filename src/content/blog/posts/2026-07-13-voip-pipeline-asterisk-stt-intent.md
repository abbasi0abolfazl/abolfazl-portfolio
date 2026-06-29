---
title: "Building a VoIP Intelligence Pipeline: Asterisk → STT → Summarization & Intent Classification"
date: "2026-07-13"
excerpt: "How I connected Asterisk/Issabel PBX to a real-time speech-to-text pipeline, added LLM-based call summarization and intent classification, and what the production integration actually looks like — routing rules, audio streaming, latency, and error handling."
tags: ["VoIP", "Asterisk", "Speech Recognition", "NLP", "Python", "DevOps"]
---

# Building a VoIP Intelligence Pipeline: Asterisk → STT → Summarization & Intent Classification

## Background

Most call centers record calls. Almost none automatically understand them in real time.

At Arnika, we run customer support via a VoIP system on Asterisk/Issabel PBX. Calls come in, agents handle them, recordings sit in a folder. The operational question was: can we automatically understand what each call was about — the intent, the outcome, whether it needs follow-up — without anyone listening to it?

The answer was yes, but the path from "yes" to a working production system was more involved than it looked. This post covers what the pipeline actually looks like, the decisions that mattered, and the failure modes we hit.

---

## System Architecture

```
Inbound Call
     │
     ▼
Asterisk/Issabel PBX
     │
     ├─── Call routing (dialplan)
     │
     ├─── AGI script (Python) ◄─── triggered on answer
     │         │
     │         ▼
     │    Audio streaming (RTP → WAV chunks)
     │         │
     │         ▼
     │    STT Service (Whisper/local or cloud ASR)
     │         │
     │         ▼
     │    Transcript buffer
     │
     └─── On hangup: trigger post-call pipeline
               │
               ▼
          Full transcript
               │
        ┌──────┴──────┐
        ▼             ▼
   Summarization  Intent Classification
   (LLM)          (fine-tuned classifier)
        │             │
        └──────┬──────┘
               ▼
          Results → Database
               │
               ▼
          Dashboard / Alert system
```

Two processing modes: real-time (during the call) and post-call (after hangup). Real-time STT gives the transcript as the call progresses. Post-call analysis runs on the complete transcript.

---

## Connecting to Asterisk: AGI Scripts

Asterisk's extension language (dialplan) handles call routing. To integrate Python, I used AGI (Asterisk Gateway Interface) — a protocol where Asterisk spawns an external script and communicates with it over stdin/stdout.

```python
#!/usr/bin/env python3
import sys
import os
import subprocess
from asterisk.agi import AGI

def main():
    agi = AGI()
    agi.answer()

    channel = agi.get_variable('CHANNEL')
    call_id = agi.get_variable('UNIQUEID')
    caller = agi.get_variable('CALLERID(num)')

    # Start audio capture on the RTP stream
    audio_proc = subprocess.Popen([
        'python3', '/opt/pipeline/capture_audio.py',
        '--channel', channel,
        '--call-id', call_id
    ])

    # Record the call via Asterisk's built-in MixMonitor
    agi.execute(
        'MixMonitor',
        f'/var/spool/asterisk/monitor/{call_id}.wav',
        'b',  # b = record both legs mixed
        f'python3 /opt/pipeline/post_call.py {call_id}'  # runs on hangup
    )

    agi.hangup()

if __name__ == '__main__':
    main()
```

The dialplan calls this script for any extension in our support queue:

```
; extensions.conf
[from-internal]
exten => 100,1,AGI(/opt/pipeline/call_handler.py)
exten => 100,n,Hangup()
```

`MixMonitor` does two things: it records the call to a WAV file, and it executes a command when the call ends (the `post_call.py` argument). This is the hook into the post-call pipeline.

---

## Speech-to-Text

I evaluated three options:

| Option | Accuracy (Persian) | Latency | Cost |
|---|---|---|---|
| Google Cloud Speech | High | Low | Per-minute billing |
| Whisper large-v3 (local) | High | Moderate | One-time GPU cost |
| Whisper medium (local CPU) | Good | High (~4x real-time) | Zero |

We went with **Whisper large-v3 on a local GPU** — the calls contain names, product codes, and internal terminology that cloud APIs struggled with unless you provided vocabulary hints. Local inference also keeps customer call data off third-party servers, which matters for compliance.

The tradeoff is latency. Whisper processes audio in fixed windows. For real-time transcription, I streamed audio in 5-second chunks:

```python
import whisper
import numpy as np
import queue
import threading

model = whisper.load_model("large-v3")

def transcribe_stream(audio_queue: queue.Queue, transcript_callback):
    buffer = np.array([], dtype=np.float32)
    while True:
        chunk = audio_queue.get()
        if chunk is None:  # sentinel: call ended
            break
        buffer = np.concatenate([buffer, chunk])
        # Process when buffer reaches ~5 seconds at 16kHz
        if len(buffer) >= 80_000:
            result = model.transcribe(
                buffer,
                language="fa",
                task="transcribe",
                fp16=True
            )
            transcript_callback(result["text"])
            # Keep last 1 second for context continuity
            buffer = buffer[-16_000:]
```

**Persian-specific consideration**: Whisper's Persian accuracy drops on technical vocabulary and product names. I added a post-processing step that substitutes known product codes and names using a regex pass over the transcript before it enters the NLP pipeline.

---

## Intent Classification

"Intent" in our context means: why did the customer call? Categories: order status inquiry, complaint, return request, product question, payment issue, other.

I didn't use an LLM for this. LLMs are slow (~2s per call) and expensive at scale. Instead, I fine-tuned a smaller transformer classifier:

- **Base model**: `HooshvareLab/bert-fa-base-uncased` (ParsBERT)
- **Training data**: 800 manually labeled call transcripts, augmented to 2,400 via synonym replacement
- **Inference time**: ~120ms per transcript
- **Accuracy**: 91% on held-out test set

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

INTENT_LABELS = [
    "order_status", "complaint", "return_request",
    "product_question", "payment_issue", "other"
]

tokenizer = AutoTokenizer.from_pretrained("./models/intent_classifier")
model = AutoModelForSequenceClassification.from_pretrained("./models/intent_classifier")
model.eval()

def classify_intent(transcript: str) -> dict:
    inputs = tokenizer(
        transcript,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = torch.softmax(logits, dim=-1).squeeze()
    top_idx = probs.argmax().item()
    return {
        "intent": INTENT_LABELS[top_idx],
        "confidence": probs[top_idx].item(),
        "all_probs": {l: p.item() for l, p in zip(INTENT_LABELS, probs)}
    }
```

When confidence is below 0.70, we flag the call for manual review rather than auto-classifying. About 8% of calls fall into this bucket — mostly calls that straddle two intent categories.

---

## Summarization

For summarization I did use an LLM — specifically, an OpenAI GPT-4o call triggered post-call. The latency doesn't matter here (call is already over), and summary quality matters a lot more than speed.

The prompt is structured to extract exactly what the operations team wants:

```python
SUMMARY_PROMPT = """You are analyzing a customer support call transcript. 
Extract the following in Persian:

1. Call reason (1 sentence)
2. Key issues raised (bullet points)  
3. Resolution/outcome (1 sentence, or "Unresolved" if no resolution)
4. Required follow-up (if any)
5. Customer sentiment: positive / neutral / negative / frustrated

Transcript:
{transcript}

Respond in structured JSON with keys: reason, issues, outcome, followup, sentiment
"""

def summarize_call(transcript: str) -> dict:
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a precise call analysis assistant."},
            {"role": "user", "content": SUMMARY_PROMPT.format(transcript=transcript)}
        ],
        response_format={"type": "json_object"},
        temperature=0
    )
    return json.loads(response.choices[0].message.content)
```

`temperature=0` and `response_format: json_object` make the output deterministic and parseable. Without these, you get varying JSON structure that breaks your downstream database writes.

---

## Post-Call Pipeline

When the call ends, Asterisk triggers `post_call.py` with the call ID. The script:

1. Loads the WAV recording from `/var/spool/asterisk/monitor/{call_id}.wav`
2. Runs Whisper on the full recording (more accurate than the chunked real-time transcript)
3. Runs intent classification
4. Runs summarization
5. Writes everything to the database
6. Triggers alerts if needed (complaint + frustrated sentiment → immediate Telegram notification to supervisor)

```python
def process_completed_call(call_id: str):
    wav_path = f"/var/spool/asterisk/monitor/{call_id}.wav"
    meta = db.get_call_metadata(call_id)

    # Full-recording transcription (more accurate than real-time chunks)
    transcript = transcribe_full(wav_path)

    intent = classify_intent(transcript)
    summary = summarize_call(transcript)

    db.save_call_analysis(
        call_id=call_id,
        transcript=transcript,
        intent=intent["intent"],
        intent_confidence=intent["confidence"],
        summary=summary,
        duration=meta["duration"],
        agent_id=meta["agent_id"]
    )

    if summary["sentiment"] == "frustrated" and intent["intent"] == "complaint":
        send_supervisor_alert(call_id, summary, meta["agent_id"])
```

---

## Production Issues We Hit

**Whisper failing on calls with background noise.** Our office has ambient noise that bleeds into calls. Added a noise reduction step using `noisereduce` before transcription — reduced WER (word error rate) by ~15% on noisy calls.

**AGI script timing out.** Asterisk has a default AGI timeout of 2 seconds. Our script needed longer for setup. Fixed by setting `AGITimeout` in `asterisk.conf` and making the AGI script respond immediately before doing any heavy work (spawn subprocess, then return control to Asterisk).

**MixMonitor race condition.** Occasionally the post-call script started before MixMonitor finished writing the WAV file. Fixed by checking file size stability before processing:

```python
def wait_for_file_ready(path, timeout=30):
    prev_size = -1
    for _ in range(timeout):
        size = os.path.getsize(path)
        if size == prev_size and size > 0:
            return True
        prev_size = size
        time.sleep(1)
    return False
```

**Database connection pooling.** The post-call script spawns a new process per call. At peak hours (100+ simultaneous calls), this created too many DB connections. Moved to a queue-based architecture — calls are pushed to a Redis queue, and a pool of 4 worker processes drain the queue. Bounded connections, smoother load.

---

## Lessons

**Use a fast local classifier for real-time tasks, an LLM for quality tasks.** Intent classification needs to be fast and scalable — fine-tuned BERT handles thousands of calls cheaply. Summarization needs quality — LLM is worth the cost for post-call use where latency doesn't matter.

**Asterisk's hooks are more capable than they look.** MixMonitor's post-call command, AGI, and AMI together give you deep integration without modifying Asterisk itself. Learn the hooks before reaching for a full CTI framework.

**Audio quality dominates STT accuracy.** Noise reduction, sample rate normalization, and silence trimming gave more accuracy improvement than switching from Whisper medium to Whisper large. Fix the audio first.

**Design for the race conditions.** File systems, audio buffers, and call state are all asynchronous. Any integration that triggers on call hangup will hit race conditions. Design for them explicitly from day one.
