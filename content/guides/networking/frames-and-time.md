---
title: Frames and time
description: What happens inside one frame, when scripts run, and how to measure time
---

# Frames and time

A frame is one pass of the loop that advances the world. The server and every player's device each run their own loop, at their own speed, not synchronized with each other.

On a player's device, a frame happens once for every picture drawn: commonly 60 frames per second, higher on fast displays, lower on a slow device or in a heavy scene.

In a playtest, the server session and every player session run on your computer at the frame rate of the TruWorlds Creator window: on a 144 Hz display the server session runs about 144 frames per second, not 60. Do not tune anything to the frame rate you see in a playtest.

## FrameStepped and delta time

[TimeSystem](api:TimeSystem) marks the passing of frames. Reach it as `game.TimeSystem`.

Delta time is the seconds between one frame and the next.

[FrameStepped](api:TimeSystem.FrameStepped) fires once every frame, on the server and on each device separately. Its handler receives the delta time as `delta`.

`FrameStepped` is the only per-frame signal: there is none for "after scripts", "before drawing" or "every physics step".

## Multiply by delta

A [FrameStepped](api:TimeSystem.FrameStepped) handler that moves something a fixed amount each frame moves it seven times faster on a device drawing 144 frames per second than on one running the handler 20 times per second. Multiply speeds by `delta`: `position = position + velocity * delta`.

Do not multiply by `delta` for things that happen once (a jump impulse, firing a shot).

## Example: Moving a part at a steady speed

This client script, attached to a [Part](api:Part) in [world](api:global/world), moves the part along X at 6 studs per second using delta, beside a handler that moves it a fixed 0.1 studs per frame.

```truscript
local SPEED = 6          # studs per second

# WRONG: 0.1 studs per frame. Fast devices move the part faster.
func frame_dependent(delta):
    this.Position = this.Position + new Vector3(0.1, 0, 0)

# RIGHT: 6 studs per second on every device.
func frame_independent(delta):
    this.Position = this.Position + new Vector3(SPEED * delta, 0, 0)

game.TimeSystem.FrameStepped.Connect(frame_independent)
```

## Stopping a handler

A connected `FrameStepped` handler runs every frame for as long as its script runs. Keep the `FrameStepped` connection and [disconnect](api:SignalConnection.Disconnect) it when the work is over.

Each [Connect](api:Signal.Connect) adds another handler. When `FrameStepped` is connected inside another handler that runs again and again, connect it once, or disconnect the old connection first.

## Waiting inside a handler

If a [FrameStepped](api:TimeSystem.FrameStepped) handler pauses (with `wait`, for example), the next frame's run starts anyway, and the two overlap. Instead of calling [wait](api:global/wait) inside a `FrameStepped` handler, count time with `delta`, or use a loop.

## Loops with wait

A [wait](api:global/wait) always ends on a frame boundary. For anything slower than every frame, prefer a loop with a real delay (`wait(0.5)`): it costs nothing while it waits.

Many short waits added together drift. For a timer that must stay accurate, compare `host.time()` with a deadline instead of counting waits. See [Waiting and tasks](../scripting/waiting-and-tasks.md) for `wait`.

## When handlers run

A signal handler never runs inside the moment the signal fires; see [When handlers run](../scripting/signals-and-events.md#when-handlers-run).

An arriving [RemoteEvent](remote-communication.md) message does not interrupt a running script: its handler starts the next time scripts run, as its own task. A `wait` in a [RemoteEvent](api:RemoteEvent) handler pauses only that run; other messages start their own runs meanwhile, so two runs of one handler can overlap.

## Frames and physics steps

Scripts run once per frame, not once per physics step, so several physics steps may pass between two runs of your code. There is no signal that fires every physics step. See [Physics interpolation](physics-interpolation.md).

Do not simulate physics by hand in [FrameStepped](api:TimeSystem.FrameStepped) (adding gravity to a position, for example). Let the engine move unanchored parts, and steer them with [forces, movers and constraints](../physics/forces-and-movers.md), which are applied inside every physics step.

## Keep per-frame work small

`world.GetDescendants()` in a [FrameStepped](api:TimeSystem.FrameStepped) handler is a common cause of a slow game. Find things once and keep references, or keep your own list.

## Who keeps the time

A device's clock can be wrong, and its player can change it. Never let a device decide when something really happens: the server keeps the game's time.

## Troubleshooting

| What you see | Fix |
|---|---|
| A handler moves something by a fixed amount per frame. | Multiply speeds by `delta`. See [Multiply by delta](#multiply-by-delta). |
| A [FrameStepped](api:TimeSystem.FrameStepped) handler calls `wait`. | Count time with `delta`, or use a loop. See [Waiting inside a handler](#waiting-inside-a-handler). |
| [FrameStepped](api:TimeSystem.FrameStepped) is connected inside another handler, again and again. | Connect it once, or disconnect the old connection first. See [Stopping a handler](#stopping-a-handler). |
