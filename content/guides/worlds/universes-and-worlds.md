---
title: Universes and worlds
description: Projects, the worlds inside them, and the Starting World
---

# Universes and worlds

A *project* is one game as players see it: one page, one name, one Play button. Scripts and IDs call a project a *universe*. A world is one playable place inside a project: one tree of parts, scripts and files, saved as one file. A project has at least one. Exactly one world in each project is the *Starting World*. Pressing Play always opens it. Each world of a project is built, saved and published separately in TruWorlds Creator. A server is one running copy of a world, with the players in it right now. A busy world runs many servers at once; see the [client-server boundary](../networking/client-server-model.md).

## When a second world helps

A single world is right for most games, and simpler.

Reach for a second world for separate groups of players: a lobby where everyone mixes, and matches for fixed groups, each in its own server of an arena world.

Reach for a second world for different rules or sizes: a social hub for 50 players and a boss fight for 4.

Reach for a second world for very different places that never need to be loaded together, such as an overworld and a dungeon.

## When one world is better

Think twice about a second world when the areas are small: one world with several areas, and characters moved between them by position, is far simpler. Moving a character inside a world is instant; teleporting to another world shows a loading screen. To move a character by position, see [Teleporting a character](../players/character-movement.md#teleporting-a-character).

Think twice about a second world when you would rely on state in a server's memory. Nothing in a server's memory survives the [trip to another world](teleport-data.md).

## What the worlds of a project share

The worlds of a project share nothing inside a world: parts, scripts, files and running servers are separate. Passes and products belong to a project (a universe), so every world in the project sells the same ones; see [Monetization](../gameplay/monetization.md).

| What | Between the worlds of a project |
|---|---|
| Page | The worlds of a project share its page, name, description, pictures, genre and tags: players see one page for the whole project. |
| Scripts | The worlds of a project do not share scripts and other files: a script used in two worlds exists twice and is edited twice. |
| Servers | The worlds of a project do not share running servers or their memory: variables, value objects, leaderboard values, positions, health and inventories exist in one server only. |

## Publishing each world

Publishing one world does not publish the others. If you change a script that exists in two worlds, change and publish both. See [Saving and publishing](../creator/saving-and-publishing.md).

## Where a script is running

[`game`](api:global/game) carries a few properties and one signal that tell a script where it is running; see [Handling shutdowns](../players/handling-shutdowns.md) for the signal.

This server script prints the world's ID, the project's ID, the Starting World's ID, whether this is the Starting World, the server's ID and whether the server is reserved. It runs from a [`Folder`](api:Folder) in [`game.ScriptSystem`](api:ScriptSystem).

```truscript
print("World " + game.WorldId + " of project " + game.UniverseId)
print("Starting World: " + game.StartingWorldId + ", is this it? " + tostring(game.IsStartingWorld))
print("Server: [" + game.ServerId + "], reserved: " + tostring(game.IsReservedServer))
# Output in a playtest of a world that has never been published:
# World 0 of project 0
# Starting World: 0, is this it? false
# Server: [], reserved: false
```

In a playtest of a world that has never been published, it prints `World 0 of project 0`, then `Starting World: 0, is this it? false`, then `Server: [], reserved: false`.

Scripts use a world's World ID to teleport players to it. In a script, [`game.WorldId`](api:DataModel.WorldId) is the World ID of the world the script is running in. It is `0` when the world has not been published.

[`game.UniverseId`](api:DataModel.UniverseId) is the ID of the project (universe) the world belongs to, or `0` when the world has not been published.

[`game.StartingWorldId`](api:DataModel.StartingWorldId) is the World ID of the project's Starting World, in every world of the project. It is `0` when the world has not been published.

[`game.IsStartingWorld`](api:DataModel.IsStartingWorld) is `true` in the Starting World and `false` in other worlds. It is `false` when the world has not been published.

[`game.ServerId`](api:DataModel.ServerId) is text that identifies the running server. It is empty in a playtest in TruWorlds Creator.

[`game.WorldId`](api:DataModel.WorldId), [`game.UniverseId`](api:DataModel.UniverseId), [`game.StartingWorldId`](api:DataModel.StartingWorldId), [`game.IsStartingWorld`](api:DataModel.IsStartingWorld), [`game.ServerId`](api:DataModel.ServerId) and [`game.IsReservedServer`](api:DataModel.IsReservedServer) are read-only and can be read by server scripts and client scripts alike. For `game.IsReservedServer`, see [Reserved servers](reserved-servers.md).

## Planning a game of several worlds

Make each world work alone: a non-starting world must still run when somebody joins it directly with no teleport data. Every playtest needs that, since teleports do not work in a playtest; see [Teleporting](teleporting.md).

Always give players a way back: a world reachable only by teleport should offer a teleport back to [`game.StartingWorldId`](api:DataModel.StartingWorldId).

## Troubleshooting

| What you see | Fix |
|---|---|
| You changed a script but the other world still has the old behavior. | Change and publish both worlds: see [What the worlds of a project share](#what-the-worlds-of-a-project-share) and [Publishing each world](#publishing-each-world). |
