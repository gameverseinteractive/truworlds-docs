---
title: When a world runs slowly
description: Find what slows a playtest, with quick checks and on-screen statistics
---

# When a world runs slowly

When a playtest is slow, start with the cheap checks.

## The cheap checks

If a playtest is smooth with 1 Player and slow with 4 Players, your computer is the limit, not your world. Every player session is a full running copy of the world, so four players need noticeably more memory and processor time than one. Use the smallest number of players that tests what you need.

If a playtest with Simulate Physics is slow with nobody in it, the cause is in the world or in server scripts. When a playtest is slow, detach a script you suspect and try again, and look for per-frame prints.

## The on-screen statistics

A playtest tab can show a small box of live numbers in the corner of its view: FPS (frames per second), Ping and Quality.

Press F8 while the view has the keyboard to show or hide the statistics box, and F9 while it is shown to step through more detailed views.

## Troubleshooting

| What you see | Fix |
|---|---|
| TruWorlds Creator is slow with four players. | Use the smallest number of players that tests what you need; see [The cheap checks](#the-cheap-checks). |
