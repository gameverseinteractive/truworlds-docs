---
title: Position and size
description: How an element's rectangle comes from its parent, and sizing to contents
---

# Position and size

Every UI element ends up as a rectangle on the screen.

## Position and Size

[`Position`](api:UIObject.Position) and [`Size`](api:UIObject.Size) say where an element is and how big it is, in pixels. An element is placed relative to its parent, measured from the parent's top-left corner, not the screen's. Move the parent and everything inside moves with it.

`Position` is an offset in pixels from the element's [anchor point](anchors.md); with default anchors, the distance of its top-left corner from the parent's. `Y` grows downward.

> [!WARNING]
> You cannot change one number inside a [`Vector2`](api:Vector2) property: `panel.Position.X = 200` changes a copy, and the panel does not move, with no error. Assign a whole new value: `panel.Position = new Vector2(200, panel.Position.Y)`.

## Example: A panel placed on the screen

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes a 300 by 160 panel whose top-left corner is 120 pixels from the left of the screen and 80 from the top.

```truscript
local screen = new ScreenUI() { Name = "LayoutDemo", Parent = game.UICanvas }

local panel = new UIPanel() {
    Name = "Panel",
    Position = new Vector2(120, 80),
    Size = new Vector2(300, 160),
    Color = Color4.FromHex("#4682DC"),
    Parent = screen
}
```

## Pivot

[`Pivot`](api:UIObject.Pivot) says which point of the element [`Position`](api:UIObject.Position) places, as fractions of the element's own size. By default `Pivot` is `(0, 0)`: `Position` places the element's top-left corner.

The pivot is also the point an element turns around for [`Rotation`](api:UIObject.Rotation) and grows from for [`Scale`](api:UIObject.Scale), so use a center pivot for anything you spin, pulse or pop.

## Example: Two squares with different pivots

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, gives both squares `Position` (200, 200). The blue one hangs down and right from that point. The red one is centered on it, because its `Pivot` is the center.

```truscript
local screen = new ScreenUI() { Name = "PivotDemo", Parent = game.UICanvas }

local blue = new UIPanel() {
    Position = new Vector2(200, 200),
    Size = new Vector2(100, 100),
    Color = Color4.FromHex("#3366FF"),
    Parent = screen                         # covers (200, 200) to (300, 300)
}

local red = new UIPanel() {
    Position = new Vector2(200, 200),
    Size = new Vector2(100, 100),
    Pivot = new Vector2(0.5, 0.5),
    Color = Color4.FromHex("#FF4444"),
    Parent = screen                         # covers (150, 150) to (250, 250)
}
```

## MinSize and Padding

A freely placed element never becomes smaller than [`MinSize`](api:UIObject.MinSize), whatever [`Size`](api:UIObject.Size) and the anchors say. [`Padding`](api:UIObject.Padding) keeps a margin clear inside an element: `X` on the left and right, `Y` on the top and bottom. A child's `(0, 0)` is the top-left corner of the parent's content area, inside its padding.

## Fitting to contents

[`FitContents`](api:UIObject.FitContents) makes an element as big as what it holds, on `X`, `Y` or `XY`, instead of the size you give it. On a fitted axis, [`Size`](api:UIObject.Size) and the anchors' stretch are ignored, and [`MinSize`](api:UIObject.MinSize) still applies as a minimum.

For [text](text.md), `FitContents` measures the width without wrapping and the height at the final width, so "fixed width, fitted height" works for paragraphs.

When an element fits to its child elements, a child's anchors are not counted on the fitted axis, so a "fill the parent" child gives a fitted parent no size.

## Rotation and Scale

[`Rotation`](api:UIObject.Rotation) turns an element in degrees, clockwise, around its pivot. Rotations of nested elements add up. With the default pivot `(0, 0)` an element swings around its top-left corner. Set the pivot to `(0.5, 0.5)` to turn an element on the spot.

[`Scale`](api:UIObject.Scale) makes an element and everything in it look bigger or smaller, per axis: `(1, 1)` is normal size, `(2, 2)` double. `Scale` and `Rotation` are visual only: they never change layout, so neighbors are not pushed and a [`FitContents`](api:UIObject.FitContents) parent does not grow. Use [`Size`](api:UIObject.Size) for how big the element really is, and `Scale` for animation and feedback.

## Clipping

`ClipsChildren = true` cuts off everything inside the element at its rectangle, for all descendants. What is clipped cannot be seen or clicked: a click on the hidden part of a button goes to whatever is behind.

## Reading the result

[`Position`](api:UIObject.Position) and [`Size`](api:UIObject.Size) are what you asked for; [`AbsolutePosition`](api:UIObject.AbsolutePosition) and [`AbsoluteSize`](api:UIObject.AbsoluteSize) are what the element got, after [anchors](anchors.md), minimums, fitting and [layout containers](layout-containers.md).

Layout is worked out once per frame, so `AbsoluteSize` read on the line after a change gives the old answer. Wait a frame with [`wait()`](api:global/wait) before reading `AbsoluteSize` after a change.

`AbsolutePosition` and `AbsoluteSize` are `(0, 0)` before the element's first frame on screen, and whenever it is not inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas` or a [`BillboardUI`](api:BillboardUI) in `world`. When `AbsoluteSize` is `(0, 0)` or out of date, check that the element is inside a `ScreenUI` in the canvas.

## Troubleshooting

| What you see | Fix |
|---|---|
| Setting `element.Position.X = 100` does nothing. | See [Position and Size](#position-and-size). |
| An element is in the wrong place by exactly its parent's position. | See [Position and Size](#position-and-size). |
| A rotated element turns around its corner. | Set the pivot to `(0.5, 0.5)` to turn an element on the spot. See [Rotation and Scale](#rotation-and-scale). |
| `AbsoluteSize` is `(0, 0)` or out of date. | Wait a frame with `wait()` before reading `AbsoluteSize` after a change, and check that the element is inside a [`ScreenUI`](api:ScreenUI) in the canvas. See [Reading the result](#reading-the-result). |
