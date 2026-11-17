---
title: What is a script?
description: What a script is, when it runs, and when it stops
---

# What is a script?

A script is a text file in your world containing instructions written in TruScript.

## A first script

Every new script that TruWorlds Creator creates contains one line: `print("Hello, TruWorlds!")`. This server script, attached to any part in the world, prints it.

```truscript
print("Hello, TruWorlds!")
# Output in the Console panel when you start a playtest:
# Hello, TruWorlds!
```

It prints `Hello, TruWorlds!`. [print](api:global/print) writes a line to the Console panel.

<!-- screenshot: The Console panel during a playtest, showing the line Hello, TruWorlds! printed by the new script -->

To create a script on an instance, see [Files and components](script-components.md).

## When a script runs

A script runs only when all of these are true: it is attached to an instance, the world is being played, the instance is in a place where scripts run, the [script type](script-types.md) matches the side, and the script compiles. It starts when they all become true.

- A script file that is attached to nothing never runs. The only other way a file's code runs is when another script loads it with [import](api:global/import).
- The instance must be inside [world](api:global/world), `game.UICanvas` or `game.ScriptSystem`. Scripts on instances anywhere else, such as in `game.Storage`, do not start.
- A script with a syntax error does not start, and the error is written to the Console panel when play begins. Every script file is checked then, including files attached to nothing.

A script can seem to print nothing because it is a client script and you are looking at the server's console, or the other way round.

When your script prints nothing, check the conditions for a script to run. See [where an instance is active](../engine/instance-tree.md#where-an-instance-is-active).

## Scripts that belong to no object

For a script that belongs to no one part, such as a round timer, data saving or a "when a player joins" script, put an [Empty](api:Empty) or a [Folder](api:Folder) inside `game.ScriptSystem` and attach the script to that.

The systems directly under `game` (including `world` and `game.ScriptSystem` themselves) and a [Camera](api:Camera) refuse scripts: attaching a script to one of them from code is an error.

## One file, many copies

Attach the same file to ten parts and ten independent copies run, each with [this](api:global/this) set to its own part and each with its own variables.

Nothing is shared between the copies of a script unless you [share it on purpose](scripts-working-together.md), through the instance tree, a module script or an event.

Attaching the same file to the same instance twice runs it twice.

## The life of a script

The top level of a script is the code that is not inside any function. It runs once, from its first line to its last. After its last line, a script keeps doing things only if it set something up: a function connected to a signal, [a loop that waits, or a task started with spawn](waiting-and-tasks.md).

A script's variables stay alive after its top level finishes: a function connected to a signal can still read and change them. This server script, attached to a part, creates `count` once at the top level and remembers it between touches.

```truscript
local count = 0

func on_touch(other):
    count = count + 1
    print("Touched " + count + " times")

this.Touched.Connect(on_touch)
# Output as things touch the part:
# Touched 1 times
# Touched 2 times
# Touched 3 times
```

It prints `Touched 1 times`, then `Touched 2 times`, then `Touched 3 times`.

## When a script stops

A script stops when its instance is destroyed or removed, when it is detached, or when play ends. For what destroying or removing an instance does to its scripts, see [Creating and destroying](../engine/creating-and-destroying.md#scripts-on-a-destroyed-instance).

When a script stops, every task it started with [spawn](api:global/spawn), and every signal handler of it that was in the middle of waiting, is stopped where it is.

> [!WARNING]
> Code that is waiting when its script stops is abandoned: lines after the `wait` never run, and a pending `finally` block does not run either. Do not rely on code after the loop to clean up when an instance is destroyed.

## Troubleshooting

| What you see | Fix |
|---|---|
| Your script prints nothing. | Check the conditions for a script to run; see [When a script runs](#when-a-script-runs) and [Errors and debugging](errors-and-debugging.md). |
