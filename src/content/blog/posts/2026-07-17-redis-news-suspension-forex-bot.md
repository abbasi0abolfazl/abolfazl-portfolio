---
title: "Redis-Cached News Suspension for a Forex Trading Bot: Pausing Trades Before High-Impact Events"
date: "2026-07-17"
excerpt: "High-impact economic news events — NFP, CPI, Fed decisions — can spike volatility 10x in seconds and stop-hunt any open position. Here's how I built a Redis-cached news suspension system that automatically pauses and resumes an automated Forex bot around these events."
tags: ["Trading", "Redis", "Python", "MetaTrader", "System Design"]
---

# Redis-Cached News Suspension for a Forex Trading Bot: Pausing Trades Before High-Impact Events

## The Problem with Automated Trading Around News

Automated trading bots are great at consistent execution. They follow rules without hesitation, sleep for microseconds, and never panic-close a position. But they have one catastrophic weakness: they don't know when to *stop*.

In Forex markets, high-impact economic news events — Non-Farm Payrolls, CPI releases, Fed interest rate decisions, GDP prints — can move a currency pair by 100–200 pips in seconds. Spreads widen to 10–20x normal. Stop-loss orders don't execute at your specified price — they execute at whatever price the market is at when the broker can fill them, which might be 50 pips away.

An automated bot running through one of these events with open positions and pending orders is not trading — it's gambling. The volatility invalidates every technical signal that justified the trade.

The solution is a news suspension system: the bot monitors an economic calendar, pauses trading before high-impact events, closes or hedges any open positions, and resumes after the volatility spike settles.

---

## Architecture

```
Economic Calendar API (myfxbook / forexfactory RSS)
     │
     ▼
News Fetcher (Python, runs every 15 min)
     │
     ├── Filters for high-impact events affecting traded pairs
     │
     └── Writes to Redis:
         Key: "suspension:{pair}"
         Value: {"event": "NFP", "scheduled": "2024-03-01T13:30:00Z",
                 "suspended_from": "2024-03-01T13:00:00Z",
                 "resume_after": "2024-03-01T14:00:00Z"}
         TTL: set to expire at resume_after time

Trading Bot
     │
     ├── Before placing any order: checks Redis for suspension key
     │   If key exists → skip, log "Suspended: {event}"
     │   If no key → proceed normally
     │
     └── Periodic sweep: checks all open positions against suspension list
         If position open + suspension active → close or hedge
```

Redis is the right tool here because:
1. **Shared state**: suspension status needs to be visible to all bot processes (I run 5 concurrent strategy workers)
2. **TTL**: Redis key expiry automatically "resumes" trading when the news window passes — no cron job needed to clean up
3. **Fast reads**: checking suspension before each order is in the hot path; Redis read latency is sub-millisecond

---

## News Data Source

I used the ForexFactory economic calendar RSS feed. It's free, reliable, and covers all major events with impact rating (low/medium/high/holiday).

```python
import feedparser
from datetime import datetime, timedelta, timezone
import re

FOREXFACTORY_RSS = "https://nfs.faireconomy.media/ff_calendar_thisweek.json"

PAIR_TO_CURRENCIES = {
    "EURUSD": ["EUR", "USD"],
    "GBPUSD": ["GBP", "USD"],
    "USDJPY": ["USD", "JPY"],
    "XAUUSD": ["USD"],  # Gold: primarily USD events
    "AUDUSD": ["AUD", "USD"],
}

def fetch_high_impact_events(pairs: list[str]) -> list[dict]:
    response = requests.get(FOREXFACTORY_RSS, timeout=10)
    events = response.json()

    relevant_currencies = set()
    for pair in pairs:
        relevant_currencies.update(PAIR_TO_CURRENCIES.get(pair, []))

    return [
        event for event in events
        if event["impact"] == "High"
        and event["currency"] in relevant_currencies
    ]
```

The JSON endpoint returns the current week's events with timestamps in UTC — cleaner to parse than the RSS XML version.

---

## Writing Suspensions to Redis

