---
title: Scripting tools
description: Make a tool act when used, on the server and the player's device
---

# Scripting tools

Using a [tool](creating-tools.md) is a signal. When the holder presses the left mouse button, the tool's [`Activated`](api:Tool.Activated) fires, first on the holder's device and then on the server. Releasing the button fires [`Deactivated`](api:Tool.Deactivated) the same way. Attach a server script to the [`Tool`](api:Tool) that listens to `Activated`.

## The smallest tool script

This server script, attached to a [`Tool`](api:Tool), prints who used the tool.

```truscript
this.Activated.Connect(func():
    local player = game.Players.GetPlayerFromCharacter(this.Parent)
    if player:
        print(player.Name + " used " + this.Name)
)
# Expected output when Player1 holds the tool and clicks:
# Player1 used Sword
```

It prints `Player1 used Sword` when Player1 holds the tool and clicks. See [Holding a tool](creating-tools.md#holding-a-tool) for a held tool's `Parent`.

Holding the button does not repeat: `Activated` fires once per press. For an automatic weapon, start a loop on `Activated` and stop it on `Deactivated`.

## Where tool scripts run

| Where the Tool is | Its attached script |
|---|---|
| Held, or loose in `world` | Runs. It starts the first time the tool arrives in `world`. |
| In a player's [`Inventory`](api:Inventory), never equipped | Has not started. |
| In [`PlayerDefaults`](api:PlayerDefaults) or [`Storage`](api:Storage) | Does not start; one already running when the tool moved there keeps running. |

## Client scripts on a tool

A client script attached to a tool runs on every device that has the tool in `world`, not only the holder's. In a client script attached to a tool, check that the holder is the local player ([`Players.LocalPlayer`](api:Players.LocalPlayer)) before reacting to input.

## The device and the server

A tool has two halves, and they belong on different sides. Other players' devices do not get `Activated` for your tool. They see whatever the server script changes.

Server scripts do the part of using a tool that matters: damage, ammunition, score.

| What differs | Holder's device and server |
|---|---|
| The job | On the holder's device, a client script reads input and gives instant feedback, such as a sound. On the server, a server script decides what really happened: damage, ammunition, cooldown, score. |
| Trust | A client script on the holder's device gets no trust, since a player can change anything their device runs. A server script gets full trust. |

See [Trusting the client](../networking/trusting-the-client.md) for what no trust means.

## Cooldowns

A device can report tool activations as fast as it likes. Enforce a tool's cooldown on the server. For a cooldown, keep the time the tool may next be used, and ignore uses before it.

A cooldown that exists only in a client script is a suggestion.

## Example: A tool with a swing cooldown

This server script, attached to a [`Tool`](api:Tool), prints "swing" when the tool is used, at most once every 0.8 seconds.

```truscript
local COOLDOWN = 0.8
local ready_at = 0

this.Activated.Connect(func():
    local now = host.time()
    if now < ready_at:
        return
    ready_at = now + COOLDOWN
    print("swing")
)
```

## Finding what a tool hit

> [!WARNING]
> Because a held tool's parts are out of the physics simulation, a blade's [`Touched`](api:PhysicsInstance.Touched) signal cannot detect hits.

Find what a held tool hit with a distance check, an overlap query ([`World.GetPhysicsInstancesInRadius`](api:World.GetPhysicsInstancesInRadius)) or a raycast ([`World.Raycast`](api:World.Raycast)). Cast the ray again on the server, starting from the character, and never accept "I hit this player" from a device.

> [!WARNING]
> A ray that starts at a character must skip that character's own body, or it hits the body at distance 0 and reaches nothing else.

See [Raycasting](../physics/raycasting.md) for the ray.

## Troubleshooting

| What you see | Fix |
|---|---|
| The sword's [`Touched`](api:PhysicsInstance.Touched) handler never fires. | Find what a held tool hit with a distance check, an overlap query or a raycast. See [Finding what a tool hit](scripting-tools.md#finding-what-a-tool-hit) and [Holding a tool](creating-tools.md#holding-a-tool). |
| A player can use the tool faster than the cooldown. | Enforce a tool's cooldown on the server. See [Cooldowns](scripting-tools.md#cooldowns). |
| A client script does damage and other players do not see it. | Do the part of using a tool that matters (damage, ammunition, score) in a server script. See [The device and the server](scripting-tools.md#the-device-and-the-server) and [The server's world is the real one](../networking/client-server-model.md#the-servers-world-is-the-real-one). |
