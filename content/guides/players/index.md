---
title: Players and data
description: Who is in a world, the body each one controls, and data that outlives a server
---

# Players and data

In TruWorlds a person is a [Player](api:Player). The body a player controls is a separate object from their `Player`, called a [character](players-and-characters.md). A player's character is replaced [every time they respawn](health-and-respawning.md). A character is a [CharacterController](api:CharacterController): a [Model](api:Model) that [walks, runs, jumps](character-movement.md), climbs, sits, trips, holds a tool and dies. The [player list](leaderboards.md) shows values.

## Characters and avatars

[PlayerDefaults](api:PlayerDefaults) holds the [DefaultCharacter](player-defaults.md), the template every player's character is copied from. An [Avatar](avatars.md) is the standard TruWorlds character body, with a head, a torso, two arms and two legs, that every player has by default. A character's body [does not have to be an `Avatar`](custom-characters.md#bodies-that-are-not-an-avatar): any physics body inside the character, such as a [Part](api:Part) or a [MeshPart](api:MeshPart), can be its [PrimaryBody](api:Model.PrimaryBody).

## Saving data

Values in a running server disappear when the server closes.

- The [DataSystem](saving-data.md) saves them.
- A [shutdown handler](handling-shutdowns.md) makes sure nothing is lost when a server ends.
- The [Data Browser](data-browser.md) lets you inspect saved values.
