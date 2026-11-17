---
title: Scripting
description: "How scripts make a world act: where they run, and how they react and wait"
---

# Scripting

A door that opens, a coin that can be collected, a round timer, a score on screen: each is a [small program](what-is-a-script.md) written in TruScript and attached to an object in the world. Attaching a script file to an instance makes a [script component](script-components.md). Every script starts with three names already defined: [`this`, `game` and `world`](this-game-world.md).

## Where scripts run

The [script type](script-types.md) decides where the script runs: on the server, on each player's device, or wherever the script that loads it runs.

## Waiting, events and modules

- [Tasks](waiting-and-tasks.md) are how a script waits, and [handlers](signals-and-events.md) are how it reacts to signals.
- Scripts do not share variables, so scripts that need to [cooperate](scripts-working-together.md) communicate through something they can all reach.
- A [module script](modules-and-import.md) is written to be used by other scripts.
- A problem found before the script runs is a [syntax error](errors-and-debugging.md) (a compile error).
- A problem found while the script runs is a [runtime error](errors-and-debugging.md).
