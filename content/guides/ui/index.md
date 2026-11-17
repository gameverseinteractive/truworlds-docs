---
title: User interface
description: "On-screen and in-world UI: where it lives, what it is made of, and its scripts"
---

# User interface

A user interface (UI) is everything a player sees and uses that is not the 3D world itself, from the coin counter in the corner to the label floating over a shop. Inside [`game.UICanvas`](canvas-and-screenui.md) you put one or more [`ScreenUI`](api:ScreenUI) objects. Each is a full-screen layer: a HUD, a menu, a pop-up. Inside a `ScreenUI` you put [elements](ui-objects.md): panels, text, buttons. There are only a handful of element types, and every interface is made by combining them:

- a panel
- [text](text.md)
- [a button](buttons-and-pointer.md)
- [a text box](text-input.md)
- a circle
- [a scroll panel](scroll-panels.md)
- three layout containers
- [an image](images.md), which you put inside a shape

## Placing elements

Elements can [contain other elements](position-and-size.md). [Anchors](anchors.md) tie an element to a corner, an edge or the whole of its parent, so that it stays put on every screen size. [Layout containers](layout-containers.md) arrange rows, columns and grids for you.

## Visibility, scripting and the 3D world

- [`Visible`](api:VisualInstance.Visible) and [`Transparency`](api:VisualInstance.Transparency) pass down on-screen UI as they do down the rest of the tree: [hiding a panel](showing-and-hiding.md) hides the buttons and text inside it, and a panel's `Transparency` is added to its children's.
- The server owns the game's facts, and talks with the [client scripts that run UI](scripting-ui.md) through values in the tree and through [`RemoteEvent`](api:RemoteEvent)s.
- A [`BillboardUI`](billboard-ui.md) shows the same elements in the 3D world instead of on the screen.
