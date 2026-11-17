---
title: Health and respawning
description: Damage and death, and how a dead player gets a new character
---

# Health and respawning

Every [character](players-and-characters.md) has [Health](api:CharacterController.Health) and [MaxHealth](api:CharacterController.MaxHealth).

## Changing health

`Damage(amount)` subtracts `amount` from [Health](api:CharacterController.Health) and fires [Damaged](api:CharacterController.Damaged). A negative amount heals and does not fire `Damaged`; neither does an amount of 0. It does nothing to a character that is already dead.

`Health` always stays between 0 and [MaxHealth](api:CharacterController.MaxHealth); a value outside that is quietly corrected. Set `MaxHealth` before `Health`, because `Health` cannot go above the current `MaxHealth`.

> [!WARNING]
> Change health from server scripts: the server decides who is alive, and a hit that a player's device reports must be checked on the server first.

For how a hit is checked on the server, see [Trusting the client](../networking/trusting-the-client.md).

## Example: Lava that takes health

This server script, attached to a Part used as lava, takes 20 health from a character that touches the part, at most once every half second per character.

```truscript
local recently_hit = {}

func on_touch(other):
    if other == nil or other.Parent == nil:
        return
    local character = other.Parent
    if not character.IsA("CharacterController"):
        return
    if recently_hit[character.Name]:
        return
    recently_hit[character.Name] = true
    character.Damage(20)
    wait(0.5)
    recently_hit[character.Name] = nil

this.Touched.Connect(on_touch)
```

## What kills a character

A character dies when its [Health](api:CharacterController.Health) reaches 0, by [Damage](api:CharacterController.Damage), [Kill](api:CharacterController.Kill), [ResetCharacter](api:Player.ResetCharacter) or setting `Health`. For how a character respawns, see [Respawning](#respawning). A character whose [PrimaryBody](api:Model.PrimaryBody) is removed or destroyed dies. A character whose body drops below `world.VoidHeight` ([VoidHeight](api:World.VoidHeight)) dies.

When a character dies, its [State](api:CharacterController.State) becomes `Dead`, `Health` is held at 0, the death sound plays, and [Damaged](api:CharacterController.Damaged) then [Died](api:CharacterController.Died) fire.

## Knowing who died

Each new character has its own [Died](api:CharacterController.Died) signal. Connect `Died` again for each new character, inside the [CharacterAdded](api:Player.CharacterAdded) handler, as [Players and characters](players-and-characters.md#reaching-the-character) showed.

## Respawning

When a player's character dies, the server spawns a new one after `game.Players.RespawnTime` seconds, with no script needed. For a different respawn delay, set `game.Players.RespawnTime` on the server, in the Properties panel or from a server script.

To respawn someone now, call `player.LoadCharacter()` from a server script: it replaces the current character, even a living one, and cancels a waiting respawn. [ResetCharacter](api:Player.ResetCharacter) kills the player's character as if it had died, so it respawns after [RespawnTime](api:Players.RespawnTime). For the template each new character is copied from, see [Player defaults](player-defaults.md#when-a-change-takes-effect).

## Where characters appear

Each spawn picks one [PlayerStart](api:PlayerStart) in `world` whose [Enabled](api:PlayerStart.Enabled) is `true`, at random. For the start itself, see [PlayerStart and spawning](../playtesting/player-start-and-spawning.md). `player.PlayerStartOverride` sends one player to a chosen start every time. [PlayerStartOverride](api:Player.PlayerStartOverride) is used even when that start is disabled.

For a checkpoint, disable its `PlayerStart` so nobody lands there by chance, and point the players who reached it at it with `PlayerStartOverride`.

## Example: A checkpoint pad

This server script, attached to a Part used as a checkpoint pad, makes each player who touches the pad spawn at its checkpoint from then on. The pad has a `PlayerStart` child named "Checkpoint" with `Enabled` turned off.

```truscript
local checkpoint = this.WaitForChild("Checkpoint")

func on_touch(other):
    if other == nil or other.Parent == nil:
        return
    local player = game.Players.GetPlayerFromCharacter(other.Parent)
    if player and player.PlayerStartOverride != checkpoint:
        player.PlayerStartOverride = checkpoint
        print(player.Name + " reached " + this.Name)

this.Touched.Connect(on_touch)
```

## Troubleshooting

| What you see | Fix |
|---|---|
| [Health](api:CharacterController.Health) ends up lower than the value you set. | Set [MaxHealth](api:CharacterController.MaxHealth) before `Health`: [Changing health](#changing-health). |