Each high-impact event generates suspension windows for every pair that includes the event's currency. I suspend trading 30 minutes before the event and resume 30 minutes after (configurable — some traders prefer 60 minutes post-event for volatile releases like NFP).

```python
import redis
from datetime import datetime, timedelta, timezone
import json

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

SUSPENSION_BUFFER_BEFORE = timedelta(minutes=30)
SUSPENSION_BUFFER_AFTER = timedelta(minutes=30)

def schedule_suspension(event: dict, pair: str):
    event_time = datetime.fromisoformat(event["date"]).replace(tzinfo=timezone.utc)
    suspend_from = event_time - SUSPENSION_BUFFER_BEFORE
    resume_after = event_time + SUSPENSION_BUFFER_AFTER

    now = datetime.now(timezone.utc)
    if resume_after < now:
        return  # Event already passed

    key = f"suspension:{pair}"
    value = json.dumps({
        "event": event["title"],
        "currency": event["currency"],
        "scheduled": event_time.isoformat(),
        "suspended_from": suspend_from.isoformat(),
        "resume_after": resume_after.isoformat(),
        "pair": pair
    })

    # TTL: seconds until the suspension window ends
    ttl_seconds = int((resume_after - now).total_seconds())
    if ttl_seconds > 0:
        r.setex(key, ttl_seconds, value)

def refresh_suspension_schedule(pairs: list[str]):
    events = fetch_high_impact_events(pairs)
    for event in events:
        affected_pairs = [
            pair for pair in pairs
            if event["currency"] in PAIR_TO_CURRENCIES.get(pair, [])
        ]
        for pair in affected_pairs:
            schedule_suspension(event, pair)
```

The `setex` command sets the key with a TTL — when the key expires, trading automatically resumes for that pair. No explicit "resume" logic needed.

---

## Checking Suspension Before Placing Orders

Every trade request goes through a single function before hitting MetaTrader:

```python
def is_pair_suspended(pair: str) -> tuple[bool, dict | None]:
    key = f"suspension:{pair}"
    raw = r.get(key)
    if raw is None:
        return False, None

    suspension = json.loads(raw)
    now = datetime.now(timezone.utc)
    suspend_from = datetime.fromisoformat(suspension["suspended_from"])

    if now >= suspend_from:
        return True, suspension

    return False, None  # Key exists but suspension window hasn't started yet

def place_order(pair: str, direction: str, lot_size: float, sl: float, tp: float):
    suspended, info = is_pair_suspended(pair)
    if suspended:
        logger.info(
            f"Order blocked — {pair} suspended for {info['event']} "
            f"(resumes {info['resume_after']})"
        )
        return None

    # Proceed with MetaTrader order placement
    return mt5.order_send({
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": pair,
        "volume": lot_size,
        "type": mt5.ORDER_TYPE_BUY if direction == "buy" else mt5.ORDER_TYPE_SELL,
        "sl": sl,
        "tp": tp,
        "comment": "bot_v2"
    })
```

The `is_pair_suspended` check handles the case where the key exists but the suspension window hasn't started — the news fetcher writes the key in advance (up to a week ahead for scheduled releases), so the key can be present for an event that's days away.

---

## Handling Open Positions During Suspension

Writing new orders is blocked by the check above. But what about positions already open when a suspension window starts?

I have a periodic sweep (runs every 5 minutes) that checks all open positions:

```python
def manage_open_positions_during_suspension():
    positions = mt5.positions_get()
    if positions is None:
        return

    for pos in positions:
        suspended, info = is_pair_suspended(pos.symbol)
        if not suspended:
            continue

        # Strategy: close the position before the news event
        # Alternative: hedge by opening an opposite position of the same size
        action = get_suspension_action(pos.symbol)  # "close" or "hedge"

        if action == "close":
            close_result = mt5.order_send({
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": pos.symbol,
                "volume": pos.volume,
                "type": mt5.ORDER_TYPE_SELL if pos.type == 0 else mt5.ORDER_TYPE_BUY,
                "position": pos.ticket,
                "comment": f"news_suspension:{info['event']}"
            })
            logger.info(f"Closed position {pos.ticket} for news suspension: {info['event']}")

        elif action == "hedge":
            # Open opposite position to neutralize exposure
            mt5.order_send({
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": pos.symbol,
                "volume": pos.volume,
                "type": mt5.ORDER_TYPE_SELL if pos.type == 0 else mt5.ORDER_TYPE_BUY,
                "comment": f"hedge:{info['event']}:{pos.ticket}"
            })
```

