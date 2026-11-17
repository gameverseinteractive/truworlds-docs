---
title: Character movement
description: Movement settings, jumping, and moving a character from a script
---

# Character movement

When [UseDefaultMovement](api:CharacterController.UseDefaultMovement) is on, TruWorlds moves and turns the [character](players-and-characters.md).

## Movement settings

The character movement speeds [MoveSpeed](api:CharacterController.MoveSpeed), [RunSpeed](api:CharacterController.RunSpeed) and [JumpForce](api:CharacterController.JumpForce) are in studs per second. [MaxSlopeAngle](api:CharacterController.MaxSlopeAngle) is the steepest slope, in degrees, the character walks up without sliding. [AirControl](api:CharacterController.AirControl), from 0 to 1, is how much steering the character keeps in the air. It changes how fast it speeds up and slows down there, not its top speed.

A movement setting given a value outside its range is set to the nearest end of the range.

[UsePlayerInput](api:CharacterController.UsePlayerInput) decides whether the player's keys drive the character; turn it off when scripts move the players. To set a value for every player, see [Player defaults](player-defaults.md).

## Jumping and gravity

`world.Gravity` ([Gravity](api:World.Gravity)) also affects how characters jump and fall. [JumpForce](api:CharacterController.JumpForce) is a jump's upward speed at its start, in studs per second. Changing `JumpForce` or [JumpHeight](api:CharacterController.JumpHeight) changes the other. `JumpForce` is the value a character really keeps. So changing `world.Gravity` keeps `JumpForce` and changes the real jump: with the default `JumpForce`, halving gravity from `175` to `87.5` makes `JumpHeight` read about `15.3` instead of about `7.5`, and characters jump about twice as high.

To get the old jump back after changing `world.Gravity`, set `JumpHeight` again after the change.

## Teleporting a character

Setting `character.Position` or calling `character.PivotTo(cmatrix)` teleports the character, feet at that point, with no walking and no animation. Move a player's character through the character itself, never by setting the position of its body parts.

## Example: A teleport pad

This server script, attached to a Part used as a pad, teleports a character that touches the pad onto the top of the part named Exit. A Part named "Exit" exists in `world`.

```truscript
local exit_part = world.WaitForChild("Exit")

func on_touch(other):
    if other == nil or other.Parent == nil:
        return
    local character = other.Parent
    if character.IsA("CharacterController"):
        character.Position = exit_part.Position + new Vector3(0, exit_part.Size.Y / 2, 0)

this.Touched.Connect(on_touch)
```

## Walking to a point

`character.MoveTo(target)` walks the character in a straight line toward a point. `character.PathTo(destination)` walks around obstacles.

A client script can call `character.MoveTo(target)` on the local player's own character, and it walks there. A server script that calls [MoveTo](api:CharacterController.MoveTo) on a player's character gets no error and no movement. For the server to choose where a player walks, send the target to that player's device with a [remote event](../networking/remote-communication.md) and call `MoveTo` there, or set `character.Position` on the server. For which machine moves a character, see [Network ownership](../physics/network-ownership.md).

## Non-player characters

To build a character that belongs to no player, in a server script, make a [CharacterController](api:CharacterController), give it an [Avatar](api:Avatar), set [PrimaryBody](api:Model.PrimaryBody), and put it in `world`. Only the server moves non-player characters. Call [MoveTo](api:CharacterController.MoveTo) and [PathTo](api:CharacterController.PathTo) on a non-player character from a server script.

[GetPlayerFromCharacter](api:Players.GetPlayerFromCharacter) finds no player for a non-player character, which is how a script tells the two apart. Non-player characters do not respawn on their own.

## Moving a character with your own script

For movement the built-in walking cannot give, such as a drifting hovercraft or a hopping creature, set the character's [UseDefaultMovement](api:CharacterController.UseDefaultMovement) to `false` and move it yourself. Move a character whose `UseDefaultMovement` is `false` with [movers](../physics/forces-and-movers.md) or by setting its body's [LinearVelocity](api:PhysicsInstance.LinearVelocity).

Run the script that moves a character whose `UseDefaultMovement` is `false` on the machine that moves the character: a server script for a non-player character, a client script on the player's own device for a player's character.
