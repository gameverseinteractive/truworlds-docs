---
title: Coroutines and yield
description: Pause a task with yield and resume it with a coroutine handle
---

# Coroutines and yield

A coroutine is a piece of running code that can pause in the middle, let everything else carry on, and continue later from exactly where it stopped, with all its variables intact. A coroutine is also called a task. The two words mean the same thing: one independently paused-and-resumed piece of running script code. For tasks in scripts, see [Waiting and tasks](../scripting/waiting-and-tasks.md).

## How scripts share time

Scripts are cooperative. Only one piece of script code runs at a time; a pausing call hands control back, and the code resumes later from the same point with all its variables intact.

It follows that two pieces of script code never run at the same instant (there are no data races, and you never need locks), and that nothing interrupts your code in the middle of a line: a statement is never half-done when another coroutine runs.

With variables shared between coroutines, what you must think about is anything that spans a pause.

## The yield statement

`yield` is a keyword that suspends the current coroutine on the spot.

> [!WARNING]
> In a TruWorlds script, do not use the bare `yield` statement to wait: a task that runs `yield` is paused until something explicitly resumes it, and nothing does that automatically: the lines after the `yield` never run. Use [wait()](api:global/wait) to give up the rest of the frame.

## Coroutine handles and Resume

What [spawn](api:global/spawn) gives back is a coroutine handle: an object that represents the coroutine it started. `Resume()` continues a suspended coroutine until its next pause or its end, then returns. Calling it on a coroutine that is not suspended (finished, failed, or the one running) is a runtime error.

Together, `yield` and `Resume()` let one piece of code park itself and another decide when it continues. So use `yield` only together with a coroutine handle that you resume yourself.

This server script, attached to any instance, is a gate that opens only when told to.

```truscript
func gate_keeper():
    print("gate: waiting to be opened")
    yield
    print("gate: opened!")

local gate = spawn(gate_keeper)

wait(3)
print("opening the gate")
gate.Resume()

# gate: waiting to be opened
# opening the gate          (three seconds later)
# gate: opened!
```

It prints `gate: waiting to be opened`, then `opening the gate`, then `gate: opened!`.

For almost every real task, a signal does the job of `yield` and `Resume()` better: any number of coroutines can wait on it, and it can carry values. See [signals](../scripting/signals-and-events.md).
