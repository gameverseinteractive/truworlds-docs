---
title: Starting a playtest
description: Start, extend and stop a playtest with one to four players
---

# Starting a playtest

In a playtest, scripts run, physics moves unanchored parts, and players appear and can be controlled.

## The playtest controls

The playtest controls sit at the right end of the top bar, to the left of the Publish button, on every ribbon tab.

| Control | What it does |
|---|---|
| The dropdown | Chooses what to start: 1 Player, 2 Players, 3 Players, 4 Players or Simulate Physics. It is grayed out while a playtest is running. |
| The play button | The blue triangle checks every script, then starts the playtest. It is grayed out while a playtest is running. |
| The stop button | The square, red while a playtest is running, ends the playtest. It is grayed out when nothing is running. |

## Your first playtest

To start your first playtest, open a world. A new world made from the Baseplate template already has a floor and a [PlayerStart](api:PlayerStart). Leave the dropdown on 1 Player and press the play button.

When a 1 Player playtest starts, [a Server tab and a Player 1 tab](switching-sessions.md) appear. Player 1 is selected and shows [your character standing in the world](player-start-and-spawning.md).

Click once inside the Player 1 tab so it has the keyboard. Keys go to the active tab, and only while its view has the keyboard.

## What happens when you press play

When you press play, TruWorlds Creator copies the world exactly as it is at that moment, including changes you have not saved to a file yet. You do not need to save before playtesting.

The playtest's [server](../networking/client-server-model.md) starts from that copy in a new Server tab.

## Choosing the number of players

Use 2 Players to 4 Players for anything that involves more than one person, such as team logic, per-player UI or a player joining after the game has started.

In a playtest started with 2 Players to 4 Players, the players are stand-in guests named `Player1` to `Player4`, with [UserIds](api:Player.UserId) `-1` to `-4` and the default avatar. A Player tab's title has a space (Player 1); the guest's [Name](api:Instance.Name) has none (`Player1`).

## Removing a player

To remove a player, close that player's tab with its close button. Closing a Player tab fires [Players.PlayerRemoved](api:Players.PlayerRemoved) on the server.

This server script prints the name of each player who leaves and how many players are still playing. Attach it to any object in the world, start a 2-player playtest, then close the "Player 2" tab and watch the Script Console.

```truscript
func on_leave(player):
    print(player.Name, "left.", game.Players.PlayerCount, "still playing")

game.Players.PlayerRemoved.Connect(on_leave)

# Expected output after closing the Player 2 tab:
# Player2 left. 1 still playing
```

It prints `Player2 left. 1 still playing`. Inside a `PlayerRemoved` handler, `game.Players.PlayerCount` no longer counts the leaving player.

## Simulate Physics

Simulate Physics starts the server and nothing else: you get a Server tab and no players. In a Simulate Physics run, server scripts run but [Players.PlayerAdded](api:Players.PlayerAdded) never fires, so anything that waits for a player waits forever.

## Script issues when you press play

When you press play and a script file [cannot be built](../scripting/errors-and-debugging.md), for example because of a missing `:` or wrong indentation, a Script Issues window asks whether to playtest anyway.

Continue, in the Script Issues window, starts the playtest anyway. A script that could not be built does not run; every other script does, and the server reports the broken script in red under `[Server]`. Cancel does not start the playtest: fix the script and press play again.

## Stopping a playtest

When a playtest stops, every Server and Player tab closes. When the play button is grayed out because a playtest is already running, press stop first.

Stopping a playtest does not fire [game.ShuttingDown](api:DataModel.ShuttingDown), so you will not see your shutdown handler run there. For shutdown handlers, see [Testing shutdown code](../players/handling-shutdowns.md#testing-shutdown-code). See [What a playtest keeps](what-a-playtest-keeps.md) for what is left when a playtest stops.

## Troubleshooting

| What you see | Fix |
|---|---|
| The play button is grayed out. | Press stop first; see [The playtest controls](#the-playtest-controls) and [Stopping a playtest](#stopping-a-playtest). |
| Your character does not move when you press keys. | Click once inside the Player 1 tab so it has the keyboard; see [Your first playtest](#your-first-playtest). |
