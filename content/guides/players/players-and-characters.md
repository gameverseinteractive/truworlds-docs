---
title: Players and characters
description: The Players system, joining and leaving, and each player's character
---

# Players and characters

Every person in a world is two objects, a [Player](api:Player) and a character, and almost every gameplay script touches both. A `Player` is the person: their account name, their account number, their tools, their stats. A character is the body a player walks around in: a [CharacterController](api:CharacterController) in the world.

## Player and character compared

| What differs | Player and character |
|---|---|
| Where it lives | A [Player](api:Player) lives under `game.Players`. A character lives under `world`, named after the player. |
| Created by | TruWorlds creates a [Player](api:Player) when the person joins, and scripts cannot create one. TruWorlds creates a character at each spawn, and scripts can also build characters for non-player characters. |
| Getting the other | From a [Player](api:Player), `player.Character` gives the character. From a character, `game.Players.GetPlayerFromCharacter(character)` gives the [Player](api:Player). |

## Joining and leaving

`game.Players` is a [game system](../engine/instance-tree.md): one built-in object that always exists under `game`. [PlayerAdded](api:Players.PlayerAdded) fires once for each person who joins, and hands your function the new [Player](api:Player). [PlayerRemoved](api:Players.PlayerRemoved) fires once when a person leaves.

A script can start after a player has joined: always for a script on something cloned into the world later, and sometimes at the start of a playtest. Connecting only `PlayerAdded` never sets those players up. Connect `PlayerAdded`, then loop over the players who are already there and call the same function for each.

This server script, attached to a Folder in `game.ScriptSystem`, runs the same set-up function for each player who joins and for each player already in the world.

```truscript
func on_join(player):
    print("Setting up " + player.Name)

game.Players.PlayerAdded.Connect(on_join)
for player in game.Players.GetPlayers():
    on_join(player)
```

To reach the Inventory or something copied from [PlayerDefaults](api:PlayerDefaults), use `player.WaitForChild("Inventory")` (or the child's name), not `player.Inventory` or [FindFirstChild](api:Instance.FindFirstChild). See [Player defaults](player-defaults.md).

## After a player leaves

When a person leaves, the server destroys their character, then removes the [Player](api:Player). A [PlayerRemoved](api:Players.PlayerRemoved) function still receives the `Player`, with [Name](api:Instance.Name) and [UserId](api:Player.UserId) readable, which is all you need to save their data; see [The session pattern](saving-data.md#the-session-pattern). Its children are already gone by then: no [Inventory](api:Inventory), nothing copied from [PlayerDefaults](api:PlayerDefaults). For when the whole server closes, see [Handling shutdowns](handling-shutdowns.md).

## The local player

In a client script, [LocalPlayer](api:Players.LocalPlayer) is the [Player](api:Player) of the device the script runs on: `game.Players.LocalPlayer`. On the server, `LocalPlayer` is `nil`. In a server script, use the `Player` that the signal or [remote event](../networking/remote-communication.md) hands you, not `LocalPlayer`.

## Kicking a player

[Kick](api:Player.Kick) removes a player and shows them a message. `Kick` works only in a server script; called from a client script, it does nothing.

## Reaching the character

A player's character may or may not exist yet when your join function runs. To reach it, connect [CharacterAdded](api:Player.CharacterAdded) and also handle a character already in `player.Character`.

Store the [Player](api:Player) and read `player.Character` when you need the body, or connect `CharacterAdded`. For respawning, see [Health and respawning](health-and-respawning.md).

## Example: A title and a faster walk on every character

This server script, attached to a Folder in `game.ScriptSystem`, gives every character a title under its name and a faster walk when it spawns.

```truscript
func on_join(player):
    func on_spawn(character):
        character.MoveSpeed = 20
        character.TitleText = "Explorer"
        print(player.Name + " spawned")

    player.CharacterAdded.Connect(on_spawn)
    if player.Character:
        on_spawn(player.Character)

game.Players.PlayerAdded.Connect(on_join)
for player in game.Players.GetPlayers():
    on_join(player)

# Expected output each time Player1 spawns:
# Player1 spawned
```

It prints `Player1 spawned` each time Player1 spawns.

## Where a character stands

`character.CMatrix`, like `character.Position`, is the point the character stands on, at its feet. `character.BodyCMatrix.Position` is the middle of the character's body. For the size of the standard body, see [Avatars](avatars.md).

## From a touched part to the player

[Touched](api:PhysicsInstance.Touched) gives you the body part that touched, not the character and not the [Player](api:Player). Pass the character, not the body, to [GetPlayerFromCharacter](api:Players.GetPlayerFromCharacter); see [Touch and overlap](../physics/touch-and-overlap.md#touched).

This server script, attached to a Part, prints which player stepped on the part, or that a non-player character did.

```truscript
func on_touch(other):
    if other == nil or other.Parent == nil:
        return
    local character = other.Parent
    if not character.IsA("CharacterController"):
        return
    local player = game.Players.GetPlayerFromCharacter(character)
    if player:
        print(player.Name + " stepped on " + this.Name)
    else:
        print("A non-player character stepped on " + this.Name)

this.Touched.Connect(on_touch)
```

## Values for each player

Children of a [Player](api:Player) are the normal place for per-player state that the server and that player's own scripts can both find, such as a `Stats` folder or your own value objects. For the `Stats` folder, see [Leaderboards](leaderboards.md). Children of a `Player` are sent to every player's device. Never put secrets in them; for secrets, see [Trusting the client](../networking/trusting-the-client.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| Some players, or their first character, are never set up. | Connect [PlayerAdded](api:Players.PlayerAdded), then loop over players already there ([Joining and leaving](#joining-and-leaving)); connect [CharacterAdded](api:Player.CharacterAdded) and handle `player.Character` too ([Reaching the character](#reaching-the-character)). |
| A server script that uses [LocalPlayer](api:Players.LocalPlayer) stops with an error: `nil has no member named 'Name'.` | In a server script, use the [Player](api:Player) that the signal or remote event hands you, not `LocalPlayer`: [The local player](#the-local-player). |
| A player touches the part, but no player is found. | Pass the character, not the body, to [GetPlayerFromCharacter](api:Players.GetPlayerFromCharacter); see [Touch and overlap](../physics/touch-and-overlap.md#touched). |
