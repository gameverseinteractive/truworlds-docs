---
title: Saving data
description: Save, load and rank data that outlives a server
---

# Saving data

A data store is a named box of saved values. Each value in a data store is kept under a key, a short piece of text. `game.DataSystem.GetStore(name)` gives you a [DataStore](api:DataStore). For the [DataSystem](api:DataSystem), see [Players and data](index.md).

## Keys for player data

A key can be a [Player](api:Player): TruWorlds uses that player's [UserId](api:Player.UserId), as text. Key player data by the `Player` itself (TruWorlds then uses their `UserId`), never by their name: the account number never changes; a name can. A number, such as `player.UserId`, is not a valid key: using one fails with an error.

## Reading and saving

When nothing is saved under a key, [GetAsync](api:DataStore.GetAsync) gives `nil`: normal for a first-time player, not an error. [SetAsync](api:DataStore.SetAsync) replaces the whole value. To change one field, read the table, change it, and save it back, or use [UpdateAsync](api:DataStore.UpdateAsync).

## Every call waits and can fail

Every read and write of saved data waits for an answer and can fail; see [Waiting and tasks](../scripting/waiting-and-tasks.md). Wrap every read and write of saved data in `try` and `catch`; see [Error handling](../truscript/error-handling.md).

`game.DataSystem` cannot be used from a client script. To give a client script saved data, send it what it needs with a [remote event](../networking/remote-communication.md), or show it through the `Stats` folder; see [Leaderboards](leaderboards.md).

## Counters and safe changes

[IncrementAsync](api:DataStore.IncrementAsync) adds to a saved number in one step, so no other server's change can be lost: the right tool for counters that several servers touch.

`UpdateAsync(key, transform)` is "read, change, save" done safely: it reads the current value, calls your function with it, and saves whatever your function returns. The function passed to [UpdateAsync](api:DataStore.UpdateAsync) receives the current value, or `nil` when nothing is saved yet. Always handle `nil`.

The function passed to `UpdateAsync` may run more than once, again with the newer value when another server changed the key first, so it must only work out the new value: give items, print receipts or change the world after `UpdateAsync` returns. Return `nil` from it to cancel, so nothing is written, for "only if" changes such as spending 50 coins only if they have 50.

## Example: Awarding a win

This server script, attached to a Folder in `game.ScriptSystem`, adds one win to a player's saved total with `IncrementAsync` and prints the new total.

```truscript
local wins = game.DataSystem.GetStore("Wins")

func award_win(player):
    try:
        local total = wins.IncrementAsync(player, 1)
        print(player.Name + " now has " + total + " wins")
    catch e:
        print("Could not count the win: " + e.message)
```

## What cannot be saved

An instance (a [Part](api:Part), a [Tool](api:Tool), a [Player](api:Player)) cannot be saved: save its name or your own id, and rebuild it when you load.

## The session pattern

A session is a table in your server script that keeps a player's data while they play. In the session pattern, load a player's data once, when they join. Change the session table as the player plays; do not save on every change. Save when the player leaves, on a timer, and when the server shuts down.

Never save for a player whose load failed: saving the defaults would overwrite their real progress with zeros. Copy the saved fields over fresh defaults instead of using the loaded table as it is, so new fields have values. For when the server shuts down, see [Handling shutdowns](handling-shutdowns.md).

## Example: Loading and saving each player's coins

This server script, attached to a Folder in `game.ScriptSystem`, loads each player's data once when they join, with three tries, keeps it in a session table, shows the coins in a `Stats` folder, and saves when they leave, every two minutes and when the server shuts down; a player whose load failed is kicked and never saved.

```truscript
local store = game.DataSystem.GetStore("Progress")
local sessions = {}          # UserId -> that player's data table

func new_data():
    return { coins = 0, level = 1 }

# Tries three times. Returns the data, or nil when every try failed.
func load_data(player):
    local attempt = 0
    while attempt < 3:
        try:
            local saved = store.GetAsync(player)
            local data = new_data()
            if saved != nil:
                for key in saved:
                    data[key] = saved[key]
            return data
        catch e:
            print("Load failed for " + player.Name + ": " + e.message)
            attempt += 1
            wait(2)
    return nil

func save_data(player):
    local data = sessions[player.UserId]
    if data == nil:
        return                # never loaded, so never save
    try:
        store.SetAsync(player, data)
    catch e:
        print("Save failed for " + player.Name + ": " + e.message)

func on_join(player):
    local data = load_data(player)
    if data == nil:
        player.Kick("Your progress could not be loaded. Please rejoin.")
        return
    sessions[player.UserId] = data

    local stats = new Folder() {
        Name = "Stats",
        Parent = player
    }
    local coins = new NumberValue() {
        Name = "Coins",
        Value = data.coins,
        Parent = stats
    }

func on_leave(player):
    save_data(player)
    table.remove(sessions, player.UserId)

func save_everyone():
    for player in game.Players.GetPlayers():
        save_data(player)

func autosave():
    while true:
        wait(120)
        save_everyone()

game.Players.PlayerAdded.Connect(on_join)
game.Players.PlayerRemoved.Connect(on_leave)
game.ShuttingDown.Connect(save_everyone)
for player in game.Players.GetPlayers():
    on_join(player)
spawn(autosave)
```

## Data in a playtest

A playtest in TruWorlds Creator does not touch the data of your published world. By default a playtest reads and writes local data, kept for that world on your computer. Local data carries over from one playtest to the next, so you can test leaving and coming back.

In a playtest with two or more players, or when you are not signed in, the players are test players `Player1`, `Player2` and so on, with `UserId` -1, -2 and so on.

Pressing Stop saves nobody: a script that saves only when a player leaves or the server shuts down writes nothing when you stop a playtest. For testing shutdown code, see [Handling shutdowns](handling-shutdowns.md#testing-shutdown-code). To see saving on leave work in a playtest, make the player leave first (close their Player tab, or call `player.Kick("test")` from a server script), or wait for an autosave.

The ribbon's Script tab has a Data group with a checkbox, Live data in playtests. The checkbox is grayed out when nobody is signed in.

<!-- screenshot: The Data group on the ribbon's Script tab, with the Live data in playtests checkbox grayed out -->

To see what a playtest saved, see [The Data Browser](data-browser.md).

## Ranking across servers

A store can rank its keys by value when the value is a plain number. A number inside a table is not ranked, so keep anything you want to rank in its own store. [TopAsync](api:DataStore.TopAsync) gives the `count` highest numbers in the store, highest first.