The choice between close and hedge is configurable per pair. For high-liquidity pairs (EURUSD), I close — spreads recover quickly and re-entering after news is straightforward. For pairs with wider normal spreads (XAUUSD), hedging is sometimes cheaper than paying the closing spread twice.

---

## Refreshing the Calendar

A cron job runs every 15 minutes to refresh the suspension schedule:

```python
# refresh_schedule.py — runs via cron: */15 * * * *
from suspension import refresh_suspension_schedule

ACTIVE_PAIRS = ["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "AUDUSD"]

if __name__ == "__main__":
    refresh_suspension_schedule(ACTIVE_PAIRS)
    print(f"Schedule refreshed: {datetime.now().isoformat()}")
```

15-minute refresh is more than sufficient — economic calendars publish events days or weeks in advance and rarely change (revisions happen, but usually hours before an event at the earliest). The 30-minute pre-event buffer provides enough margin even if the refresh runs late.

---

## Edge Cases and What Failed

**Unscheduled events.** Some market-moving events have no advance warning — central bank emergency announcements, geopolitical events, flash crashes. The news suspension system doesn't help here. For these, the risk management layer (max drawdown circuit breaker, position size limits) is the defense. No news system catches everything.

**Time zone confusion.** ForexFactory events are in US Eastern time. MetaTrader broker times are often UTC+2 or UTC+3. I standardized everything to UTC internally after burning an hour debugging a suspension that fired 2 hours late.

**Redis connection failure.** If Redis is down, `r.get()` throws. I added a fallback: if the Redis check fails, assume suspended and block the trade. Safe-by-default.

```python
def is_pair_suspended(pair: str) -> tuple[bool, dict | None]:
    try:
        key = f"suspension:{pair}"
        raw = r.get(key)
        # ... rest of logic
    except redis.RedisError as e:
        logger.error(f"Redis error during suspension check: {e}")
        return True, {"event": "REDIS_UNAVAILABLE"}  # fail safe
```

**Suspension not wide enough for volatile releases.** NFP moves can take 90–120 minutes to settle, not 30. After two instances where the bot re-entered a position 30 minutes post-NFP and got caught in the second volatility wave, I extended the post-NFP buffer to 90 minutes specifically for USD-related pairs on the first Friday of the month.

---

## Results

Over 6 months of live operation:
- **Zero positions open during a high-impact event** (100% suspension coverage on scheduled events)
- **43 suspension events** triggered across all pairs
- **18 positions closed pre-emptively** due to suspension — several of which would have been loss-making based on post-event price action
- Estimated avoided slippage and adverse moves: significant, though impossible to calculate precisely since we don't know what the bot would have done

---

## Lessons

**TTL-based expiry is cleaner than explicit resume logic.** Setting the Redis key to expire at `resume_after` means the suspension self-cleans. One less cron job, one less failure mode.

**Fail safe on infrastructure errors.** If your suspension check can't reach Redis, the safe answer is "assume suspended and don't trade" — not "assume safe and proceed." The cost of a missed trade is recoverable. The cost of a stop-hunt during NFP is not.

**30 minutes pre-event is usually enough, 30 minutes post-event often isn't.** Volatility before a news event is mild (market positioning). Volatility after is where the real moves happen. Err toward wider post-event buffers for the biggest releases.

**This doesn't replace risk management — it complements it.** News suspension handles scheduled volatility. Unscheduled events, broker outages, and flash crashes are handled by the risk management layer (hard stop-loss, max drawdown kill switch). Both layers are necessary.
