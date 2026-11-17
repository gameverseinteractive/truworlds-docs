---
title: The Animator
description: Load and play clips with the Animator and its tracks, and who may play them
---

# The Animator

An [`Animator`](api:Animator) plays clips on an [`Armature`](api:Armature). You ask it for a track, and you play the track.

## Where an Animator lives

An [`Animator`](api:Animator) plays on the skeleton it finds next to it, so where you put it decides what it animates. It only works while it is inside [`world`](api:global/world). Do not add a second `Animator` to an [`Avatar`](api:Avatar) or to a mesh that already has one.

| Parent | What it animates |
|---|---|
| An [`Avatar`](api:Avatar) | That avatar. Every character with an [`Avatar`](api:Avatar) body gets an [`Animator`](api:Animator) automatically. |
| A skinned [`MeshPart`](api:MeshPart) | That mesh. |

A [`Model`](api:Model) or [`Folder`](api:Folder) parent works too; [Adding the Animator](animating-meshparts.md#adding-the-animator) shows which mesh it picks.

## Getting the Animator

Read the [`Animator`](api:Animator) with `avatar.Animator` or `character.Animator`. For a short moment after a character whose body is an [`Avatar`](api:Avatar) appears, `character.Animator` is `nil`. Check `character.Animator` for `nil` before using it.

## Load once, play many times

You give an [`Animator`](api:Animator) a clip id and it gives you an [`AnimationTrack`](api:AnimationTrack): one playable copy of that clip. [`LoadClip`](api:Animator.LoadClip) starts nothing: it gives you a track to configure and play as often as you like. Load each [clip](animation-clips.md) once: keep the track in a variable and call `track.Play()` on it, or use [`PlayOneShot`](api:Animator.PlayOneShot) for fire-and-forget animations.

> [!WARNING]
> Calling `LoadClip` or [`Animator.Play`](api:Animator.Play) again and again (every time a key is pressed, say) piles up tracks: each call makes a new one, and a stopped track is not removed.

## Example: Press G to dance

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, lets you press G to dance. Pressing G while dancing restarts the dance from its first frame.

```truscript
local dance = nil

func on_character(character):
    local tries = 0
    while character.Animator == nil and tries < 50:
        wait(0.1)
        tries += 1
    if character.Animator != nil:
        dance = character.Animator.LoadClip("local://avatar/avatar.glb#HappyDance")
        dance.Looped = false

local player = game.Players.LocalPlayer
player.CharacterAdded.Connect(on_character)
if player.Character != nil:
    on_character(player.Character)

game.InputSystem.KeyPressed.Connect(func(key):
    if key == KeyName.G and dance != nil:
        dance.TimePosition = 0
        dance.Play(0.2)
)
```

## Playing and stopping

[`Play`](api:AnimationTrack.Play) continues from [`TimePosition`](api:AnimationTrack.TimePosition). Set `TimePosition = 0` first if you want a stopped track to start over. When an animation plays once and the character snaps back, set `Looped = true`, or `HoldOnEnd = true` to stay on the last frame.

| Member | What it does |
|---|---|
| [`Looped`](api:AnimationTrack.Looped) | Whether the clip starts again at its end. Until you set it, it takes the Loop setting the clip was imported with, once the clip loads. |
| [`HoldOnEnd`](api:AnimationTrack.HoldOnEnd) | When true, a non-looped clip freezes on its last frame instead of fading out. |
| `Play(fadeTime)` | Plays the track with the current [`Weight`](api:AnimationTrack.Weight) and [`Speed`](api:AnimationTrack.Speed), fading in over `fadeTime` seconds. |
| `Stop(fadeTime)` | Fades the track out over `fadeTime` seconds. It does nothing if the track is not playing. |

## One-shots

For `PlayOneShot`, the [`Animator`](api:Animator) makes the track, plays it once, and removes it after its fade-out has finished. Use it only with clips that do not loop.

## Example: A one-off dance

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes your own character dance three seconds after the script starts. Other players see it too.

```truscript
wait(3)
local character = game.Players.LocalPlayer.Character
if character != nil and character.Animator != nil:
    character.Animator.PlayOneShot("local://avatar/avatar.glb#HappyDance", 0.3)
```

## Cross-fading

`CrossFade(track, duration)` plays `track` over `duration` seconds and, over the same time, stops every other playing track on the same [`Priority`](layers-and-timing.md#layers) that is not [`additive`](api:AnimationTrack.Additive).

## Which side plays the animation

Only calls made on the side that owns an [`Animator`](api:Animator) are [sent to everyone else](../networking/replication.md). On a side that does not own the `Animator`, the same calls work but are not sent on.

Playing an animation on a player's character from a server script is not currently supported. Play it from a client script on the device of the player who owns the character.

| Animator under | Owned by |
|---|---|
| A player's character (its [`Avatar`](api:Avatar)) | That player's device. While that player is not connected, it is owned by the server. |
| A non-player character | The server. |
| A [`MeshPart`](api:MeshPart), or a [`Model`](api:Model) containing one, that nobody has taken ownership of | The server. |

## Troubleshooting

| What you see | Fix |
|---|---|
| You can see the animation but other players cannot. | Play the animation from a client script on the device of the player who owns the character: [Which side plays the animation](#which-side-plays-the-animation). |
| The world slows down the longer it runs. | Load each clip once, keep the track in a variable, and call `track.Play()` on it, or use [`PlayOneShot`](api:Animator.PlayOneShot): [Load once, play many times](#load-once-play-many-times). |
| The animation plays once and the character snaps back. | Set `Looped = true`, or `HoldOnEnd = true` to stay on the last frame: [Playing and stopping](#playing-and-stopping). |
