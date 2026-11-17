---
title: Signals and events
description: React with Connect, Once and Wait, and know when handlers run
---

# Signals and events

You connect a function to a signal, and that function, called a handler, runs every time the signal fires. You do not call a handler yourself or loop to check whether something happened: TruWorlds calls it each time the signal fires. For [Connect](api:Signal.Connect), [Wait](api:Signal.Wait) and [Disconnect](api:SignalConnection.Disconnect), see [Signals](../engine/properties-methods-signals.md#signals).

## Connecting a handler

This server script, attached to a part, prints the name of the part and the name of whatever touches it, each time something touches it.

```truscript
func on_touch(other):
    print(this.Name + " was touched by " + other.Name)

this.Touched.Connect(on_touch)
# Output each time something touches the part (the second name depends on what touched it):
# Part was touched by Avatar
```

It prints `Part was touched by Avatar`, where the second name depends on what touched the part.

A signal can have any number of connections, from one script or from many. Each fire runs all of them.

> [!WARNING]
> Pass the function, do not call it: `this.Touched.Connect(on_touch)` is correct, while `this.Touched.Connect(on_touch())` runs `on_touch` at once with no argument and tries to connect what it returned.

Keep the connection that [Connect](api:Signal.Connect) or [Once](api:Signal.Once) gives in a variable if you will want to stop listening later. Letting the variable that holds a connection go out of scope does not disconnect it.

## Once and Wait

[Once](api:Signal.Once): `signal.Once(handler)` runs `handler` the next time the signal fires, then disconnects itself. [Wait](api:Signal.Wait): `signal.Wait()` pauses the calling code until the signal next fires, and gives the value the signal fired with. With a number, `signal.Wait(delaySeconds)` waits that many seconds more after the signal fires before returning.

`Wait` has no time limit: if the signal never fires, the code never continues.

## Each run is a task

Each run of a handler is a [task](waiting-and-tasks.md). A handler can wait: `wait()` inside a handler pauses only that run of it, not the signal, the other handlers or the rest of the script. If the signal fires again while an earlier run is still waiting, a second run starts alongside the first.

Guard against overlapping runs with a flag. This server script, attached to a part with a [ClickDetector](api:ClickDetector) child, turns the part green for two seconds when it is clicked, and ignores clicks while it is green.

```truscript
local clicker = this.WaitForChild("ClickDetector")
local busy = false

func on_click(player):
    if busy:
        return               # ignore clicks while the effect is running
    busy = true
    local before = this.Color
    this.Color = new Color3(0, 1, 0)
    wait(2)
    this.Color = before
    busy = false

clicker.MouseClick.Connect(on_click)
```

A flag that guards a handler against overlapping runs is a pattern usually called a debounce. [Touched](api:PhysicsInstance.Touched) needs the same guard; see [Touch and overlap](../physics/touch-and-overlap.md#cooldown-debounce).

## When handlers run

A handler never runs inside the moment the signal fires. When a signal fires, each connected handler is queued for its script and starts the next time TruWorlds runs scripts, which happens [once every frame](../networking/frames-and-time.md). Depending on what fired the signal and when in the frame, a queued handler starts later in the same frame or in the next frame.

Do not rely on a handler running in the same frame, or on it running a frame later: either can happen.

If a value changes three times in one frame, the [Changed](api:TruWorldsObject.Changed) handler runs three times afterwards, and each run sees the latest value, not the value at the moment of its fire. In a handler, read the current state again instead of assuming nothing has changed since the signal fired.

A fire whose handler is queued but has not started yet still runs after [Disconnect](api:SignalConnection.Disconnect).

When a handler must not act after you have switched it off, check a flag at the top of the handler.
