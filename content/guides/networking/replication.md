---
title: Replication
description: What the server sends to players' devices, and when
---

# Replication

Replication is the automatic sending of instances and property changes from the server to devices. You write no code for replication, and you cannot switch it off for ordinary instances. Replication goes one way, from the server to devices.

## What the server sends

An instance a server script creates and places in [world](api:global/world) is sent to every player. When a server script sets a property, the new value is sent to every device that has the instance.

Variables, functions and connections inside scripts are never replicated; only instances and their properties are.

## Only the latest value arrives

Only changed properties are sent, in batches many times per second, not one message per assignment. A device gets the latest value of a property, not every value it passed through.

## Showing server state with a value object

A value object on the server and a [Changed](api:TruWorldsObject.Changed) handler on the device is the simplest way to show server state to players.

Use a value object and a `Changed` handler before you reach for a [RemoteEvent](api:RemoteEvent). See [Value objects](../engine/value-objects.md).

## Example: A round timer

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, counts down a round timer that every device can read.

```truscript
local time_left = new NumberValue() {
    Name = "TimeLeft",
    Value = 60,
    Parent = world
}

while time_left.Value > 0:
    wait(1)
    time_left.Value = time_left.Value - 1
print("Round over")
# Output after about 60 seconds, in the server's console:
# Round over
```

It prints `Round over` in the server's console after about 60 seconds.

This client script, attached to a [UITextPanel](api:UITextPanel) inside a [ScreenUI](api:ScreenUI) in `game.UICanvas`, shows the server's timer. It never changes the timer itself.

```truscript
local time_left = world.WaitForChild("TimeLeft")

func refresh():
    this.Text = "Time left: " + time_left.Value

func on_changed(property_name):
    if property_name == "Value":
        refresh()

if time_left != nil:
    time_left.Changed.Connect(on_changed)
    refresh()
# The panel reads "Time left: 60" and counts down once per second on every player's screen.
```

## Changes made by client scripts

Changes made on a device stay on that device, as [the client-server boundary](client-server-model.md#the-servers-world-is-the-real-one) showed.

An instance a client script creates exists only on that player's device; the server and the other players never see it. When only one player sees a new part because a client script created it, create it in a server script.

When a client script sets a property of an instance from the server, the local value stays until the server next changes that same property; then the server's value replaces it. When a client script's change is undone because the server changed the same property, make the change on the server.

## Things arrive over time

A change made on the server appears on a device a moment later, not at the same instant. After client scripts start, new instances arrive as the server creates them and as the player moves near them.

A client script must never assume that something a server script created is already there. For waiting on a child that something else creates, see [Finding children](../engine/instance-tree.md#finding-children).

A model and its children can arrive a moment apart. If you need particular children of a model, wait for each of them, or listen to [ChildAdded](api:Instance.ChildAdded).

## Example: Reacting to every coin

This client script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, reacts to every coin, including coins the server creates later and coins that stream in as you walk.

```truscript
local coins = world.WaitForChild("Coins")      # a Folder created in TruWorlds Creator

func on_coin(coin):
    print("A coin arrived on this device: " + coin.Name)

if coins != nil:
    for coin in coins.GetChildren():
        on_coin(coin)
    coins.ChildAdded.Connect(on_coin)
```

## Streaming

Streaming is the server sending each player only the parts near them, and more as they move. Parts far from a player are not sent to that player while streaming is on, which is the default.

When [StreamingEnabled](api:World.StreamingEnabled) is `false`, the whole world is sent to every player.

Instances with no position are always sent: folders, models as containers, value objects, [RemoteEvent](api:RemoteEvent) and [RemoteFunction](api:RemoteFunction) objects, and everything outside `world`, such as `game.Storage`, `game.UICanvas` and `game.Players`. The server always has the whole world: streaming never hides anything from server scripts.

A streamed part that goes out of range is removed from the device as if destroyed: a reference a client script held stops being usable, and the parent's [ChildRemoved](api:Instance.ChildRemoved) fires. When a part a client script was using streams out, listen to `ChildRemoved` or [Destroyed](api:Instance.Destroyed), or turn `StreamingEnabled` off for a small world.

## Storage and values under a Player

All of `game.Storage` is sent to every player's device, regardless of streaming, and stays there. Do not put anything in `game.Storage` that players must not be able to obtain. See [Keeping secrets](trusting-the-client.md#keeping-secrets).

Values under a [Player](api:Player) are sent to every device, not only that player's, which is how the player list shows everyone's score. Do not store anything private to one player under their `Player`; send it to them with [RemoteEvent.FireTo](api:RemoteEvent.FireTo).

## Troubleshooting

| What you see | Fix |
|---|---|
| A client script's change is undone. | Make the change on the server. See [Changes made by client scripts](#changes-made-by-client-scripts). |
| Only one player sees a new part. | Create it in a server script. See [Changes made by client scripts](#changes-made-by-client-scripts). |
| A part a client script was using disappears. | Listen to [ChildRemoved](api:Instance.ChildRemoved) or [Destroyed](api:Instance.Destroyed), or turn [StreamingEnabled](api:World.StreamingEnabled) off for a small world. See [Streaming](#streaming). |
