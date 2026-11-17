---
title: Showing and hiding UI
description: Visible and Transparency in UI, and fading a whole screen
---

# Showing and hiding UI

`Visible = false` on an element hides it and every element inside it. The children's own [`Visible`](api:VisualInstance.Visible) properties do not change when their parent is hidden: a child that was `true` still reads `true`; see [VisualInstance inheritance](../engine/visual-instances.md).

## Hiding a window

This client script, attached to a [`UIPanel`](api:UIPanel) named "Window" inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, hides and shows a window that contains a title, some text and buttons. One line hides or shows all of it.

```truscript
this.Visible = false        # the window and everything in it disappear
wait(2)
this.Visible = true         # everything is back exactly as it was
```

Hiding is how you close a window you will open again: it is cheap and keeps the window's state, such as the text the player typed, the scroll position and which tab was selected.

A hidden element cannot be clicked or hovered: the pointer goes straight through to whatever is behind, and if the pointer was over it when it was hidden, it gets a [`PointerExit`](api:UIObject.PointerExit).

## Hidden elements in a layout

A child with `Visible = false` of a [layout container](layout-containers.md) is skipped: it takes no space and the others move up to fill the gap.

To hide a layout child but keep its gap, do not use [`Visible`](api:VisualInstance.Visible): set `Transparency = 1`, and `BlocksPointer = false` so that it cannot be clicked. When a layout child leaves a gap because it is see-through, not hidden, and the others should move up, use `Visible = false`.

## Fading with Transparency

An element's [`Transparency`](api:VisualInstance.Transparency) fades everything the element draws: its fill, its border, its image and its text.

An element with `Transparency = 1` is invisible but still there: it still blocks the pointer and still takes its place in a layout. Finish a fade-out by setting `Visible = false`.

See [Tweening UI](scripting-ui.md#tweening-ui) for fades.

## Example: Fading out a panel

This client script, attached to a [`UIPanel`](api:UIPanel) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, fades the panel and everything in it out over half a second, then hides it.

```truscript
local fade = Tween.Play(this, new TweenParams(0.5), { Transparency = 1 })
fade.Completed.Connect(func():
    this.Visible = false
    this.Transparency = 0       # ready for the next time it is shown
)
```

## Hiding or fading a whole screen

When a [`ScreenUI`](api:ScreenUI)'s [`Visible`](api:VisualInstance.Visible) is false, everything inside it disappears and stops taking clicks, and nothing is destroyed: every element keeps its state for the next time you show it.

A `ScreenUI`'s own `Visible` and [`Transparency`](api:VisualInstance.Transparency) are applied once to the finished picture of its contents, instead of being added to each child.

When a solid window panel with a solid button on it is faded to `0.5`, the button, a child, is also drawn at `0.5`, so the window's fill shows through the button and overlapping parts look muddy.

When the `ScreenUI` of a solid window with a solid button on it is faded to `0.5` instead, the window and button are drawn solid and then the finished picture is faded, so the window fades like a single object. So, to fade a whole window or menu in and out, give it its own `ScreenUI` and fade that.

## Folders break the chain

For showing and fading, a [`Folder`](api:Folder) inside a UI breaks the chain: an element inside a folder does not inherit from the element above the folder.

Group the inside of something you intend to hide or fade as a whole with a [`UIPanel`](api:UIPanel) that has a fully transparent [`Color`](api:UIShape.Color), which draws nothing but passes [`Visible`](api:VisualInstance.Visible) and [`Transparency`](api:VisualInstance.Transparency) on.

## Troubleshooting

| What you see | Fix |
|---|---|
| After you fade a panel to `Transparency = 1`, you cannot click what is behind it. | Finish a fade-out by setting `Visible = false`. See [Fading with Transparency](#fading-with-transparency). |
| Fading a window makes the buttons look washed out, and the window shows through them. | Give the whole window or menu its own [`ScreenUI`](api:ScreenUI) and fade that. See [Hiding or fading a whole screen](#hiding-or-fading-a-whole-screen). |
| A hidden row leaves no gap, but you wanted the gap. | Do not use `Visible`: set `Transparency = 1`, and `BlocksPointer = false` so that it cannot be clicked. See [Hidden elements in a layout](#hidden-elements-in-a-layout). |
| A hidden row leaves a gap, but you wanted the others to move up. | Use `Visible = false`. See [Fading with Transparency](#fading-with-transparency) and [Hidden elements in a layout](#hidden-elements-in-a-layout). |
