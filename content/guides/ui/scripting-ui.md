---
title: Scripting UI
description: Client scripts that build UI, show game data and ask the server
---

# Scripting UI

UI scripts are client scripts, because UI is drawn and clicked on each player's device. A server script attached to UI does run, on the server, but it never hears a button being pressed.

## Client or server

In UI the server owns the facts; the facts reach the device, as values in the tree or as messages; a client script shows them; and when the player asks for something through the UI, the client script sends a request and [the server](../networking/client-server-model.md) decides.

| Job | Client script or server script |
|---|---|
| Hearing a button being pressed, text being typed or the pointer hovering | A job for a client script, not a server script: these signals never fire on the server. |
| Knowing whose screen this is | A client script knows it (`game.Players.LocalPlayer`). A server script does not: it is `nil` on the server. |
| Changing UI for one player | A client script can, for one player only: any change it makes is local. A server script cannot: its changes reach everyone. |
| Animating UI with tweens | A client script can. A server script cannot: [`Tween`](api:Tween) is not available on the server. |
| Reading the screen size, the mouse and the keyboard | A client script can. A server script cannot. |
| Deciding what is true in the game (coins, health, who won) | A job for a server script, not a client script. Never trust the device. |
| Saving data | A job for a server script, not a client script. |

## Where a UI script goes

There are two good homes for a UI script: on the UI itself, and in `game.ScriptSystem`. Put scripts that drive on-screen UI on the UI element they control, as client scripts.

This client script, attached to a [`ScreenUI`](api:ScreenUI) in `game.UICanvas` that contains a [`UITextPanel`](api:UITextPanel) named "Greeting", sets the Greeting text panel to greet this player by name.

```truscript
local greeting = this.WaitForChild("Greeting")
if greeting != nil:
    greeting.Text = "Hello, " + game.Players.LocalPlayer.Name + "!"
```

For UI that is built entirely by script, [attach a client script](../scripting/script-components.md) to a [`Folder`](api:Folder) in `game.ScriptSystem`, and have it create its UI in code.

## Finding elements

A client script can start before all of the UI sent to its device has arrived, so a plain `this.Title` at the top of a script may fail on a slow connection. Use [`WaitForChild`](api:Instance.WaitForChild) for UI that came from the server.

A [child](../engine/instance-tree.md) named `Text` inside a text panel, or `Size` or `Position` inside anything, cannot be reached with a dot, because `panel.Text` is the property. Give UI elements names that are not property names (`TitleText`, `CoinsLabel`), or use [`FindFirstChild`](api:Instance.FindFirstChild).

## Showing a value

The standard shape for showing a value: write a `refresh` function that sets the UI from the value, call it once, and call it again whenever the value changes.

Always call `refresh()` once after connecting to [`Changed`](api:TruWorldsObject.Changed). Otherwise the UI shows nothing until the first change.

## Example: Showing the player's coins

This client script, attached to a [`UITextPanel`](api:UITextPanel) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, shows this player's coins. It expects the server to give each player a [`Folder`](api:Folder) named "[Stats](../players/leaderboards.md)" containing a [`NumberValue`](api:NumberValue) named "Coins".

```truscript
local me = game.Players.LocalPlayer
local stats = me.WaitForChild("Stats")
if stats == nil:
    warn("No Stats folder arrived")
    return

local coins = stats.WaitForChild("Coins")
if coins == nil:
    warn("No Coins value arrived")
    return

func refresh():
    this.Text = coins.Value + " coins"

coins.Changed.Connect(func(property_name):
    if property_name == "Value":
        refresh()
)
refresh()
```

## After a respawn

A player's character is replaced every time they respawn; see [Players and data](../players/index.md). So a script that shows something about the player's character has to follow the new one. When a health bar is still watching the old character after a respawn, reconnect it on [`CharacterAdded`](api:Player.CharacterAdded).

## Server-driven UI

To show a window to one player because of something that happened on the server (they walked into the shop, they won the round), the server sends that player a [message](../networking/remote-communication.md) and the player's client script opens the window.

When a button should change the game, the client script sends a request. The server checks everything and makes the change ([Trusting the client](../networking/trusting-the-client.md)). The UI then updates because the data changed, not because the button was pressed.

For who sees a change to UI, see [Who sees the UI](canvas-and-screenui.md#who-sees-the-ui).

## Tweening UI

A [tween](../animation/tweens.md) is how UI slides, fades, pops and pulses.

> [!WARNING]
> Tweens run on the player's device only. Animate UI in client scripts.

## Example: A panel that pops in

This client script, attached to a [`UIPanel`](api:UIPanel) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, pops the panel in: it starts small and transparent and grows with a little overshoot.

```truscript
func pop_in(element):
    element.Pivot = new Vector2(0.5, 0.5)
    element.Scale = new Vector2(0.6, 0.6)
    element.Transparency = 1
    element.Visible = true
    Tween.Play(element, new TweenParams(0.25, EasingFunc.Back, EasingTrans.Out), {
        Scale = Vector2.One,
        Transparency = 0
    })

pop_in(this)
```

## Troubleshooting

| What you see | Fix |
|---|---|
| [`Pressed`](api:UIButton.Pressed) never fires. | Put scripts that drive on-screen UI on the UI element they control, as client scripts. See [Client or server](#client-or-server), [Where a UI script goes](#where-a-ui-script-goes) and [Buttons and the pointer](buttons-and-pointer.md). |
| Opening a window opens it for everyone. | Have the server send that player a message, and let the player's client script open the window. See [Who sees the UI](canvas-and-screenui.md#who-sees-the-ui) and [Server-driven UI](#server-driven-ui). |
| The UI shows nothing until the value first changes. | Always call `refresh()` once after connecting to `Changed`. See [Showing a value](#showing-a-value). |
| The health bar stops working after the player respawns. | Reconnect it on [`CharacterAdded`](api:Player.CharacterAdded). See [Players and data](../players/index.md) and [After a respawn](#after-a-respawn). |
| At start-up, an error sometimes says a UI element has no member with the name of a child you expected, but only sometimes. | Use `WaitForChild` for UI that came from the server. See [Finding elements](#finding-elements). |
