---
title: Animating avatars
description: Animate the standard avatar and replace its movement animations
---

# Animating avatars

The [`Avatar`](../players/avatars.md) is already rigged: it has a skeleton of 25 bones, an [`Animator`](api:Animator), and a set of built-in animations that play by themselves as the character moves. When an [Avatar](api:Avatar) becomes the body of a character, it is given two children automatically: an `Animator` and an [`Armature`](api:Armature). An `Avatar`'s skeleton is always humanoid.

## The built-in movement animations

For a character with an [`Avatar`](api:Avatar) body, each moment TruWorlds looks at the character's [`State`](../players/character-movement.md) and plays the matching clip. All the built-in movement animations play on the [`AnimationPriority.Movement`](api:AnimationPriority) layer (2).

## Making your own avatar animations

The [TruWorlds Engine Assets](https://github.com/gameverseinteractive/truworlds-engine-assets) repository holds assets used in TruWorlds that you can use to create your own content. The most important is the TruWorlds avatar rig, as a `.glb` file (`truworlds-avatar.glb`) and as a Blender file (`truworlds-avatar.blend`). The Blender file needs Blender 5.2.2 LTS or newer. Read the LICENSE file in the repository for how you may use its assets.

[Animating in Blender](animating-in-blender.md) shows how to pose the rig and export your animations.

## Replacing a movement animation

The `Animations` folder inside the character [controls its built-in animations](../players/player-defaults.md#animations-and-sounds). To replace the walk animation for everyone, select `PlayerDefaults > DefaultCharacter > Animations > Walk` ([PlayerDefaults](../players/player-defaults.md)) and paste your clip id into `Value`.

To replace an animation for one character during play, set the value on that character's own `Animations` folder.

Import and upload a replacement animation with Loop on for the `Idle`, `Walk`, `Run`, `Fall` and `Climb` slots.

## Example: A sprint pad

This server script, attached to a part, gives a character a different run animation when it touches the part.

```truscript
local SPRINT = "asset://123456"         # replace with the id of your own looping run animation

this.Touched.Connect(func(other):
    local character = other.Parent
    if character == nil or not character.IsA("CharacterController"):
        return
    local folder = character.FindFirstChild("Animations")
    if folder == nil:
        return
    folder.FindFirstChild("Run").Value = SPRINT
)
```

## Turning the built-in animations off

Set `AutoAnimate` to `false` to stop the built-in movement animations completely, so your own scripts can animate the character.

This server script, attached to a folder in `game.ScriptSystem`, makes every player's character stop animating by itself. Their bodies glide around in the rest pose until some other script plays animations on them.

```truscript
game.Players.PlayerAdded.Connect(func(player):
    player.CharacterAdded.Connect(func(character):
        local folder = character.WaitForChild("Animations", 5)
        if folder != nil:
            folder.FindFirstChild("AutoAnimate").Value = false
    )
)
```

## Playing an action

An action is an animation you add on top of the movement animations, such as a wave, a dance, a sword swing or a reload. An action that should not stop the legs gets `Mask = BoneMask.UpperBody` (or `RightArm`, `Head`...); see [Mask](layers-and-timing.md#bone-masks).

When a player respawns, the new character has a new [`Animator`](api:Animator). The tracks loaded on the old character went away with it. Load tracks again in `CharacterAdded`.

## Animating from the server

Playing an animation on a player's character from a server script is not currently supported; see [Which side plays the animation](animator.md#which-side-plays-the-animation). When the server decides that a character should animate (a player was hit, a round was won), it [tells the owning device](../networking/remote-communication.md), and that device plays the clip.

An emote that is played on a player's character from another player's device does not show for other players.

## AvatarPoseNode

[`AvatarPoseNode`](api:AvatarPoseNode) is deprecated. Do not use it in new worlds. To find where a part of a character is, [read the bone](armatures-and-bones.md) from the [`Armature`](api:Armature) instead.

## Troubleshooting

| What you see | Fix |
|---|---|
| Your emote shows for you but not for other players, or not at all. | Play the animation from a client script on the device of the player who owns the character: [Animating from the server](#animating-from-the-server), [Which side plays the animation](animator.md#which-side-plays-the-animation). |
| Your emote stops working after you respawn. | Load tracks again in `CharacterAdded`: [Playing an action](#playing-an-action). |
