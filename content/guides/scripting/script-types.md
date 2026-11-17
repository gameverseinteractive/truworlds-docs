---
title: Script types
description: "Server, client and module scripts: where each runs and what it sees"
---

# Script types

A server script runs on the server only. A client script runs on each player's device, separately. A module script runs wherever the script that imports it runs. Variables, functions and connections are not shared between sides. For the server and players' devices, see the [client-server boundary](../networking/client-server-model.md).

## Server scripts

A player's device never runs a server script and never receives it. A server script can use server-only API, such as [DataSystem](api:DataSystem) (saving) and [HttpSystem](api:HttpSystem) (web requests); a client script cannot.

A server script that is in the world from the beginning starts before any player has joined, so `game.Players.PlayerCount` read then is `0`, even in a one-player playtest.

## Client scripts

A client script is a script whose type is set to Client. With four players in the world, a client script attached to one instance runs four times, once on each device, and no copy can see another's variables. A client script starts once the world has finished loading on that device and its instance is present there.

In a client script, `game.Players.LocalPlayer` is the Player of the device the script runs on; see [The local player](../players/players-and-characters.md#the-local-player). This client script, attached to a [ScreenUI](api:ScreenUI) in `game.UICanvas`, prints the name of the player whose device it is running on.

```truscript
local me = game.Players.LocalPlayer
print("This device belongs to " + me.Name)
# Output (the name is the signed-in player's name):
# This device belongs to Player1
```

It prints `This device belongs to Player1`, with the signed-in player's name.

## Module scripts

A module runs on the side of the script that imports it, and can use what a script on that side can use. See [Modules and import](modules-and-import.md) for [import](api:global/import).

A module script attached to an instance runs on both sides: once on the server, and once on each player's device where the instance is present, with [this](api:global/this) set to the instance.

## Server-only and client-only members

Many classes and members only make sense on one side of the [client-server boundary](../networking/client-server-model.md): they work on the server or on players' devices, not both.

Using a member on the wrong side can do nothing: a signal that only fires on players' devices, such as [UIButton.Pressed](api:UIButton.Pressed), never fires for a handler connected in a server script.

## Choosing a type

| Code that needs to | Script type |
|---|---|
| Change something every player should see | Server script |
| Give, take or check coins, items, health or scores | Server script |
| Save or load data | Server script |
| React to a key press, mouse click or touch | Client script |
| Show or update on-screen UI | Client script |
| Provide functions or settings used by several scripts | Module script |
