---
title: Teleport data and arrivals
description: Send a small table with the players, and read how each player arrived
---

# Teleport data and arrivals

Teleport data is a small table that travels with the players and can be read by the destination server. Use it for what the destination needs to know about this trip: the game mode picked, a player's team, the door they came through. It exists for one arrival, so it is the wrong place for anything that must last. [Choosing a server](teleporting.md#choosing-a-server) showed where it is passed.

## Sending teleport data

`SetTeleportData(data)` attaches a table of plain data for the destination to read. Pass `nil` to clear it.

[`SetTeleportData`](api:TeleportOptions.SetTeleportData) keeps your table, not a copy: a change made to it before [`TeleportAsync`](api:TeleportSystem.TeleportAsync) runs is sent.

Teleport data must be 4096 bytes or less once converted: 4096 bytes is accepted, and 4097 fails the teleport with `TeleportDataTooLarge`.

| Reason | What it means |
|---|---|
| `TeleportDataInvalid` | The teleport data could not be converted. Flatten it. |
| `TeleportDataTooLarge` | Send less. |

## Example: Sending every player on with data

This server script goes in a [`Folder`](api:Folder) in [`game.ScriptSystem`](api:ScriptSystem), in the source world. It sends every player who joins straight on to another world, with data. (A real game would wait for a choice.)

```truscript
local ARENA_WORLD_ID = 123456

func send(player):
    local options = new TeleportOptions()
    options.SetTeleportData({
        mode = "capture",
        round = 3,
        team = "red",
        loadout = ["sword", "shield"]
    })
    try:
        game.TeleportSystem.TeleportAsync(ARENA_WORLD_ID, player, options)
    catch e:
        print("Teleport failed: " + e.message)

game.Players.PlayerAdded.Connect(send)
```

## Reading how a player arrived

[`GetJoinData`](api:Player.GetJoinData) describes how the player arrived: which world they teleported from, with whom, and any data sent along. Call `player.GetJoinData()` in a server script, normally in a `game.Players.PlayerAdded` handler.

| JoinData member | What it holds |
|---|---|
| [`JoinData.SourceWorldId`](api:JoinData.SourceWorldId) | The World ID of the world the player was teleported from, or `nil` for a player who joined in any other way. |
| [`JoinData.SourceUniverseId`](api:JoinData.SourceUniverseId) | The ID of the source world's project, or `nil` for a player who did not arrive by teleport. Compare it with [`game.UniverseId`](api:DataModel.UniverseId) to know whether they came from your own project. |
| [`JoinData.GroupUserIds`](api:JoinData.GroupUserIds) | The [`UserId`](api:Player.UserId) of every player sent in the same [`TeleportAsync`](api:TeleportSystem.TeleportAsync) call, this player included. It is empty for a player who did not arrive by teleport. |
| [`JoinData.TeleportData`](api:JoinData.TeleportData) | The table the source set with [`SetTeleportData`](api:TeleportOptions.SetTeleportData), or an empty table when none was sent, never `nil`. |

## Arrivals without teleport data

A player who pressed Play, joined a friend or joined directly in any other way arrives with `nil` IDs, an empty `GroupUserIds` array and an empty `TeleportData` table. In a playtest in TruWorlds Creator, [`player.GetJoinData()`](api:Player.GetJoinData) always describes a direct join.

Make the arrival code work without teleport data, so the destination world can be playtested on its own; see [Planning a game of several worlds](universes-and-worlds.md#planning-a-game-of-several-worlds).

`TeleportData` is empty on arrival when [`SetTeleportData`](api:TeleportOptions.SetTeleportData) was called on other options than the ones passed to [`TeleportAsync`](api:TeleportSystem.TeleportAsync), when the options were not the third argument, or when `GetJoinData()` is read on a player's device instead of on the server.

## Example: Reading teleport data with defaults

This server script goes in a [`Folder`](api:Folder) in [`game.ScriptSystem`](api:ScriptSystem), in the destination world. It reads mode and round from the teleport data of each player who joins, using defaults for anything the data does not hold.

```truscript
local DEFAULTS = { mode = "practice", round = 1 }

func settings_for(player):
    local data = player.GetJoinData().TeleportData
    return {
        mode = data.mode or DEFAULTS.mode,
        round = data.round or DEFAULTS.round
    }

game.Players.PlayerAdded.Connect(func(player):
    local settings = settings_for(player)
    print(player.Name + " plays " + settings.mode + ", round " + settings.round)
)
# Output in a playtest:
# Player1 plays practice, round 1
```

In a playtest it prints `Player1 plays practice, round 1`.

## Teleport data on a device

[`GetJoinData()`](api:Player.GetJoinData) is meaningful on the server only: in a client script its IDs are `nil` and its group and data are empty.

If a player's device needs something from the teleport data, have the server send it with a [`RemoteEvent`](api:RemoteEvent) (see [Remote events](../networking/remote-communication.md)) or put it in a [value object](../engine/value-objects.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| `TeleportData` is empty on arrival. | Set the data on a `new TeleportOptions()` and pass those options as the third argument of [`TeleportAsync`](api:TeleportSystem.TeleportAsync). If a device needs the data, have the server send it with a [`RemoteEvent`](api:RemoteEvent) or put it in a value object: see [Sending teleport data](#sending-teleport-data), [Arrivals without teleport data](#arrivals-without-teleport-data), [Choosing a server](teleporting.md#choosing-a-server) and [Teleport data on a device](#teleport-data-on-a-device). |
