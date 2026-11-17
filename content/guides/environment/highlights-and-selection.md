---
title: Highlights and selection
description: Make objects stand out with a highlight or a selection box
---

# Highlights and selection

A [`Highlight`](api:Highlight) draws a flat color over an object and everything inside it, optionally visible through walls. A [`SelectionBox`](api:SelectionBox) draws a wireframe box that you place and size from a script.

## Highlighting an object

Put a [`Highlight`](api:Highlight) inside a part, a model or a character to cover that object with one flat color.

This server script, attached to a part, covers it with the default light green fill.

```truscript
local marker = new Highlight() {
    Parent = this
}
```

A `Highlight` is a fill, not an outline: the whole shape is tinted with one color. It fills its parent and everything inside its parent, however deep. Its color is not affected by light or shadow, so a highlighted object stands out even in the dark.

## Highlight properties

| Property | What it does |
|---|---|
| [`FillColor`](api:Highlight.FillColor) | The color of a [`Highlight`](api:Highlight)'s fill. |
| [`DepthMode`](api:Highlight.DepthMode) | Where the fill shows, compared with whatever is in front of the object. |
| [`Transparency`](api:VisualInstance.Transparency) | How see-through the fill is: `0` is a solid color that hides the object's own colors, `1` is invisible. |

## Depth modes

| DepthMode | Where the fill shows |
|---|---|
| [`HighlightDepthMode.Visible`](api:HighlightDepthMode) | The default: the fill is drawn only on the parts of the object you can see; behind a wall, nothing shows. |
| `HighlightDepthMode.Occluded` | The fill is drawn only where the object is hidden behind something, so its shape shows through walls but looks normal in plain view. |
| `HighlightDepthMode.AlwaysOnTop` | The fill is drawn over the whole object, on top of everything, hidden or not. |

## Example: An objective that shows through walls

This server script, attached to a part or model that is the round's objective, shows the objective through walls, for every player.

```truscript
local marker = new Highlight() {
    Name = "ObjectiveMarker",
    FillColor = new Color3(1, 0.85, 0.2),
    DepthMode = HighlightDepthMode.Occluded,
    Transparency = 0.4,
    Parent = this
}
```

## Highlights on invisible parts

> [!WARNING]
> A [`Highlight`](api:Highlight) inside an invisible part (`Transparency = 1`) draws nothing. Set the `Highlight`'s `IgnoreParent` to `true`; see [`IgnoreParent`](../engine/visual-instances.md).

## Who sees a highlight

A [`Highlight`](api:Highlight) made in TruWorlds Creator or by a server script is seen by every player. A `Highlight` made by a [client script](../networking/replication.md) is seen only by that player.

> [!WARNING]
> An `Occluded` or `AlwaysOnTop` highlight made by the server reveals the object's position through walls to everyone, including opponents.

Create a highlight on your teammates in a client script, so the other team cannot see it.

## Drawing a selection box

A [`SelectionBox`](api:SelectionBox) does not follow or measure anything: it is drawn exactly where a script puts it, as big as the script makes it. It has no `Position`, `Size` or [`CMatrix`](api:CMatrix) properties: [`SetBoundsBox`](api:SelectionBox.SetBoundsBox) and [`SetCMatrix`](api:SelectionBox.SetCMatrix) are the only way to place it.

Build a `SelectionBox`'s [`BoundsBox`](../engine/data-types.md) centered on zero, from minus half the size to plus half the size.

Until a script calls `SetBoundsBox` and `SetCMatrix`, a `SelectionBox` is 5 by 5 by 5 studs, centered on the world origin.

| Member | What it does |
|---|---|
| [`SetBoundsBox`](api:SelectionBox.SetBoundsBox) | Sets the size of the box from a [`BoundsBox`](api:BoundsBox), in studs. |
| [`SetCMatrix`](api:SelectionBox.SetCMatrix) | Places and rotates the box in the world from a [`CMatrix`](api:CMatrix). |
| [`SelectionColor`](api:SelectionBox.SelectionColor) | The color of the box's edges where they can be seen. |
| [`SelectionXRayColor`](api:SelectionBox.SelectionXRayColor) | The color of the box's edges where they are hidden behind something. An alpha of `0` hides those edges. |

## Example: A wireframe box around a part

This client script, attached to a part, draws a cyan wireframe box exactly around the part.

```truscript
local outline = new SelectionBox() {
    Name = "Outline",
    SelectionColor = new Color4(0.2, 0.8, 1, 1),
    SelectionXRayColor = new Color4(0.2, 0.8, 1, 0.25),
    Parent = world
}

local half = this.Size / 2
outline.SetBoundsBox(new BoundsBox(-half, half))      # size: centered on 0, 0, 0
outline.SetCMatrix(this.CMatrix)                      # place: where the part is
```

## Following something that moves

When a [`SelectionBox`](api:SelectionBox) does not move with the part, call [`SetCMatrix`](api:SelectionBox.SetCMatrix) again, every frame for something that moves.

## Troubleshooting

| What you see | Fix |
|---|---|
| The other team can see your teammates' highlights. | Create the highlight in a client script. See [Who sees a highlight](#who-sees-a-highlight). |
| A [`SelectionBox`](api:SelectionBox) does not move with the part. | Call [`SetCMatrix`](api:SelectionBox.SetCMatrix) again, every frame for something that moves. See [Following something that moves](#following-something-that-moves) and [Drawing a selection box](#drawing-a-selection-box). |
