---
title: Player defaults
description: The template and settings every player and every new character starts from
---

# Player defaults

The [PlayerDefaults](api:PlayerDefaults) system holds what every player starts with, including the default character. You can see and edit `PlayerDefaults` in the Explorer of TruWorlds Creator without writing any script.

## The DefaultCharacter

The `DefaultCharacter` is the template every character is copied from; see [Players and data](index.md).

Walk speed, jump height, health, the name tag, animations and sounds are all set on the `DefaultCharacter`. The `DefaultCharacter` in a new world deliberately has no body inside it. When a character template has no [PrimaryBody](api:Model.PrimaryBody), TruWorlds adds the standard [Avatar](api:Avatar) to each copy and dresses it as the player.

To change a default, select `DefaultCharacter` (or [PlayerDefaults](api:PlayerDefaults) itself, for the settings it holds, such as the camera's) in the Explorer and change the value in the Properties panel; the next playtest uses it. For what each movement setting does, see [Character movement](character-movement.md).

## When a change takes effect

A change to the `DefaultCharacter` affects only characters spawned after the change. To apply a `DefaultCharacter` change to everyone at once, respawn them.

## Example: Respawning everyone after a change

This server script, attached to a Folder in `game.ScriptSystem`, sets the `DefaultCharacter`'s [JumpHeight](api:CharacterController.JumpHeight) to 20, then calls [LoadCharacter](api:Player.LoadCharacter) on every player in the world.

```truscript
func set_low_gravity_mode():
    local template = game.PlayerDefaults.WaitForChild("DefaultCharacter")
    template.JumpHeight = 20
    for player in game.Players.GetPlayers():
        player.LoadCharacter()

set_low_gravity_mode()
```

## The name tag

A character's name tag above its head shows the player's name, an optional title and a health bar. Players never see the name tag on their own character.

| Property | What it does |
|---|---|
| [NameMode](api:CharacterController.NameMode) | `Show` or `Hide` shows or hides the name above each character. |
| [TitleText](api:CharacterController.TitleText) | A line under the name, shown only while [NameMode](api:CharacterController.NameMode) is `Show`. |
| [HealthBarMode](api:CharacterController.HealthBarMode) | Sets the health bar above each character to `ShowWhenDamaged`, `AlwaysShow` or `AlwaysHide`. |

## Animations and sounds

A character with an [Avatar](api:Avatar) body animates by itself, for example idling when standing and blending walking and running by speed. The `Animations` folder inside the character controls its built-in animations. For these, see [Animating avatars](../animation/animating-avatars.md). A character with an `Avatar` body also plays a jump sound, footsteps and a death sound by itself.

## Camera and Ctrl-lock

[PlayerDefaults](api:PlayerDefaults) holds the camera limits that apply to every player. For the camera, see [Camera](../gameplay/camera.md). [CameraMinZoomDistance](api:PlayerDefaults.CameraMinZoomDistance), [CameraMaxZoomDistance](api:PlayerDefaults.CameraMaxZoomDistance) and [CameraOffset](api:PlayerDefaults.CameraOffset) are applied to each player's camera when they join. A change during play reaches every player's camera straight away.

Ctrl-lock is the toggle that captures the mouse so a player can look around without holding a mouse button. `PlayerDefaults` holds the Ctrl-lock setting every joining player starts with, [CtrlLockMode](api:PlayerDefaults.CtrlLockMode).

## Starting tools and values

Anything else in [PlayerDefaults](api:PlayerDefaults) is copied to each player when they join: tools into their [Inventory](api:Inventory), everything else under their [Player](api:Player). For tools, see [Inventory](../gameplay/inventory.md). At every spawn, a starting tool the player no longer has (matched by [Name](api:Instance.Name)) is copied in again, so a tool lost on death comes back. The copied values are not made again on respawn, so they survive a death.

Put a [Folder](api:Folder) named `Stats` holding a [NumberValue](api:NumberValue) named `Coins` in `PlayerDefaults`, and every player gets their own `Stats > Coins`, shown at once as a player list column; see [Leaderboards](leaderboards.md).

The values copied from `PlayerDefaults` are not saved between visits; see [Saving data](saving-data.md).
