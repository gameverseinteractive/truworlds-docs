---
title: Waiting and tasks
description: Pause with wait, and run work side by side with spawn
---

# Waiting and tasks

A task is one piece of script code that is running or paused part-way through. A script can have many tasks at once: the script's top level is a task, every run of a signal handler is a task, and every function you start with [spawn](api:global/spawn) is a task. When one task pauses, the others carry on.

## Waiting

This server script, attached to any instance, prints 3, 2 and 1 with a one-second wait after each, then prints Go!.

```truscript
print("3")
wait(1)
print("2")
wait(1)
print("1")
wait(1)
print("Go!")
# Output, one line per second:
# 3
# 2
# 1
# Go!
```

It prints `3`, then `2`, then `1`, then `Go!`.

[wait](api:global/wait): `wait(seconds)` pauses for about `seconds` seconds. `wait()` pauses for the shortest possible time: until the next frame. `wait` returns the time that really passed, for example `0.2558` for `wait(0.25)`. For an accurate clock, see [Time and tweens](../animation/tweens.md).

## Long loops

A script that has a lot of work to do and never waits does not freeze the game. A task that is still busy when its share of the frame runs out is paused automatically, exactly where it is, and continues from the same spot shortly afterwards. Pausing a busy task automatically when its share of the frame runs out is called automatic yielding.

Do not check for something in a loop when a signal can tell you: use [Connect](api:Signal.Connect).

## Loops that never end

A loop that never ends is normal in a game script, as long as it waits. If the top level contains a loop that never ends, the script never reaches the lines after it.

> [!WARNING]
> Every endless loop should contain a `wait`. A loop with no wait does not freeze the game, but it uses its full share of every frame and slows down every other script.

## Starting a task with spawn

[spawn](api:global/spawn): `spawn(function)` starts a function as a new task and returns immediately. The code after `spawn` carries on without waiting for the function to finish. This server script, attached to a part, starts a function that blinks the part forever as a new task, then prints a line.

```truscript
func blink():
    while true:
        this.Transparency = 0.8
        wait(0.5)
        this.Transparency = 0
        wait(0.5)

spawn(blink)
print("The script keeps going")
# Output, immediately:
# The script keeps going
```

It prints `The script keeps going`.

The new task does not start inside the `spawn` call: the calling code continues first, and the new task begins the next time scripts run, normally on the next frame. The first argument of `spawn` must be a function you wrote in TruScript. Anything else is an error.

To spawn a function, write `spawn(blink)`, not `spawn(blink())`.

## Calls that pause

Calls that pause a task until something they wait for happens are called yielding calls. For methods that wait, see [Object members](../engine/properties-methods-signals.md#methods).

While a task waits, the world moves on: between the lines before and after a yielding call, other tasks run and time passes. The player may have left, the part may be gone, a value may have changed. After a yielding call, check again that what you are about to use is still valid.

| Call | Pauses until |
|---|---|
| [Wait](api:Signal.Wait): `signal.Wait()` | The signal next fires. |
| [WaitForChild](api:Instance.WaitForChild): `instance.WaitForChild(name, timeout)` | A child with that name exists, or the timeout runs out. |
| Members whose names end in `Async`, such as the data store's [GetAsync](api:DataStore.GetAsync) and [SetAsync](api:DataStore.SetAsync) | The answer arrives. |

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says the first argument of spawn must be a closure: `spawn: first argument must be a closure` | Write `spawn(blink)`, not `spawn(blink())`; see [Starting a task with spawn](#starting-a-task-with-spawn). |
