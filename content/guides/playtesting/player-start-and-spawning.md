---
title: PlayerStart and spawning
description: Where a player's character appears, and how to control it
---

# PlayerStart and spawning

You control [spawning](index.md) with [PlayerStart](api:PlayerStart) objects. A `PlayerStart` is a point, not a part: it has a position and a rotation but no size, and nothing collides with it.

## Where the character appears

The character stands on the [PlayerStart](api:PlayerStart)'s position: the point is where its feet go, not its middle, so put a `PlayerStart` on the surface players should stand on.

The spawned character stands on the `PlayerStart`, facing the start's forward direction (-Z). Rotate the `PlayerStart` around the Y axis to choose which way players look when they appear.

A new world starts with one `PlayerStart` at the world origin `(0, 0, 0)`, on the top surface of the baseplate.

Players never see a `PlayerStart`. While you edit, and on the Server tab of a playtest, a marker shows where it is and which way it faces.

## Where a PlayerStart counts

A [PlayerStart](api:PlayerStart) is used only inside `world`, directly or inside folders, models or parts. One stored anywhere else, such as `game.Storage`, is not used.

## Several PlayerStarts

Each spawn picks one [PlayerStart](api:PlayerStart) in `world` whose [Enabled](api:PlayerStart.Enabled) is `true`, at random; see [Where characters appear](../players/health-and-respawning.md#where-characters-appear). The random choice is made again for every spawn, respawns included, so a player who dies may come back somewhere else.

There is no round-robin and no least-crowded logic: with two `PlayerStart` objects and four players, all four can land on the same one. A character already standing on a `PlayerStart` makes the next one appear on top of it. To avoid stacking, place several `PlayerStart` objects a few studs apart.

## Turning a PlayerStart off

Set [Enabled](api:PlayerStart.Enabled) to false, in the Properties panel or from a server script, and the random choice skips that [PlayerStart](api:PlayerStart). Set it back to true and it is used again.

When players appear in the middle of the map instead of at your `PlayerStart`, check that it is inside `world` and that its `Enabled` is true.

## With no PlayerStart

With no enabled [PlayerStart](api:PlayerStart), characters appear on the highest surface directly above or below the world origin (X = 0, Z = 0), or at the origin itself when nothing is there. Place at least one `PlayerStart` in any world you intend to publish.

## Sending a player to a chosen start

To send one player to a chosen start every time, set [player.PlayerStartOverride](api:Player.PlayerStartOverride); see [Where characters appear](../players/health-and-respawning.md#where-characters-appear).

`PlayerStartOverride` takes effect at the player's next spawn. It does not move a character that already exists. Call [player.LoadCharacter()](api:Player.LoadCharacter) if you want the player moved to the `PlayerStartOverride` start now.

## Troubleshooting

| What you see | Fix |
|---|---|
| Players appear in the middle of the map instead of at your [PlayerStart](api:PlayerStart). | Check that it is inside `world` and that its [Enabled](api:PlayerStart.Enabled) is true; see [Where a PlayerStart counts](#where-a-playerstart-counts), [Turning a PlayerStart off](#turning-a-playerstart-off) and [With no PlayerStart](#with-no-playerstart). |
| Players appear sunk into the floor or high above it. | Put a [PlayerStart](api:PlayerStart) on the surface players should stand on; see [Where the character appears](#where-the-character-appears). |
| Players appear stacked on each other. | Place several [PlayerStart](api:PlayerStart) objects a few studs apart; see [Several PlayerStarts](#several-playerstarts). |
| Players face the wrong way. | Rotate the [PlayerStart](api:PlayerStart) around the Y axis; see [Where the character appears](#where-the-character-appears). |
