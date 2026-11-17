---
title: Leaderboards
description: Show per-player stats in the built-in player list
---

# Leaderboards

TruWorlds has a built-in player list in the top-right corner of the screen. [Value objects](../engine/value-objects.md) are how it gets its columns. You build no interface for the player list's stats; you only create and update values.

## The Stats folder

Put a [Folder](api:Folder) named `Stats` inside a [Player](api:Player), and each [NumberValue](api:NumberValue) or [StringValue](api:StringValue) in it becomes a column of the built-in player list, up to four.

A stat value's [Name](api:Instance.Name) is the column title, and its [Value](api:NumberValue.Value) is what the row shows. Other value types in `Stats`, such as [BoolValue](api:BoolValue), are ignored.

Values a server script creates under a `Player` are sent to every player's device, where the list is drawn. To create them for every player at once, see [Starting tools and values](player-defaults.md#starting-tools-and-values).

## Example: A Coins stat for every player

This server script, attached to a Folder in `game.ScriptSystem`, gives every player a `Stats` folder holding a `Coins` `NumberValue` that starts at 0.

```truscript
func add_stats(player):
    local stats = new Folder() {
        Name = "Stats",
        Parent = player
    }
    local coins = new NumberValue() {
        Name = "Coins",
        Value = 0,
        Parent = stats
    }

game.Players.PlayerAdded.Connect(add_stats)
for player in game.Players.GetPlayers():
    add_stats(player)
```

## Updating a stat

To update a stat, set the value's [Value](api:NumberValue.Value) from a server script. The player list updates by itself when a stat's `Value` changes.

> [!WARNING]
> Change stats on the server only. A client script's change stays on that one device: nobody else sees it, and your server scripts still read the old number.

For a change that starts on a player's device, see [Remote events](../networking/remote-communication.md).

## Column order and ranking

The built-in player list sorts players by the first column, highest number first, and later columns break ties. The order in which you create the values in `Stats` is the column order, provided every player's folder is built the same way. To control the order, create every player's stats in the same order, and create the one you want to rank by first.

## How numbers are shown

In a number column the fraction is dropped, not rounded: `12.9` shows as `12`. From one thousand up, a number column shortens the number to at most three digits and a letter (`K`, `M`, `B`, `T`), dropping extra digits rather than rounding.

For another format, such as a time `1:42`, a rank `Gold` or a percentage, use a [StringValue](api:StringValue) and write the text yourself.

## Text columns

By default a text column ranks alphabetically, A first. To rank a text column by something other than its text, give the [StringValue](api:StringValue) a [NumberValue](api:NumberValue) child named exactly `Sort`. A `StringValue` with a `Sort` child still shows its text, but ranks by the `Sort` number, highest first.

For a stat where lower is better, such as a race time, use a text column with a `Sort` value. For a best-time column with the fastest player on top, make `Sort` the negative of the time.

## Stats last one visit

Values in the `Stats` folder last only while the player is in the server; the folder leaves with them. To keep a score between visits, see [The session pattern](saving-data.md#the-session-pattern).

The player list ranks the players in this server. For an all-time top 10, see [Ranking across servers](saving-data.md#ranking-across-servers).

## Troubleshooting

| What you see | Fix |
|---|---|
| A stat changes on your screen, but nobody else sees it. | To update a stat, set the value's [Value](api:NumberValue.Value) from a server script: [Updating a stat](#updating-a-stat). |
| The lowest time should be first, but the highest is. | For a best-time column with the fastest player on top, make `Sort` the negative of the time: [Text columns](#text-columns). The list ranks highest number first: [Column order and ranking](#column-order-and-ranking). |
