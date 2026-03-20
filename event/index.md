---
title: "Clarechen Events"
activeEvents:
  - Welcome-to-the-World-Party
---

# Events Management

This is the master control file for all events on Clarechen.com.au.

## How It Works

- The `activeEvents` list above controls which events appear on the homepage
- Event detail pages will still work for any event in the `/events/` folder
- To show/hide an event, add or remove it from the `activeEvents` list

## Available Events

All event markdown files in `/event/events/`:
- `Welcome-to-the-World-Party.md`
- `design-workshop.md`

## To Show an Event

Add the event filename (without .md) to the `activeEvents` list:
```yaml
activeEvents:
  - Welcome-to-the-World-Party
  - design-workshop
```

## To Hide an Event

Remove it from the `activeEvents` list:
```yaml
activeEvents:
  - Welcome-to-the-World-Party
```
