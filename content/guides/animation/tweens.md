---
title: Tweens
description: Animate properties smoothly on a player's device
---

# Tweens

A tween changes a property smoothly over time: from its current value to a value you choose, over a number of seconds, along an easing curve.

## Playing a tween

The third argument of [Tween.Play](api:Tween.Play) and [Tween.Create](api:Tween.Create) is a table of property names and end values.

## Example: A part that fades out

This client script, attached to a [Part](api:Part) in `world`, fades this player's copy of the part out over one and a half seconds.

```truscript
local params = new TweenParams(1.5)
Tween.Play(this, params, { Transparency = 1 })
```

## Tweens run only on a device

> [!WARNING]
> Tweens work in client scripts only.

`Tween.Play` is not available on the server; calling it there is an error.

A tween is never sent over the network: it changes only the copy on the device that started it. Other players do not see it, and the server does not know about it. Tween in a client script, and use a [RemoteEvent](api:RemoteEvent) to [start the tween on every device](../networking/remote-communication.md#telling-players).

Do not tween motion the game depends on (a platform players ride): [move it on the server with physics](../networking/physics-interpolation.md#how-you-move-a-thing).

## Repeating and reversing

The order of the arguments of `new TweenParams` is fixed: time, func, trans, delay, repeat, reverses.

[repeat](api:TweenParams.Repeat) is the extra runs after the first: `0` plays once, `2` plays three times, `-1` repeats forever. When [reverses](api:TweenParams.Reverses) is `true`, every second run goes backwards, from the end values to the start values. It needs a `repeat` of 1 or more, or -1.

To set `repeat` in `new TweenParams`, also give `func`, `trans` and `delay`.

## Example: A bobbing, spinning pickup

This client script, attached to an anchored [Part](api:Part) in `world`, bobs the part up and down and spins it around its vertical axis, with two tweens that repeat forever.

```truscript
local bob = new TweenParams(1.2, EasingFunc.Sine, EasingTrans.InOut, 0, -1, true)
Tween.Play(this, bob, { Position = this.Position + new Vector3(0, 1.5, 0) })

local spin = new TweenParams(3, EasingFunc.Linear, EasingTrans.In, 0, -1)
Tween.Play(this, spin, { Rotation = this.Rotation + new Vector3(0, 360, 0) })
```

## Play and Create

A tween from `Tween.Play` starts at once. A tween from `Tween.Create` starts when you call `Play()` on it; until then it is idle.

When it completes or is canceled, a tween from `Tween.Play` destroys itself; one from `Tween.Create` stays and can be played again.

Use `Tween.Play` to do something once and forget it. Use `Tween.Create` for animations you replay, pause or control: a hover effect, a pulsing light, a door that opens and closes.

Two tweens animating the same property at once overwrite each other every frame. [Cancel](api:TweenInstance.Cancel) the first tween before starting a second on the same property.

## Example: A button that grows on hover

This client script, attached to a [UIButton](api:UIButton) inside a [ScreenUI](api:ScreenUI) in `game.UICanvas`, grows the button while the pointer is over it and shrinks it back when the pointer leaves, with two kept tweens. Set the button's `Pivot` to (0.5, 0.5) so it grows from its center.

```truscript
local quick = new TweenParams(0.12, EasingFunc.Quad, EasingTrans.Out)
local grow = Tween.Create(this, quick, { Scale = new Vector2(1.1, 1.1) })
local shrink = Tween.Create(this, quick, { Scale = new Vector2(1, 1) })

func on_enter():
    shrink.Cancel()
    grow.Play()

func on_exit():
    grow.Cancel()
    shrink.Play()

this.PointerEnter.Connect(on_enter)
this.PointerExit.Connect(on_exit)
```

## What can be tweened

Whole numbers (such as a UI element's [ZIndex](api:UIObject.ZIndex)), booleans, strings, enums, instance references and [NumberValue.Value](api:NumberValue.Value) cannot be tweened.

Tween [Position](api:DynamicInstance.Position) or [CMatrix](api:DynamicInstance.CMatrix) only on anchored parts. An unanchored part tweened on `Position` or [CMatrix](api:CMatrix) is pulled away by gravity and collisions between the steps of the tween.

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says `Tween.Play() cannot be called on the server`. | Tween in a client script, and use a [RemoteEvent](api:RemoteEvent) to start the tween on every device. See [Tweens run only on a device](#tweens-run-only-on-a-device). |
| Two tweens animate the same property at once. | Cancel the first tween before starting a second on the same property. See [Play and Create](#play-and-create). |
