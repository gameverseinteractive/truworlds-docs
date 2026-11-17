---
title: Anchors
description: Pin or stretch an element as its parent changes size
---

# Anchors

Players' screens differ in size, so a coin counter placed 1700 pixels from the left because it looked right on your screen is off the edge of someone else's. With anchors, instead of "1700 pixels from the left" you say "attached to the top-right corner, 16 pixels in", and the counter stays in that corner on every screen size.

## The four anchors

Each element has four anchors, [`AnchorLeft`](api:UIObject.AnchorLeft), [`AnchorRight`](api:UIObject.AnchorRight), [`AnchorTop`](api:UIObject.AnchorTop) and [`AnchorBottom`](api:UIObject.AnchorBottom), each a fraction of the element's parent from `0` to `1`. All four are measured from the parent's top-left: `0` is the left (or top) edge, `0.5` the middle and `1` the right (or bottom) edge. `AnchorRight = 1` means the right edge of the parent, not one unit from the right.

Together the four anchors mark out a rectangle on the parent: the anchor area. When the two anchors in one direction are equal, the anchor area is a point in that direction: the element is pinned to it and keeps its own size. When the two anchors in one direction differ, the anchor area spans part of the parent, and the element stretches with that span.

For an element inside another element, anchors are fractions of the parent's content area, so the parent's [`Padding`](api:UIObject.Padding) insets them.

## Pinning to a corner

The element's [pivot](position-and-size.md#pivot) is the point attached to the anchor point. On a pinned element, [`Position`](api:UIObject.Position) is the offset in pixels from the anchor point to the pivot. To pin something into a corner, set three things to that corner: the anchors on the parent's corner, the pivot on the element's same corner, and `Position` as the gap.

Moving in from the right or bottom edge is a negative `Position` offset, because X grows to the right and Y downward.

With the default pivot `(0, 0)`, an element anchored to the parent's top-right corner hangs off the right side of the screen.

Typing six properties to pin one button is slow. [Quick Layout](../creator/ui-editor.md) in TruWorlds Creator sets the anchors, the pivot, the position and the size in one click.

## Example: A coin counter in the top-right corner

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes a coin counter that stays 16 pixels in from the top-right corner on every screen size.

```truscript
local screen = new ScreenUI() { Name = "Hud", Parent = game.UICanvas }

local coins = new UITextPanel() {
    Name = "Coins",
    Text = "125 coins",
    TextSize = 24,
    TextColor = Color4.FromHex("#FFFFFF"),
    TextAlignment = UITextAlignment.Center,
    TextVerticalAlignment = UITextVerticalAlignment.Center,
    Color = new Color4(0, 0, 0, 0.6),
    Roundness = 10,
    Size = new Vector2(180, 44),
    AnchorLeft = 1,                         # the parent's right edge...
    AnchorRight = 1,
    AnchorTop = 0,                          # ...and its top edge
    AnchorBottom = 0,
    Pivot = new Vector2(1, 0),              # the element's own top-right corner goes there
    Position = new Vector2(-16, 16),        # 16 left of the edge, 16 down from the top
    Parent = screen
}
```

## Stretching

On a stretched element [`Size`](api:UIObject.Size) is added to the stretch, and it starts at `(64, 64)`.

> [!WARNING]
> `Size` starts at `(64, 64)`, so on a stretched axis the element is 64 pixels too big. Whenever you stretch, set `Size` on that axis to `0`, or to the negative margin you want: `Size = Vector2.Zero`.

To fill the parent: `AnchorRight = 1, AnchorBottom = 1, Size = Vector2.Zero`, since [`AnchorLeft`](api:UIObject.AnchorLeft) and [`AnchorTop`](api:UIObject.AnchorTop) default to `0`. On a stretched axis, a negative `Size` makes the element narrower than the anchor area, which leaves a margin.

The horizontal and vertical pairs of anchors are independent: a bar across the top of the screen stretches horizontally and is pinned vertically.

Anchors spread over part of the parent, such as `0.25` to `0.75`, give a size that is a percentage of the parent.

## Example: A bar across the top of the screen

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes a 56 pixel tall bar across the full width of the top of the screen.

```truscript
local screen = new ScreenUI() { Name = "TopBarDemo", Parent = game.UICanvas }

local bar = new UIPanel() {
    Name = "TopBar",
    AnchorLeft = 0,
    AnchorRight = 1,                        # stretch: full width
    AnchorTop = 0,
    AnchorBottom = 0,                       # pin: to the top edge
    Size = new Vector2(0, 56),              # X adds nothing to the width; Y is the height
    Color = new Color4(0, 0, 0, 0.7),
    Parent = screen
}
```

## Anchors inside layout containers

Anchors do nothing on an element inside a [layout container](layout-containers.md), which places its children itself.

## Troubleshooting

| What you see | Fix |
|---|---|
| An element anchored to the right or bottom is off the screen. | To pin something into a corner, set three things to that corner: the anchors on the parent's corner, the pivot on the element's same corner, and [`Position`](api:UIObject.Position) as the gap. See [Pinning to a corner](#pinning-to-a-corner). |
| A stretched element is 64 pixels too wide or tall. | Set [`Size`](api:UIObject.Size) on that axis to `0`, or to the negative margin you want: `Size = Vector2.Zero`. See [Stretching](#stretching). |
| Anchors do nothing. | See [Anchors inside layout containers](#anchors-inside-layout-containers). |
