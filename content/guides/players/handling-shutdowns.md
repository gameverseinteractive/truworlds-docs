---
title: Handling shutdowns
description: Save every player's data before a server closes
---

# Handling shutdowns

A server closes when TruWorlds shuts it down, and it is replaced when TruWorlds restarts it for an update. A world that [saves progress](saving-data.md#the-session-pattern) only when a player leaves loses it when a server closes, because everybody leaves at once and the server is gone a moment later.

## Example: Saving everyone at shutdown

Connect a function to `game.ShuttingDown`, and save everybody inside it. Connect it in a server script.

This server script, attached to a Folder in `game.ScriptSystem`, saves every player's loaded data when the server shuts down. `sessions` is your table of loaded player data: UserId -> data table. For loaded data, see [The session pattern](saving-data.md#the-session-pattern).

```truscript
local store = game.DataSystem.GetStore("Progress")
local sessions = {}

func save_everyone():
    for player in game.Players.GetPlayers():
        local data = sessions[player.UserId]
        if data != nil:
            try:
                store.SetAsync(player, data)
            catch e:
                print("Save failed for " + player.Name + ": " + e.message)

game.ShuttingDown.Connect(save_everyone)
```

## What the server waits for

At a shutdown, the server waits for the functions that `game.ShuttingDown` itself started. Save inside the [ShuttingDown](api:DataModel.ShuttingDown) handler itself, one player after another.

A `ShuttingDown` handler that starts work with [spawn](api:global/spawn) and returns counts as finished, and the spawned work is cut off. For `spawn`, see [Waiting and tasks](../scripting/waiting-and-tasks.md).

## A player leaving and the server closing

You need both handlers. [PlayerRemoved](api:Players.PlayerRemoved) covers people who leave while the server carries on. `ShuttingDown` covers everyone who is still there when the server ends. For a player who teleports away, see [Teleporting](../worlds/teleporting.md).

| What differs | A player leaving and the server closing |
|---|---|
| Trigger | A player leaves when one person quits, loses their connection, is kicked or teleports away. The server closes when TruWorlds shuts it down, or restarts it for an update. |
| Signal | When a player leaves, `game.Players.PlayerRemoved` fires once, for that player. When the server closes, `game.ShuttingDown` fires once, for the whole server. |
| What to save | When a player leaves, save that one player. When the server closes, save every player still in the server. |

## Keeping a shutdown fast

To keep a shutdown fast, do not retry for long: one quick second attempt is reasonable, a loop that waits 8 seconds between tries is not. Do nothing else slow in the handler: no long [wait](api:global/wait), no needless web requests.

## Testing shutdown code

Stopping a playtest does not fire `game.ShuttingDown`, so you will not see your shutdown handler run there. Stopping a playtest does not fire [PlayerRemoved](api:Players.PlayerRemoved) for the players who are still in the world either.

To test shutdown code, give yourself a way to call the same function by hand during a playtest, and check the result in the Data Browser; see [The Data Browser](data-browser.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| Progress is lost when a server closes. | Connect a function to `game.ShuttingDown`, and save everybody inside it: [Saving everyone at shutdown](#example-saving-everyone-at-shutdown). Both handlers are needed: [A player leaving and the server closing](#a-player-leaving-and-the-server-closing). |
| The shutdown handler does not run when you stop a playtest. | Give yourself a way to call the same function by hand during a playtest: [Testing shutdown code](#testing-shutdown-code). |
