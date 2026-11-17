---
title: What a playtest keeps
description: Which changes are thrown away when a playtest stops, and which are kept
---

# What a playtest keeps

Like the [sessions](switching-sessions.md) you just switched between, a playtest runs in its own tabs, on its own copy of the world.

## What is discarded and what is kept

Changes made in a playtest are never copied back automatically to the world you are editing.

| What | When the playtest stops |
|---|---|
| Parts that moved, fell, broke or were destroyed | Discarded; your world is as it was when you pressed play. |
| Objects created by scripts during a playtest | Discarded: they existed only in the copy. |
| Players, their characters, their leaderboard values and their tools | Discarded: they belong to the running game. |
| Property changes made in the Properties panel on a Server or Player tab | Discarded. |
| Objects you moved, rotated or resized with the Server tab's tools | Discarded. |
| Changes made from the Script Console's command bar on a playtest tab | Discarded. |
| Edits to script files in a script tab during a playtest | Kept: script files belong to the world you are editing. |
| Data your scripts saved with the data system | Kept: saved data is stored outside the world. |
| The Script Console's text | Kept, until the next playtest starts and clears it. |

## Saved data between playtests

For how saved data carries over from one playtest to the next, see [Data in a playtest](../players/saving-data.md#data-in-a-playtest).

When a world [saves progress](../players/saving-data.md), "it works the first time but not the second" often means the second playtest loaded what the first one saved.
