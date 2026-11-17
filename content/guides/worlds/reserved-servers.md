---
title: Reserved servers
description: Private servers with access codes, and lobbies that use them
---

# Reserved servers

A *reserved server* is a private server of one of your worlds. Nobody lands in a reserved server by pressing Play, and nobody can follow a friend into it. The only way into a reserved server is a teleport that carries the server's access code. Reserved servers are for private matches, party instances, story missions for one group, and anywhere the players inside must be exactly the ones your script chose. Like all [teleporting](teleporting.md#testing-teleports), reserving and joining reserved servers does not work in a playtest in TruWorlds Creator.

## Access codes

A reserved server is identified by its *access code*, a piece of text. Whoever has a reserved server's access code can send players to that server; nothing else can.

## Reserving while teleporting

Get an access code by teleporting with `options.ShouldReserveServer = true` (the code comes back in the result), or by calling `game.TeleportSystem.ReserveServerAsync(worldId)` ahead of time. `ShouldReserveServer = true` reserves a new server and sends the players there, in one step.

The access code of the server that [`ShouldReserveServer`](api:TeleportOptions.ShouldReserveServer) reserved is in [`TeleportResult.ReservedServerAccessCode`](api:TeleportResult.ReservedServerAccessCode). If you do not keep it, nobody else can ever be added to that server. See [How a teleport happens](teleporting.md#how-a-teleport-happens) for when `TeleportAsync` returns the [`TeleportResult`](api:TeleportResult).

Send more players to the same reserved server by teleporting them with `options.ReservedServerAccessCode = code`.

[`ShouldReserveServer`](api:TeleportOptions.ShouldReserveServer), [`ReservedServerAccessCode`](api:TeleportOptions.ReservedServerAccessCode) and [`ServerInstanceId`](api:TeleportOptions.ServerInstanceId) are the targeting options of a [`TeleportOptions`](api:TeleportOptions). Set at most one of the targeting options. Setting two or three fails the teleport with `InvalidOptions`.

## Example: A shared room for the lobby

This server script goes in a [`Folder`](api:Folder) in [`game.ScriptSystem`](api:ScriptSystem), in the lobby world. The first player to join reserves a room; everyone who joins this lobby server afterwards is sent to the same room until it is full.

```truscript
local ARENA_WORLD_ID = 123456
local room_code = nil

func reason_of(e):
    local cut = string.index_of(e.message, ": ")
    if cut < 0:
        return "Unknown"
    return string.substring(e.message, 0, cut)

func send_to_room(player):
    local options = new TeleportOptions()
    if room_code == nil:
        options.ShouldReserveServer = true
    else:
        options.ReservedServerAccessCode = room_code
    try:
        local result = game.TeleportSystem.TeleportAsync(ARENA_WORLD_ID, player, options)
        if room_code == nil:
            room_code = result.ReservedServerAccessCode
    catch e:
        local reason = reason_of(e)
        if reason == "ServerFull" or reason == "InvalidAccessCode":
            # The room is full or gone. The next player starts a new one.
            room_code = nil
        print("Could not send " + player.Name + ": " + e.message)

game.Players.PlayerAdded.Connect(send_to_room)
```

## Reserving ahead of time

`ReserveServerAsync(worldId)` reserves a server without sending anyone. Use [`ReserveServerAsync`](api:TeleportSystem.ReserveServerAsync) when you need the access code before the players go: to show a party code on screen, to store it, or to send people from several lobby servers to one place.

A failed `ReserveServerAsync` throws an error whose message is `Reason: explanation`. [`TeleportFailed`](api:TeleportSystem.TeleportFailed) does not fire, since no players are involved.

## Public and reserved servers

A reserved server differs from a public one only in who can get in and in what [`game.IsReservedServer`](api:DataModel.IsReservedServer) returns.

| What differs | Public and reserved servers |
|---|---|
| How players get in | Players get into a public server by pressing Play, joining a friend, or a teleport without a targeting option, and into a reserved server only by a teleport that carries the access code. |
| Targeting | A public server can be targeted with [`ServerInstanceId`](api:TeleportOptions.ServerInstanceId). A reserved server cannot: use the access code. |
| `IsReservedServer` | [`game.IsReservedServer`](api:DataModel.IsReservedServer) is `false` on a public server and `true` on a reserved server. |

## Adding players later

Anyone can be added to a reserved server later, as long as the script has the code and the server has room.

> [!WARNING]
> Do not send an access code to players' devices unless you mean them to share it. A client script cannot use the code, but if your game accepts codes typed by players, anyone who learns a code can get into that server.

See [Trusting the client](../networking/trusting-the-client.md) for codes typed by players.

## Inside a reserved server

[`game.IsReservedServer`](api:DataModel.IsReservedServer) tells a script whether it is running on a reserved server.

This server script goes in a [`Folder`](api:Folder) in [`game.ScriptSystem`](api:ScriptSystem), in the arena world. It prints whether the server is a reserved server or a public one.

```truscript
if game.IsReservedServer:
    print("Private match server")
else:
    print("Public server")
# Output in a playtest:
# Public server
```

In a playtest it prints `Public server`.

## Troubleshooting

| What you see | Fix |
|---|---|
| The second group does not arrive in the same server as the first. | Teleport them with `options.ReservedServerAccessCode = code`: see [Reserving while teleporting](#reserving-while-teleporting). |
