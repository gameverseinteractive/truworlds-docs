---
title: Billboard UI
description: Put UI in the 3D world, attached to a part
---

# Billboard UI

A [`BillboardUI`](api:BillboardUI) draws the same kind of UI as a [`ScreenUI`](api:ScreenUI), but in the 3D world: a name over a shop, a health bar over an enemy, a price tag on an item. Like a `ScreenUI`, a `BillboardUI` is a container: you put ordinary UI elements inside it. The elements inside a `BillboardUI` are laid out on a small flat rectangle, the billboard's canvas, which is shown in the world at the billboard's position.

## Where a billboard goes

A [`BillboardUI`](api:BillboardUI) shows only while it is somewhere inside `world`. In `game.Storage`, in [`game.UICanvas`](api:UICanvas) or with no parent it shows nothing.

To attach a billboard to a part, make the billboard a child of the part. A billboard's [`OffsetPosition`](api:PointInstance.OffsetPosition) is where it sits relative to its part, in the part's own directions: `new Vector3(0, 3, 0)` is three studs along the part's up from its center (see [`PointInstance`](../engine/point-instances.md)).

A billboard is centered on its point: half its width extends to each side, and half its height above and below. When a billboard is inside its part because it is centered on the part, set `OffsetPosition` to lift it clear.

## Example: A shop sign

This server script, attached to a [`Part`](api:Part), puts a "SHOP" label three studs above this part, for every player.

```truscript
local sign = new BillboardUI() {
    Name = "Sign",
    CanvasSize = new Vector2(200, 50),
    OffsetPosition = new Vector3(0, 3, 0),      # three studs above the part's center
    Parent = this
}

local label = new UITextPanel() {
    Text = "SHOP",
    FontName = FontName.LexendBold,
    TextSize = 32,
    TextColor = Color4.FromHex("#FFFFFF"),
    TextAlignment = UITextAlignment.Center,
    TextVerticalAlignment = UITextVerticalAlignment.Center,
    Color = new Color4(0, 0, 0, 0.6),
    Roundness = 12,
    AnchorRight = 1,                            # fill the whole canvas
    AnchorBottom = 1,
    Size = Vector2.Zero,
    Parent = sign
}
```

## Size and sharpness

Two numbers, [`CanvasSize`](api:BillboardUI.CanvasSize) and [`PixelsPerStud`](api:BillboardUI.PixelsPerStud), decide how big a billboard is and how sharp it looks. A billboard's width in studs is `CanvasSize.X / PixelsPerStud`, and its height in studs is `CanvasSize.Y / PixelsPerStud`.

To choose a billboard's size, decide its size in the world in studs, choose `PixelsPerStud`, multiply to get `CanvasSize`, then design the contents for that canvas.

## Which way it faces

| [`FacingMode`](api:BillboardUI.FacingMode) | How it turns |
|---|---|
| [Camera](api:Camera) | Turns fully to face the camera, tilting up and down as well, so it always looks flat-on. Use it for name tags, health bars, icons and markers. |
| `Upright` | Stays vertical and only turns left and right to face the camera, so from above you see it at an angle. Use it for signs and labels that should feel planted in the world. |
| `None` | Does not turn and keeps its own rotation, like a poster. Use it for screens, notice boards and signs on walls. |

## Same size at any distance

With `FixedSize = true` a billboard keeps the same size on the screen at any distance: a 200 by 50 canvas covers 200 by 50 UI pixels of the screen.

Use `FixedSize = false` for signs, labels on objects and health bars over enemies, and `FixedSize = true` for objective markers, waypoints and "press E" hints.

## Distance and walls

[`MaxDistance`](api:BillboardUI.MaxDistance) hides the billboard when the camera is more than that many studs away from it. `0` or a negative number means never. A billboard appears and disappears at once as the camera crosses its `MaxDistance`, with no built-in fade.

By default a wall between a billboard and the camera hides the billboard. With `AlwaysOnTop = true` a billboard is drawn over the world's geometry, so it is seen through walls and is never half-buried in its part. Leave [`AlwaysOnTop`](api:BillboardUI.AlwaysOnTop) off for labels that belong to an object, or players see a jumble of labels from rooms they are not in.

## Visibility

A billboard [inherits](showing-and-hiding.md) from its parent part: if the part is hidden, the billboard is hidden, and if the part has `Transparency = 1`, the billboard's elements are fully transparent. A label on an invisible marker part, a common setup, does not show.

Set `IgnoreParent = true` on a billboard to make it independent of its part.

## Who sees a billboard

When only one player can see a billboard because a client script created it, create it on the server for everyone. See the [replication rules](../networking/replication.md).

| Made or changed by | Who sees it |
|---|---|
| Placed in TruWorlds Creator, or created by a server script | Seen by every player. |
| Created by a client script | Seen only by that player. |
| Property changed by a server script | Changes for every player. |
| Property changed by a client script | Changes for that player only. |

## Troubleshooting

| What you see | Fix |
|---|---|
| The billboard is inside the part. | Set `OffsetPosition` to lift it clear. See [Where a billboard goes](#where-a-billboard-goes). |
| The label is seen through walls. | Leave `AlwaysOnTop` off for labels that belong to an object. See [Distance and walls](#distance-and-walls). |
| Only you can see the billboard. | Create it on the server for everyone. See [Who sees a billboard](#who-sees-a-billboard). |
