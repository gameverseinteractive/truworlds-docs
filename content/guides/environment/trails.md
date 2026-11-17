---
title: Trails
description: Draw a fading ribbon behind a moving thing, such as a sword swing
---

# Trails

A [`Trail`](api:Trail) draws a fading ribbon between two points as they move.

## The ribbon's two ends

An [`Attachment`](../physics/constraints.md#attachments) is a point with a direction, fixed to a part. You give a [`Trail`](api:Trail) two attachments. A `Trail` is not a [`PointInstance`](api:PointInstance): it draws between two attachments, wherever the `Trail` itself is in the tree. An attachment must be a direct child of a part.

The distance between a `Trail`'s attachments is the width of the ribbon.

A trail only draws while its part moves, so it shows nothing until you move the part or start a playtest.

## Example: A sword swoosh

This server script, attached to a part that is a sword blade 4 studs long along its Y axis, adds a pale blue swoosh behind the blade whenever it moves.

```truscript
local tip = new Attachment() {
    Name = "TrailTip",
    CMatrix = new CMatrix(new Vector3(0, 2, 0)),       # top end of the blade
    Parent = this
}
local base = new Attachment() {
    Name = "TrailBase",
    CMatrix = new CMatrix(new Vector3(0, -1, 0)),      # part-way down
    Parent = this
}
local swoosh = new Trail() {
    Name = "Swoosh",
    Attachment0 = tip,
    Attachment1 = base,
    Lifetime = 0.3,
    Color = new Color3(0.6, 0.9, 1),
    Parent = this
}
```

## Trail properties

| Property | What it does |
|---|---|
| [`Attachment0`](api:Trail.Attachment0) | One end of the ribbon's edge. |
| [`Attachment1`](api:Trail.Attachment1) | The other end of the ribbon's edge. |
| [`Lifetime`](api:Trail.Lifetime) | How long a piece of ribbon takes to fade out completely, in seconds. |
| [`MinLength`](api:Trail.MinLength) | How far the edge must move, in studs, before a new piece is added. Lower is smoother. |
| [`Color`](api:Trail.Color) | The color of the ribbon. |

## Length and smoothness

A [`Trail`](api:Trail)'s [`Lifetime`](api:Trail.Lifetime) is the length of the trail in time. A fast-moving part with `Lifetime = 0.3` leaves a long streak; a slow one leaves a short one.

[`MinLength`](api:Trail.MinLength) is the smoothness: a small value follows curves closely, and a large one makes long straight pieces with visible corners.
