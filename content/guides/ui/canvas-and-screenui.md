---
title: Canvas and ScreenUI
description: Where on-screen UI lives, who sees it, and how screens stack
---

# Canvas and ScreenUI

Building UI in TruWorlds Creator and building it from a script produce the same three-level structure: `game.UICanvas`, then a [`ScreenUI`](api:ScreenUI), then elements, as the [overview](index.md) lists.

## The UICanvas

A world has exactly one [`UICanvas`](api:UICanvas), the place all on-screen UI lives. Scripts reach it as `game.UICanvas`. Write `game.UICanvas` with `UI` in capitals.

## ScreenUI

A [`ScreenUI`](api:ScreenUI) is one full-screen layer of UI, and a world can have as many as you like. Each must be a direct child of `game.UICanvas`. A `ScreenUI` lets you [show, hide, fade](showing-and-hiding.md) and stack its elements as one.

Use one `ScreenUI` for each group of UI that appears and disappears together.

## Example: Hello in the corner of the screen

This [client script](../scripting/script-types.md), attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, puts the words "Hello!" in the top-left corner of this player's screen.

```truscript
local screen = new ScreenUI() {
    Name = "Greeting",
    Parent = game.UICanvas
}

local label = new UITextPanel() {
    Name = "Label",
    Text = "Hello!",
    TextSize = 32,
    Size = new Vector2(200, 60),
    Position = new Vector2(20, 20),
    Parent = screen
}
```

## Where a ScreenUI is shown

A [`ScreenUI`](api:ScreenUI) shows only as a direct child of `game.UICanvas`. Anywhere else, nothing appears and nothing complains. An element put directly in `game.UICanvas`, without a `ScreenUI`, draws nothing and reports no error. Elements show only inside a `ScreenUI` or a [`BillboardUI`](api:BillboardUI).

If UI built by a script shows nothing, check that the `ScreenUI`'s parent is `game.UICanvas` and that every element is inside it. Use the `ScreenUI`'s name to organize screens, instead of a [`Folder`](api:Folder) in the canvas.

| Where the [`ScreenUI`](api:ScreenUI) is | Shown |
|---|---|
| In `game.UICanvas`, directly | Is shown. |
| In a [`Folder`](api:Folder) inside `game.UICanvas` | Is not shown. |
| Inside another [`ScreenUI`](api:ScreenUI) or inside a UI element | Is not shown. |
| In [`world`](api:global/world) | Is not shown. For UI in the 3D world use a [`BillboardUI`](api:BillboardUI). |
| In `game.Storage` | Is not shown, so `game.Storage` can hold a template to clone into the canvas. |
| With no parent (just created with `new ScreenUI()`) | Is not shown until you set `Parent = game.UICanvas`. |

## Who sees the UI

> [!WARNING]
> The [`UICanvas`](api:UICanvas) is not private per player: if a server script sets `shop.Visible = true`, the shop opens on everyone's screen. Do anything that differs between players in a client script on that player's device.

| Made or changed by | Who sees it |
|---|---|
| UI built in TruWorlds Creator | Seen by every player: it is saved with the world and sent to each player when they join. |
| A server script that creates UI in `game.UICanvas` | Seen by [every player](../networking/replication.md), including players who join later. |
| A client script that creates UI in `game.UICanvas` | Seen only by the player whose device ran the script. |
| A server script that changes a property of existing UI | The change reaches every player. |
| A client script that changes a property of existing UI | Only that player sees the change. |

## Giving each player their own UI

One way to build personal UI: lay it out in TruWorlds Creator, then attach a client script that drives it. The other way: a [client script](scripting-ui.md) creates the [`ScreenUI`](api:ScreenUI) and its elements on the player's device.

UI lives in the [`UICanvas`](api:UICanvas), not in the character: when a character respawns, the UI is not rebuilt and scripts attached to it keep running.

## Example: Showing each player their own name

This client script, attached to a [`UITextPanel`](api:UITextPanel) inside a `ScreenUI` in `game.UICanvas`, shows the name of the player looking at this screen. Each device runs its own copy of this script, so each player sees their own name.

```truscript
local me = game.Players.LocalPlayer
this.Text = "Playing as " + me.Name
```

## Stacking screens with DisplayOrder

When two [`ScreenUI`](api:ScreenUI) objects overlap, [`DisplayOrder`](api:ScreenUI.DisplayOrder) decides which is in front. The higher number wins. With equal `DisplayOrder`, the `ScreenUI` later among the [`UICanvas`](api:UICanvas)'s children is on top.

An element whose [`ZIndex`](ui-objects.md#drawing-order) is 1000, in a screen whose `DisplayOrder` is 0, is still behind everything in a screen whose `DisplayOrder` is 1.

## Built-in interfaces are always on top

The built-in interfaces always draw above your [`ScreenUI`](api:ScreenUI) objects, whatever [`DisplayOrder`](api:ScreenUI.DisplayOrder) you choose. The read-only [`Priority`](api:ScreenUI.Priority) keeps the built-in interfaces on top: a higher `Priority` beats any `DisplayOrder`, and only TruWorlds can set it.

UI that you put in the top-left or top-right corner is partly hidden behind the built-in interfaces there. Check your HUD in a playtest with the [chat](../gameplay/chat.md) open, and move anything that ends up underneath.

## Troubleshooting

| What you see | Fix |
|---|---|
| UI built by a script never appears. | Check that the [`ScreenUI`](api:ScreenUI)'s parent is `game.UICanvas` and that every element is inside it. See [Where a ScreenUI is shown](#where-a-screenui-is-shown). |
| A [`ScreenUI`](api:ScreenUI) inside a [`Folder`](api:Folder) in the canvas does not show. | Use the [`ScreenUI`](api:ScreenUI)'s name to organize screens, instead of a [`Folder`](api:Folder) in the canvas. See [Where a ScreenUI is shown](#where-a-screenui-is-shown). |
| Opening a menu opens it for every player. | Have the server send that player a message, and let the player's client script open the window. See [Who sees the UI](#who-sees-the-ui) and [Server-driven UI](scripting-ui.md#server-driven-ui). |
| `game.UiCanvas` or `game.Canvas` gives an error. | Write `game.UICanvas` with `UI` in capitals. See [The UICanvas](#the-uicanvas). |
