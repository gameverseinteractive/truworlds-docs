---
title: Teleporting
description: Move players from one world to another, and handle failed teleports
---

# Teleporting

A teleport moves a player out of the server they are in and into a server of another world. Only a [server script](../scripting/script-types.md) can teleport players, through [`game.TeleportSystem`](api:TeleportSystem). A client script cannot teleport anyone.

## Sending a player back to the Starting World

`TeleportAsync(worldId, players)` sends one [`Player`](api:Player), or an array of up to 50 Players, to the world with that World ID, and waits for the answer. To send players back to the lobby, teleport them to [`game.StartingWorldId`](api:DataModel.StartingWorldId), the World ID of the [Starting World](universes-and-worlds.md).

Always wrap a [`TeleportAsync`](api:TeleportSystem.TeleportAsync) call in `try` / `catch`.

## Example: A part that sends players to the lobby

This server script goes on a [`Part`](api:Part) that has an [Interaction](../gameplay/interactions.md) child named "Interaction". Players press the Interaction's key near the part to go back to the Starting World.

```truscript
local interaction = this.WaitForChild("Interaction")
interaction.ActionName = "Return to lobby"

local leaving = {}

func on_interacted(player):
    if game.IsStartingWorld:
        print("Already in the lobby")
        return
    if leaving[player.UserId]:
        return
    leaving[player.UserId] = true
    try:
        game.TeleportSystem.TeleportAsync(game.StartingWorldId, player)
    catch e:
        print("Could not return " + player.Name + ": " + e.message)
        table.remove(leaving, player.UserId)

interaction.Interacted.Connect(on_interacted)

game.Players.PlayerRemoved.Connect(func(player):
    table.remove(leaving, player.UserId)
)
```

## Passing the players

The `players` argument is one [`Player`](api:Player), an array of Players such as `game.Players.GetPlayers()`, or a table whose values are Players: 1 to 50 players, none listed twice.

A common mistake is to pass the character that touched something: [`TeleportAsync`](api:TeleportSystem.TeleportAsync) wants the Player. Use `game.Players.GetPlayerFromCharacter(character)` to get from the character to the Player that `TeleportAsync` wants.

## How a teleport happens

Your server checks the players, the options and the data first; a problem there fails the call at once. Your server then asks the TruWorlds platform to accept the teleport, and the script waits. If the platform accepts, [`TeleportAsync`](api:TeleportSystem.TeleportAsync) returns a [`TeleportResult`](api:TeleportResult), and each player who is still connected is told to leave for the destination. A returned result means accepted, not arrived: the players have not left yet. The player sees a loading screen while a server of the destination world is found or started, and then joins it.

On the destination server, `game.Players.PlayerAdded` fires for a teleported player as for any join, and [`player.GetJoinData()`](api:Player.GetJoinData) [describes the teleport](teleport-data.md).

## Choosing a server

Pass a [`TeleportOptions`](api:TeleportOptions) as the third argument to choose which server the players go to and to send a [small table of data](teleport-data.md) with them. Create the options with `new TeleportOptions()` and set what you need.

[`ServerInstanceId`](api:TeleportOptions.ServerInstanceId) sends the players to one running public server of the destination world. It must be a real server ID, such as [`game.ServerId`](api:DataModel.ServerId) read on that server.

## When a teleport fails

A teleport that cannot start fails in two ways at once: [`TeleportAsync`](api:TeleportSystem.TeleportAsync) throws an error whose message reads `Reason: explanation`, and [`TeleportFailed`](api:TeleportSystem.TeleportFailed) fires once for each player.

Use `try` / `catch` ([Error handling](../truscript/error-handling.md)) to react where you made the call: tell the player, retry or give up. Use `TeleportFailed` for one central place that logs every failure in the world.

## Example: Logging every failed teleport

This server script goes in a [`Folder`](api:Folder) in [`game.ScriptSystem`](api:ScriptSystem). It logs a warning for every failed teleport in the world, with the player, the World ID, the reason and the message.

```truscript
func on_failed(failure):
    local who = failure.Player.Name + " to world " + failure.WorldId
    warn("Teleport of " + who + " failed: " + failure.Reason + " (" + failure.Message + ")")

game.TeleportSystem.TeleportFailed.Connect(on_failed)
# Output in a playtest whenever a script tries to teleport Player1 to world 123456:
# Teleport of Player1 to world 123456 failed: NotAvailableInPlaytest (Teleporting is not available in playtest.)
```

In a playtest whenever a script tries to teleport Player1 to world 123456, it prints `Teleport of Player1 to world 123456 failed: NotAvailableInPlaytest (Teleporting is not available in playtest.)`.

## Common failure reasons

| Reason | What it means |
|---|---|
| `InvalidPlayers` | `players` was empty, `nil`, not a [`Player`](api:Player) or list of Players, or listed someone twice. It does not fire [`TeleportFailed`](api:TeleportSystem.TeleportFailed). Pass Player objects, each once. |
| `InvalidOptions`, "not a valid server id" | [`ServerInstanceId`](api:TeleportOptions.ServerInstanceId) was not a real server ID. Use a value read from [`game.ServerId`](api:DataModel.ServerId) on a live server. |
| `NotAvailableInPlaytest` | The script is running in a playtest in TruWorlds Creator. This is expected. |

## Testing teleports

Teleports only work in the live game. In a playtest every teleport fails with `NotAvailableInPlaytest`, throwing and firing [`TeleportFailed`](api:TeleportSystem.TeleportFailed) for each player. In a playtest, check that your trigger reaches the [`TeleportAsync`](api:TeleportSystem.TeleportAsync) line by watching for the `NotAvailableInPlaytest` message in the **Console**.

When nothing happens and there is no error, the `TeleportAsync` line was never reached, or it ran in a client script that failed earlier.

Add a `print` just before `TeleportAsync`, and make sure the script is a server script.

To test a teleport for real, publish both worlds from TruWorlds Creator: a change you have not published is not in the live game. Then join your project by pressing Play on its page. You land in the Starting World. Then trigger the teleport and watch what happens. Open **Console** in the Esc menu to read `print` and `warn` lines and errors; see [Debugging a playtest](../playtesting/debugging-a-playtest.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| Nothing happens and there is no error. | Add a `print` just before [`TeleportAsync`](api:TeleportSystem.TeleportAsync), and make sure the script is a server script: see [Testing teleports](#testing-teleports). |
| Every teleport fails with NotAvailableInPlaytest. Error: `NotAvailableInPlaytest: Teleporting is not available in playtest.` | Publish both worlds from TruWorlds Creator to test for real: see [Common failure reasons](#common-failure-reasons) and [Testing teleports](#testing-teleports). |
