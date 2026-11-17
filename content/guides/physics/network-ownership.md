---
title: Network ownership
description: Which computer simulates each loose part, and how to change it
---

# Network ownership

Every loose part's physics runs on exactly one machine, the server or one player's device: the part's network owner. Every other machine is told where the part is. A player's own character is simulated by that player's device.

## Who simulates a part

| Part | Simulated by |
|---|---|
| An unanchored part, by default | The server. |
| A loose part that a player's character is pushing or standing next to | That player's device, while they interact with it. |
| A part you assigned with `SetNetworkOwner(player)` | That player's device. |
| A [vehicle](seats-and-vehicles.md) a player is driving | The driver's device. |
| A part created by a client script | Only that device, and nobody else sees it. |
| An anchored part | Nobody. It has no owner in practice. |

## Automatic hand-over

When a player's character comes within about a stud of a loose, server-simulated part, the server hands the part to that player's device.

Automatic hand-over never happens for anchored parts and groups held by an anchored part, for a group that contains a [`Seat`](api:Seat), for parts that already have an owner, or for a part or group with an enabled mover that drives its position ([`AlignPosition`](api:AlignPosition), [`LinearVelocity`](api:LinearVelocity), [`VectorForce`](api:VectorForce), [`LineForce`](api:LineForce) or [`Torque`](api:Torque)).

When two players fight over a pushed crate, it jitters for other players until one of them moves away.

## Setting the owner yourself

Call [`SetNetworkOwner`](api:PhysicsInstance.SetNetworkOwner) from a server script.

`SetNetworkOwner(nil)` gives the part back to the server. For anything made of several parts, call [`SetNetworkOwner`](api:Model.SetNetworkOwner) on the `Model`. Parts linked by [welds, motors](welds-and-joints.md) or [attachment constraints](constraints.md#attachments) always have the same owner.

## Example: Lending a cart to a player

This server script, attached to a [Model](api:Model) whose parts are welded, such as a soap-box cart, gives the cart to the first player who touches its [`PrimaryBody`](api:Model.PrimaryBody), and takes it back after 20 seconds.

```truscript
local body = this.PrimaryBody
local driver = nil

func find_player(part):
    local current = part
    while current != nil:
        if current.IsA("CharacterController"):
            return game.Players.GetPlayerFromCharacter(current)
        current = current.Parent
    return nil

func on_touch(other):
    if driver != nil:
        return
    local player = find_player(other)
    if player == nil:
        return
    driver = player
    this.SetNetworkOwner(player)
    print(player.Name + " now simulates the cart")
    wait(20)
    this.SetNetworkOwner(nil)
    driver = nil

body.Touched.Connect(on_touch)
```

## What the owner changes

[Movers](forces-and-movers.md) and [constraints](constraints.md) act on the side that simulates the part: hand a part to a player and its forces are applied on that player's device.

In a client script, a server-simulated part always reads `Vector3(0, 0, 0)` for [`LinearVelocity`](api:PhysicsInstance.LinearVelocity), even while visibly flying; only its position is kept up to date on other devices.

## Never trust the owner

> [!WARNING]
> The owner's device decides where the part is, and a modified device can lie. Never give a player ownership of something that decides the game for other players, and check positions on the server before trusting them.

To check what a player's device sends, see [Trusting the client](../networking/trusting-the-client.md).
